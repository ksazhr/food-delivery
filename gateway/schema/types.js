const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLEnumType
} = require('graphql');

const MenuType = new GraphQLObjectType({
  name: 'Menu',
  fields: {
    id_produk: { type: GraphQLInt },
    nama_produk: { type: GraphQLString },
    harga: { type: GraphQLInt },
    kategori: { type: GraphQLString },
    stok: { type: GraphQLInt }
  }
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: {
    id_order: { type: GraphQLInt },
    id_produk: { type: GraphQLInt },
    total_harga: { type: GraphQLInt },
    status: { type: GraphQLString }
  }
});

const OrderStatusEnum = new GraphQLEnumType({
  name: 'OrderStatus',
  values: {
    PENDING: { value: 'PENDING' },
    DIPROSES: { value: 'DIPROSES' },
    DIKIRIM: { value: 'DIKIRIM' },
    SELESAI: { value: 'SELESAI' },
    BATAL: { value: 'BATAL' }
  }
});

const PaymentType = new GraphQLObjectType({
  name: 'Payment',
  fields: {
    id_payment: { type: GraphQLInt },
    id_order: { type: GraphQLInt },
    amount: { type: GraphQLInt },
    status: { type: GraphQLString }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLInt },
    nama: { type: GraphQLString },
    email: { type: GraphQLString },
    role: { type: GraphQLString }
  }
});

module.exports = {
  MenuType,
  OrderType,
  OrderStatusEnum,
  PaymentType,
  UserType
};
