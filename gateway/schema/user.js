const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull
} = require('graphql');

/* ======================
   USER TYPE (PINDAHKAN KE SINI)
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
   MUTATIONS
====================== */
const register = {
  type: UserType,
  args: {
    nama: { type: GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
async resolve(_, args) {
    const res = await axios.post(
      'http://localhost:3003/graphql',
      {
        query: `
          mutation($nama: String!, $email: String!, $password: String!) {
            register(nama: $nama, email: $email, password: $password) {
              id
              nama
              email
              role
            }
          }
        `,
        variables: {
          nama: args.nama,
          email: args.email,
          password: args.password
        }
      }
    );
    if (res.data.errors) {
      const msg =
        res.data.errors[0].message ||
        'Register gagal (kemungkinan email sudah terdaftar)';
      throw new Error(msg);
    }

    return res.data.data.register;
  }
};

const login = {
  type: GraphQLString,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) }
  },
  async resolve(_, args) {
    try {
      const res = await axios.post(
        'http://localhost:3003/graphql',
        {
          query: `
            mutation($email: String!, $password: String!) {
              login(email: $email, password: $password)
            }
          `,
          variables: {
            email: args.email,
            password: args.password
          }
        }
      );

      // Cek apakah ada error dari User-Service
      if (res.data.errors) {
        throw new Error(res.data.errors[0].message);
      }

      return res.data.data.login;
    } catch (error) {
      console.error("Gateway Login Error:", error.message);
      throw new Error(error.message);
    }
  }
};

module.exports = {
  register,
  login
};
