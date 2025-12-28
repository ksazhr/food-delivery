const graphql = require('graphql');
const axios = require('axios');
const getPaymentDB = require('../db/payment.db');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLEnumType
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    _empty: {
      type: GraphQLString,
      resolve: () => 'OK'
    }
  }
});


/* ========= ENUM ========= */
const PaymentStatusEnum = new GraphQLEnumType({
  name: 'PaymentStatus',
  values: {
    SUCCESS: { value: 'SUCCESS' },
    FAILED: { value: 'FAILED' }
  }
});

/* ========= TYPE ========= */
const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: {
    id_payment: { type: GraphQLInt },
    id_order: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    status: { type: GraphQLString }
  }
});

/* ========= MUTATION ========= */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    payOrder: {
      type: PaymentType,
      args: {
        id_order: { type: GraphQLNonNull(GraphQLInt) },
        amount: { type: GraphQLNonNull(GraphQLInt) }
      },
      async resolve(_, args) {
        try {
          const db = await getPaymentDB(); 
          const status = 'SUCCESS'; 

          // 1️⃣ Simpan payment ke database
          const [result] = await db.query(
            'INSERT INTO payments (id_order, amount, status) VALUES (?, ?, ?)',
            [args.id_order, args.amount, status]
          );

          // 2️⃣ Update order status ke Order Service
          await axios.post(
            process.env.ORDER_SERVICE_URL,
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
              status: 'DIPROSES'
            }
          },
          {
            headers: {
              'x-internal-key': 'GATEWAY_SECRET_123'
            }
          }
        );

          return {
            id_payment: result.insertId,
            id_order: args.id_order,
            amount: args.amount,
            status
          };
        } catch (error) {
          console.error("=== ERROR DI PAYMENT SERVICE ===");
          if (error.response) {
            console.error("Data:", error.response.data);
          } else {
            console.error("Message:", error.message);
          }
          throw new Error("Gagal proses pembayaran: " + (error.message || "Internal Error"));
        }
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
