const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use((req, res, next) => {
  const internalKey = req.headers['x-internal-key'];

  if (internalKey !== 'GATEWAY_SECRET_123') {
    return res.status(403).json({
      error: 'Forbidden: internal access only'
    });
  }

  next();
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3001, () => {
  console.log('Menu service running at http://localhost:3001/graphql');
});
