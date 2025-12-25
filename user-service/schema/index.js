const graphql = require('graphql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectUserDB = require('../db/user.db');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLSchema
} = graphql;

/* ======================
   USER TYPE
====================== */
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    nama: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString }
  }
});

/* ======================
   ROOT QUERY
====================== */
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    users: {
      type: graphql.GraphQLList(UserType),
      async resolve() {
        const userDB = await connectUserDB();
        const [rows] = await userDB.query(
          'SELECT id, nama, email, role FROM users'
        );
        return rows;
      }
    }
  }
});

/* ======================
   MUTATION
====================== */
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {

    // REGISTER
    register: {
      type: UserType,
      args: {
        nama: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const userDB = await connectUserDB(); 
        try {
          const hashed = await bcrypt.hash(args.password, 10);

          const [res] = await userDB.query(
            'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
            [args.nama, args.email, hashed, 'USER']
          );

          return {
            id: res.insertId,
            nama: args.nama,
            email: args.email,
            role: 'USER'
          };

        } catch (err) {
          console.error('REGISTER ERROR:', err);
          
          if (err.code === 'ER_DUP_ENTRY') {
            throw new Error('Email sudah terdaftar');
          }
          throw new Error('Gagal register user');
        }
      }
    },

    // LOGIN
    login: {
      type: GraphQLString,
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      async resolve(_, args) {
        const userDB = await connectUserDB();
        console.log('Login attempt:', args.email);

        const [rows] = await userDB.query(
          'SELECT * FROM users WHERE email = ?',
          [args.email]
        );

        if (rows.length === 0) {
          console.log('User not found');
          throw new Error('User tidak ditemukan');
        }

        const user = rows[0];
        console.log('User found:', user.email);
        const valid = await bcrypt.compare(args.password, user.password);
        console.log('Password valid:', valid);

        if (!valid) {
          console.log('Password invalid');
          throw new Error('Password salah');
        }

        const token = jwt.sign(
          {
            id: user.id,
            role: user.role
          },
          'SECRET_KEY',
          { expiresIn: '1d' }
        );
        console.log('Token generated');
        return token;
      }
    }

  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
