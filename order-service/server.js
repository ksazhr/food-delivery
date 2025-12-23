const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

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
