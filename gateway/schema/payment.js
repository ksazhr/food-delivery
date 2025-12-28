const axios = require('axios');
const { GraphQLInt, GraphQLNonNull } = require('graphql');
const { PaymentType } = require('./types');

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || 'http://localhost:3004/graphql';

module.exports = {
  payOrder: {
    type: PaymentType,
    args: {
      id_order: { type: GraphQLNonNull(GraphQLInt) },
      amount: { type: GraphQLNonNull(GraphQLInt) }
    },
    async resolve(_, args, context) {

      if (!context.user) {
        throw new Error('Unauthorized');
      }

      const res = await axios.post(
        PAYMENT_SERVICE_URL,
        {
          query: `
            mutation PayOrder($id: Int!, $amount: Int!) {
              payOrder(
                id_order: $id
                amount: $amount
              ) {
                id_payment
                status
              }
            }
          `,
          variables: {
            id: args.id_order,
            amount: args.amount
          }
        },
        {
          headers: {
            'x-internal-key': 'GATEWAY_SECRET_123'
          }
        }
      );

      return res.data.data.payOrder;
    }
  }
};
