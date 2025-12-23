const axios = require('axios');
const { GraphQLInt, GraphQLNonNull } = require('graphql');
const { OrderType, OrderStatusEnum } = require('./types.js');

module.exports = {

  createOrder: {
    type: OrderType,
    args: {
      id_produk: { type: GraphQLNonNull(GraphQLInt) },
      jumlah: { type: GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_, args, context) {

      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const res = await axios.post(
        'http://localhost:3002/graphql',
        {
          query: `
            mutation {
              createOrder(
                id_produk: ${args.id_produk}
                jumlah: ${args.jumlah}
              ) {
                id_order
                total_harga
                status
              }
            }
          `
        },
        {
          headers: {
            'x-internal-key': 'GATEWAY_SECRET_123'
          }
        }
      );

      return res.data.data.createOrder;
    }
  },

  updateOrderStatus: {
    type: OrderType,
    args: {
      id_order: { type: GraphQLNonNull(GraphQLInt) },
      status: { type: GraphQLNonNull(OrderStatusEnum) }
    },
    async resolve(_, args, context) {

      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Admin only');
      }

      const res = await axios.post(
        'http://localhost:3002/graphql',
        {
          query: `
            mutation UpdateOrder($id: Int!, $status: OrderStatus!) {
              updateOrderStatus(
                id_order: $id
                status: $status
              ) {
                id_order
                status
              }
            }
          `,
          variables: {
            id: args.id_order,
            status: args.status
          }
        },
        {
          headers: {
            'x-internal-key': 'GATEWAY_SECRET_123'
          }
        }
      );

      return res.data.data.updateOrderStatus;
    }
  }

};
