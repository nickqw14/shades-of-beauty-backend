const { ApolloServer, gql } = require("apollo-server");

const typeDefs = gql`
	type Customer {
		name: String!
		email: String!
		id: ID!
		appointment: Appointment
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
		getCustomerByEmail(email: String!): CustomerResponse!
		getAllProducts: [Product]
		getProductByID(id: ID!): ProductResponse!
	}
	type Mutation {
		createInvoiceItem(
			customerID: ID!
			amount: Int!
			description: String!
		): InvoiceItem!
		createInvoice(customerID: ID!): InvoiceResponse!
		updateCustomerBalance(id: ID!, balance: Float!): Customer
		createCustomer(
			name: String!
			email: String!
			date: String
			time: String
			productID: ID
			productDescription: String
		): CustomerResponse!
	}
	# Maybe refactor the product ID/Description to hold a product object
	type Appointment {
		date: String!
		time: String!
		productID: ID!
		productDescription: String! ## Figure this out product ID/Description need to be linked with appointment s
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
	type InvoiceItem {
		id: ID!
	}
	type Invoice {
		id: ID!
	}
	type InvoiceResponse {
		message: String!
		success: Boolean!
		invoice: Invoice
	}
`;

module.exports = typeDefs;
