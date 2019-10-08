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
		appointmentDate,
		appointmentTime,
		appointmentService
	}) {
		const customer = await stripe.customers.create({
			name,
			email,
			metadata: {
				appointmentDate,
				appointmentTime,
				appointmentService
			}
		});
		return this.customerReducer(customer);
	}
	customerReducer(customer) {
		return {
			name: customer.name,
			email: customer.email,
			id: customer.id,
			appointmentDate: customer.metadata.appointmentDate,
			appointmentTime: customer.metadata.appointmentTime,
			appointmentService: customer.metadata.appointmentService,
			balance: customer.balance
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
	async updateCustomerBalance(id, balance) {
		const customer = await stripe.customers.update(id, { balance });
		return customer;
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
	async createInvoiceItem(customer, amount, description) {
		const invoiceItem = await stripe.invoiceItems.create({
			customer,
			amount,
			currency: "usd",
			description
		});
		return invoiceItem;
	}
}

module.exports = CustomerAPI;

// When the order gets setup, update the balance to the service total type. Create an invoice and send same time?
