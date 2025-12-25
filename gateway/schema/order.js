const axios = require('axios');
const { GraphQLInt, GraphQLNonNull, GraphQLList } = require('graphql');
const { OrderType, OrderStatusEnum, OrderItemType } = require('./types.js');

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || 'http://localhost:3002/graphql';

module.exports = {

  orders: {
    type: new GraphQLList(OrderType),
    async resolve(_, __, context) {

      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const res = await axios.post(
        ORDER_SERVICE_URL,
        {
          query: `
            query {
              orders {
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

      return res.data.data.orders;
    }
  },

  order: {
    type: OrderType,
    args: {
      id_order: { type: GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_, args, context) {

      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const res = await axios.post(
        ORDER_SERVICE_URL,
        {
          query: `
            query ($id: Int!) {
              order(id_order: $id) {
                id_order
                total_harga
                status
              }
            }
          `,
          variables: { id: args.id_order }
        },
        {
          headers: { 'x-internal-key': 'GATEWAY_SECRET_123' }
        }
      );

      return res.data.data.order;
    }
  },

  addOrderItem: {
    type: OrderItemType, // atau OrderItemType kalau mau lebih tepat
    args: {
      id_order: { type: GraphQLNonNull(GraphQLInt) },
      id_produk: { type: GraphQLNonNull(GraphQLInt) },
      jumlah: { type: GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_, args, context) {

      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const res = await axios.post(
        ORDER_SERVICE_URL,
        {
          query: `
            mutation AddItem($order: Int!, $product: Int!, $qty: Int!) {
              addOrderItem(
                id_order: $order
                id_produk: $product
                jumlah: $qty
              ) {
                id_item
                subtotal
              }
            }
          `,
          variables: {
            order: args.id_order,
            product: args.id_produk,
            qty: args.jumlah
          }
        },
        {
          headers: {
            'x-internal-key': 'GATEWAY_SECRET_123'
          }
        }
      );

      return res.data.data.addOrderItem;
    }
  },

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
        ORDER_SERVICE_URL,
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
        ORDER_SERVICE_URL,
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
