const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const connectMenuDB = require('./db/menu.db');

const app = express();

(async () => {
  try {
    await connectMenuDB();
    console.log('🔥 Menu DB migration & seed done');
  } catch (err) {
    console.error('❌ Menu DB init failed:', err.message);
  }
})();

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
