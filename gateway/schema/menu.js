const axios = require('axios');
const {
  GraphQLList,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

const { MenuType } = require('./types');
const MENU_SERVICE_URL =
  process.env.MENU_SERVICE_URL || 'http://localhost:3001/graphql';
  
const INTERNAL_KEY = 'GATEWAY_SECRET_123';

module.exports = {

  /* ======================
      QUERY
  ====================== */

  menus: {
  type: new GraphQLList(MenuType),
  async resolve(parent, args, context) {
    try {
      const res = await axios.post(
        MENU_SERVICE_URL,
        {
          query: `
            query {
              menus {
                id_produk
                nama_produk
                harga
                kategori
                stok
              }
            }
          `
        },
        {
          headers: {
            'x-internal-key': INTERNAL_KEY
          }
        }
      );

      if (res.data.errors) {
        console.error(res.data.errors);
        return [];
      }

      return res.data.data?.menus || [];
    } catch (err) {
      console.error('Menu Service Error:', err.message);
      return [];
    }
  }
},

  menu: {
    type: MenuType,
    args: {
      id_produk: { type: GraphQLInt }
    },
    async resolve(_, args) {
      try {
        const res = await axios.post(
          MENU_SERVICE_URL,
          {
            query: `
              query {
                menu(id_produk: ${args.id_produk}) {
                  id_produk
                  nama_produk
                  harga
                  kategori
                  stok
                }
              }
            `
          },
          {
            headers: { 'x-internal-key': INTERNAL_KEY }
          }
        );
        return res.data.data.menu;
      } catch (error) {
        console.error("Error fetching single menu:", error.message);
        return null;
      }
    }
  },

  /* ======================
      MUTATION (ADMIN ONLY)
  ====================== */

  createMenu: {
    type: MenuType,
    args: {
      nama_produk: { type: GraphQLNonNull(GraphQLString) },
      harga: { type: GraphQLNonNull(GraphQLInt) },
      kategori: { type: GraphQLNonNull(GraphQLString) },
      stok: { type: GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_, args, context) {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Admin only');
      }

      const res = await axios.post(
        MENU_SERVICE_URL,
        {
          query: `
            mutation {
              createMenu(
                nama_produk: "${args.nama_produk}"
                harga: ${args.harga}
                kategori: "${args.kategori}"
                stok: ${args.stok}
              ) {
                id_produk
                nama_produk
                harga
                kategori
                stok
              }
            }
          `
        },
        {
          headers: { 'x-internal-key': INTERNAL_KEY }
        }
      );
      return res.data.data.createMenu;
    }
  },

  updateMenu: {
    type: MenuType,
    args: {
      id_produk: { type: GraphQLNonNull(GraphQLInt) },
      nama_produk: { type: GraphQLString },
      harga: { type: GraphQLInt },
      kategori: { type: GraphQLString },
      stok: { type: GraphQLInt }
    },
    async resolve(_, args, context) {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Admin only');
      }

      const fields = [];
      if (args.nama_produk) fields.push(`nama_produk: "${args.nama_produk}"`);
      if (args.harga !== undefined) fields.push(`harga: ${args.harga}`);
      if (args.kategori) fields.push(`kategori: "${args.kategori}"`);
      if (args.stok !== undefined) fields.push(`stok: ${args.stok}`);

      const res = await axios.post(
        MENU_SERVICE_URL,
        {
          query: `
            mutation {
              updateMenu(
                id_produk: ${args.id_produk}
                ${fields.join('\n')}
              ) {
                id_produk
                nama_produk
                harga
                kategori
                stok
              }
            }
          `
        },
        {
          headers: { 'x-internal-key': INTERNAL_KEY }
        }
      );
      return res.data.data.updateMenu;
    }
  },

  deleteMenu: {
    type: MenuType, 
    args: { id_produk: { type: GraphQLNonNull(GraphQLInt) } },
    async resolve(_, args, context) {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Admin only');
      }

      const res = await axios.post(
        MENU_SERVICE_URL,
        {
          query: `
            mutation {
              deleteMenu(id_produk: ${args.id_produk}) {
                id_produk
                nama_produk
              }
            }
          `
        },
        {
          headers: { 'x-internal-key': INTERNAL_KEY }
        }
      );
      
      return res.data.data.deleteMenu;
    }
  }
};