const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLSchema } = require('graphql');
const ProductModel = require('./Models/product');
const OrderModel = require('./Models/order');

const ProductType = new GraphQLObjectType({
  name: 'ProductType',
  description: 'Product',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    price: { type: GraphQLInt }
  })
});

const OrderType = new GraphQLObjectType({
  name: 'OrderType',
  description: 'Order',
  fields: () => ({
    id: { type: GraphQLString },
    totalPrice: { type: GraphQLInt },
    items: { type: new GraphQLList(ProductType) }
  })
});

const rootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'Get All Requests',
  fields: () => ({
    Products: {
      type: new GraphQLList(ProductType),
      description: 'Get All Products',
      resolve: () => {
        return ProductModel.find({});
      }
    },
    Orders: {
      type: new GraphQLList(OrderType),
      description: 'Get All Orders',
      resolve: () => {
        return OrderModel.find({});
      }
    }
  })
});

const mutateQuery = new GraphQLObjectType({
  name: 'MutationQuery',
  description: 'Mutate your DB',
  fields: () => ({
    AddProduct: {
      type: ProductType,
      description: 'Add new product',
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        return ProductModel.create({ name: args.name, price: args.price });
      }
    },
    UpdateProduct: {
      type: ProductType,
      description: 'Update existing product',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLString },
        price: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        const product = await ProductModel.findByIdAndUpdate(args.id, args, { new: true });
        return product;
      }
    },
    DeleteProduct: {
      type: ProductType,
      description: 'Delete a product',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        return ProductModel.findByIdAndDelete(args.id);
      }
    },
    AddOrder: {
      type: OrderType,
      description: 'Add new order',
      args: {
        totalPrice: { type: new GraphQLNonNull(GraphQLInt) },
        items: { type: new GraphQLList(GraphQLString) }
      },
      resolve: (parent, args) => {
        return OrderModel.create({ totalPrice: args.totalPrice, items: args.items });
      }
    },
    UpdateOrder: {
      type: OrderType,
      description: 'Update existing order',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        totalPrice: { type: GraphQLInt },
        items: { type: new GraphQLList(GraphQLString) }
      },
      resolve: async (parent, args) => {
        const order = await OrderModel.findByIdAndUpdate(args.id, args, { new: true });
        return order;
      }
    },
    DeleteOrder: {
      type: OrderType,
      description: 'Delete an order',
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        return OrderModel.findByIdAndDelete(args.id);
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: rootQuery,
  mutation: mutateQuery
});

module.exports = schema;
