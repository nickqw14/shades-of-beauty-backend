const { RESTDataSource } = require("apollo-datasource-rest");
const stripe = require("stripe")(process.env.API_SECRET);

class CustomerAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = process.env.API_URL;
	}
	willSendRequest(request) {
		request.headers.set("Authorization", `Bearer ${process.env.API_SECRET}`);
	}
	async createCustomer({
		name,
		email,
		date,
		time,
		productID,
		productDescription
	}) {
		const customer = await stripe.customers.create({
			name,
			email,
			metadata: {
				date,
				time,
				productID,
				productDescription
			}
		});
		return this.customerReducer(customer);
	}
	customerReducer(customer) {
		return {
			name: customer.name,
			email: customer.email,
			id: customer.id,
			appointment: {
				date: customer.metadata.date,
				time: customer.metadata.time,
				productID: customer.metadata.productID,
				productDescription: customer.metadata.productDescription
			}
		};
	}
	async getAllCustomers() {
		const response = await this.get("customers");
		return response.data.map(customer => this.customerReducer(customer));
	}
	async getCustomerByID(id) {
		const response = await this.get("customers");
		const filteredCustomer = response.data.filter(customer =>
			customer.id === id ? true : false
		);
		const [customer] = filteredCustomer;

		return customer ? this.customerReducer(customer) : false;
	}
	// This method will live on the front end
	async createCreditCardToken(number, exp_month, exp_year, cvc) {
		const token = await stripe.tokens.create({
			card: {
				number,
				exp_month,
				exp_year,
				cvc
			}
		});
		return token;
	}
	async addCustomerCard(id, token) {
		// This method will only take the token and create a source with it on the backend.
		const source = await stripe.customers.createSource(id, {
			source: token.id
		});
		return source.last4;
	}
	// Creates a single invoice item and ques it up in pending invoices on stripe dashboard.
	async createInvoiceItem(customerID, amount, description) {
		const invoiceItem = await stripe.invoiceItems.create({
			customer: customerID,
			amount,
			currency: "usd",
			description
		});
		return invoiceItem;
	}
	// Takes all pending invoices and adds them together on one invoice which can then be paid.
	async createInvoice(customerID) {
		const invoice = await stripe.invoices.create({
			customer: customerID
		});
		return invoice;
	}
}

module.exports = CustomerAPI;
