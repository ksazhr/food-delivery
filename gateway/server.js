const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const schema = require('./schema');
const cors = require('cors');

const app = express();

app.use(cors());
app.use('/graphql', graphqlHTTP(req => {

  const auth = req.headers.authorization || '';
  let user = null;

  if (auth.startsWith('Bearer ')) {
    try {
      user = jwt.verify(
        auth.replace('Bearer ', ''),
        'SECRET_KEY'
      );
    } catch (e) {
      console.log('Invalid token');
    }
  }

  return {
    schema,
    graphiql: true,
    context: { user }
  };
}));

app.listen(4000, () => {
  console.log('Gateway running at http://localhost:4000/graphql');
});
