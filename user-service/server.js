const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3003, () => {
  console.log('User service running at http://localhost:3003/graphql');
});
