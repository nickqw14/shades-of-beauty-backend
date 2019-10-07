const { ApolloServer, gql } = require("apollo-server");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const CustomerAPI = require("./data-sources/customer");
const ProductsAPI = require("./data-sources/products");

const server = new ApolloServer({
	typeDefs,
	resolvers,
	dataSources: () => {
		return {
			customerAPI: new CustomerAPI(),
			productsAPI: new ProductsAPI()
		};
	}
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
