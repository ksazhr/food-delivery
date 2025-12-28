const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const connectOrderDB = require('./db/order.db');

const app = express();

(async () => {
  try {
    await connectOrderDB();
    console.log('🔥 Order DB migration & seed done');
  } catch (err) {
    console.error('❌ Order DB init failed:', err.message);
  }
})();

app.use((req, res, next) => {
  if (req.headers['x-internal-key'] !== 'GATEWAY_SECRET_123') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
});


app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3002, () => {
  console.log('Order service running at http://localhost:3002/graphql');
});
