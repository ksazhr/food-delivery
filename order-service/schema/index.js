const graphql = require('graphql');
const axios = require('axios');
const orderDB = require('../db/order.db');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema,
  GraphQLEnumType
} = graphql;

/* ======================
   ENUM STATUS
====================== */
const OrderStatusEnum = new GraphQLEnumType({
  name: 'OrderStatus',
  values: {
    PENDING: { value: 'PENDING' },
    DIPROSES: { value: 'DIPROSES' },
    DIKIRIM: { value: 'DIKIRIM' },
    SELESAI: { value: 'SELESAI' },
    BATAL: { value: 'BATAL' }
  }
});


/* ======================
   ORDER TYPE
====================== */
const OrderItemType = new GraphQLObjectType({
  name: 'OrderItem',
  fields: {
    id_item: { type: GraphQLInt },
    id_order: { type: GraphQLInt },
    id_produk: { type: GraphQLInt },
    jumlah: { type: GraphQLInt },
    harga_satuan: { type: GraphQLInt },
    subtotal: { type: GraphQLInt }
  }
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id_order: { type: GraphQLInt },
    total_harga: { type: GraphQLInt },
    status: { type: GraphQLString },

    items: {
      type: new GraphQLList(OrderItemType),
      async resolve(parent) {
        const [rows] = await orderDB.query(
          'SELECT * FROM order_items WHERE id_order = ?',
          [parent.id_order]
        );
        return rows;
      }
    }
  })
});



/* ======================
   ROOT QUERY
====================== */
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {

    orders: {
      type: new GraphQLList(OrderType),
      async resolve() {
        const [rows] = await orderDB.query('SELECT * FROM orders');
        return rows;
      }
    },

    order: {
      type: OrderType,
      args: {
        id_order: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(_, args) {
        const [rows] = await orderDB.query(
          'SELECT * FROM orders WHERE id_order = ?',
          [args.id_order]
        );
        return rows[0];
      }
    }

  }
});

/* ======================
   MUTATION
====================== */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    addOrderItem: {
      type: OrderItemType,
      args: {
        id_order: { type: GraphQLNonNull(GraphQLInt) },
        id_produk: { type: GraphQLNonNull(GraphQLInt) },
        jumlah: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(_, args) {

        // 1️⃣ Ambil harga produk dari Menu Service
        const res = await axios.post(
          'http://localhost:3001/graphql',
          {
            query: `
              query ($id: Int!) {
                menu(id_produk: $id) {
                  harga
                  stok
                }
              }
            `,
            variables: { id: args.id_produk }
          },
          {
            headers: { 'x-internal-key': 'GATEWAY_SECRET_123' }
          }
        );

        const menu = res.data.data.menu;
        if (!menu) throw new Error('Menu tidak ditemukan');
        if (menu.stok < args.jumlah) throw new Error('Stok tidak cukup');

        // 2️⃣ Hitung subtotal
        const subtotal = menu.harga * args.jumlah;

        // 3️⃣ Simpan ke order_items
        const [result] = await orderDB.query(
          `
          INSERT INTO order_items 
          (id_order, id_produk, jumlah, harga_satuan, subtotal)
          VALUES (?, ?, ?, ?, ?)
          `,
          [args.id_order, args.id_produk, args.jumlah, menu.harga, subtotal]
        );

        // 4️⃣ Update total_harga di orders
        await orderDB.query(
          `
          UPDATE orders 
          SET total_harga = total_harga + ?
          WHERE id_order = ?
          `,
          [subtotal, args.id_order]
        );

        // 5️⃣ Update stok di menu-service
        await axios.post(
          'http://localhost:3001/graphql',
          {
            query: `
              mutation ($id: Int!, $stok: Int!) {
                updateMenu(id_produk: $id, stok: $stok) {
                  id_produk
                }
              }
            `,
            variables: {
              id: args.id_produk,
              stok: menu.stok - args.jumlah
            }
          },
          {
            headers: { 'x-internal-key': 'GATEWAY_SECRET_123' }
          }
        );

        return {
          id_item: result.insertId,
          id_order: args.id_order,
          id_produk: args.id_produk,
          jumlah: args.jumlah,
          harga_satuan: menu.harga,
          subtotal
        };
      }
    },


    createOrder: {
      type: OrderType,
      args: {
        // JANGAN PERNAH tambah argumen 'harga' di sini!
        id_produk: { type: GraphQLNonNull(GraphQLInt) },
        jumlah: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(_, args) {
        // 1️⃣ Ambil info harga & stok asli dari Menu Service
        const res = await axios.post('http://localhost:3001/graphql', {
          query: `
            query($id: Int!) {
              menu(id_produk: $id) { harga stok }
            }
          `,
          variables: { id: args.id_produk }
        }, {
          headers: { 'x-internal-key': 'GATEWAY_SECRET_123' }
        });

        const menu = res.data.data.menu;
        if (!menu) throw new Error('Menu tidak ditemukan');
        if (menu.stok < args.jumlah) throw new Error('Stok tidak cukup');

        // 2️⃣ BACKEND MENGHITUNG (User tidak bisa manipulasi)
        const totalHarga = menu.harga * args.jumlah;

        // 3️⃣ Simpan ke Database Order
        const [result] = await orderDB.query(
          'INSERT INTO orders (id_produk, jumlah, total_harga, status) VALUES (?, ?, ?, ?)',
          [args.id_produk, args.jumlah, totalHarga, 'Pending']
        );

        // 4️⃣ Update Stok di Menu Service
        await axios.post('http://localhost:3001/graphql', {
          query: `
            mutation($id: Int!, $newStok: Int!) {
              updateMenu(id_produk: $id, stok: $newStok) { id_produk }
            }
          `,
          variables: { 
            id: args.id_produk, 
            newStok: menu.stok - args.jumlah 
          }
        }, {
          headers: { 'x-internal-key': 'GATEWAY_SECRET_123' }
        });

        return {
          id_order: result.insertId,
          id_produk: args.id_produk,
          jumlah: args.jumlah,
          total_harga: totalHarga,
          status: 'Pending'
        };
      }
    },


    // ADMIN UPDATE STATUS
    updateOrderStatus: {
      type: OrderType,
      args: {
        id_order: { type: GraphQLNonNull(GraphQLInt) },
        status: { type: GraphQLNonNull(OrderStatusEnum) }
      },
      async resolve(_, args) {

        await orderDB.query(
          'UPDATE orders SET status = ? WHERE id_order = ?',
          [args.status, args.id_order]
        );

        const [rows] = await orderDB.query(
          'SELECT * FROM orders WHERE id_order = ?',
          [args.id_order]
        );

        return rows[0];
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
