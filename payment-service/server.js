const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const initPaymentDB = require('./db/payment.db');

const app = express();

(async () => {
  try {
    await initPaymentDB();
    console.log('🔥 Payment DB migration & ready');
  } catch (err) {
    console.error('❌ Payment DB init failed:', err.message);
    process.exit(1); 
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

app.listen(3004, () => {
  console.log('Payment service running at http://localhost:3004/graphql');
});
