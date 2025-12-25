const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const connectUserDB = require('./db/user.db');

const app = express();

(async () => {
  try {
    await connectUserDB();
    console.log('🔥 User DB migration & seed done');
  } catch (err) {
    console.error('❌ User DB init failed:', err.message);
  }
})();

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(3003, () => {
  console.log('User service running at http://localhost:3003/graphql');
});
