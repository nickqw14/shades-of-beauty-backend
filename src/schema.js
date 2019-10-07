const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
	type Customer {
		name: String!
		email: String!
		id: ID!
		appointmentDate: String
		appointmentTime: String
		appointmentService: String
		balance: Int!
	}
	type Query {
		addCustomerCard(
			id: ID!
			number: String!
			exp_month: Int!
			exp_year: Int!
			cvc: Int!
		): SourceResponse!
		getAllCustomers: [Customer]
		getCustomerByID(id: ID!): CustomerResponse!
		getAllProducts: [Product]
		getProductByID(id: ID!): ProductResponse
	}
	type Mutation {
		createInvoice(id: ID!): Invoice
		updateCustomerBalance(id: ID!, balance: Float!): Customer
		createCustomer(
			name: String!
			email: String!
			appointmentDate: String
			appointmentTime: String
			appointmentService: String
		): Customer
	}
	type Product {
		id: String!
		allotedTime: String!
		price: String!
		description: String!
		images: [String]
	}
	type CustomerResponse {
		message: String!
		success: Boolean!
		customer: Customer
	}
	type ProductResponse {
		message: String!
		success: Boolean!
		product: Product
	}
	type SourceResponse {
		message: String!
		success: Boolean!
		last_four: String
	}
	type Invoice {
		message: String!
	}
`;

module.exports = typeDefs;
