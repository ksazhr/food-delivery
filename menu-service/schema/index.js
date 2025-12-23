const graphql = require('graphql');
const menuDB = require('../db/menu.db');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
  GraphQLSchema
} = graphql;

/* ======================
   MENU TYPE
====================== */
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

/* ======================
   ROOT QUERY
====================== */
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {

    // GET ALL MENU
    menus: {
      type: new GraphQLList(MenuType),
      async resolve() {
        const [rows] = await menuDB.query(
          'SELECT * FROM menu'
        );
        return rows;
      }
    },

    // GET MENU BY ID
    menu: {
      type: MenuType,
      args: {
        id_produk: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(_, args) {
        const [rows] = await menuDB.query(
          'SELECT * FROM menu WHERE id_produk = ?',
          [args.id_produk]
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

    // CREATE MENU
    createMenu: {
      type: MenuType,
      args: {
        nama_produk: { type: GraphQLNonNull(GraphQLString) },
        harga: { type: GraphQLNonNull(GraphQLInt) },
        kategori: { type: GraphQLString },
        stok: { type: GraphQLInt }
      },
      async resolve(_, args) {
        const [res] = await menuDB.query(
          'INSERT INTO menu (nama_produk, harga, kategori, stok) VALUES (?, ?, ?, ?)',
          [args.nama_produk, args.harga, args.kategori, args.stok]
        );

        return {
          id_produk: res.insertId,
          ...args
        };
      }
    },

    // UPDATE MENU
    updateMenu: {
      type: MenuType,
      args: {
        id_produk: { type: GraphQLNonNull(GraphQLInt) },
        nama_produk: { type: GraphQLString },
        harga: { type: GraphQLInt },
        kategori: { type: GraphQLString },
        stok: { type: GraphQLInt }
      },
      async resolve(_, args) {
        const { id_produk, ...data } = args;
        
        // Buat query string secara dinamis
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        if (keys.length > 0) {
          await menuDB.query(
            `UPDATE menu SET ${setClause} WHERE id_produk = ?`,
            [...values, id_produk]
          );
        }

        const [rows] = await menuDB.query(
          'SELECT * FROM menu WHERE id_produk = ?',
          [id_produk]
        );
        return rows[0];
      }
    },

    // DELETE MENU
    deleteMenu: {
      type: MenuType,
      args: {
        id_produk: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(_, args) {

        const [rows] = await menuDB.query(
          'SELECT * FROM menu WHERE id_produk = ?',
          [args.id_produk]
        );

        await menuDB.query(
          'DELETE FROM menu WHERE id_produk = ?',
          [args.id_produk]
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
