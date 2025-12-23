const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType,
  GraphQLList
} = require('graphql');

const MenuType = new GraphQLObjectType({
  name: 'Menu',
  fields: {
    id_produk: { type: GraphQLInt },
    nama_produk: { type: GraphQLString },
    harga: { type: GraphQLInt },
    kategori: { type: GraphQLString },
    stok: { type: GraphQLInt }
  }
});

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
        const axios = require('axios');

        const res = await axios.post(
          'http://localhost:3002/graphql',
          {
            query: `
              query ($id: Int!) {
                order(id_order: $id) {
                  id_order
                  items {
                    id_item
                    id_produk
                    jumlah
                    subtotal
                  }
                }
              }
            `,
            variables: { id: parent.id_order }
          },
          {
            headers: { 'x-internal-key': 'GATEWAY_SECRET_123' }
          }
        );

        return res.data.data.order.items;
      }
    }
  })
});


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

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: {
    id_payment: { type: GraphQLInt },
    id_order: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    status: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    nama: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString }
  }
});

module.exports = {
  MenuType,
  OrderItemType,
  OrderType,
  OrderStatusEnum,
  PaymentType,
  UserType
};

