const { GraphQLObjectType, GraphQLSchema } = require('graphql');

const menu = require('./menu');
const order = require('./order');
const user = require('./user');
const payment = require('./payment');

/* ========= QUERY ========= */
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    menus: menu.menus,
    menu: menu.menu
  }
});

/* ========= MUTATION ========= */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // MENU
    createMenu: menu.createMenu,
    updateMenu: menu.updateMenu,
    deleteMenu: menu.deleteMenu,

    // ORDER
    createOrder: order.createOrder,
    updateOrderStatus: order.updateOrderStatus,

    // USER
    register: user.register,
    login: user.login,

    // PAYMENT
    payOrder: payment.payOrder
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
