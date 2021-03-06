const resolvers = {
	Query: {
		getAllCustomers: async (_source, _args, { dataSources }) => {
			return dataSources.customerAPI.getAllCustomers();
		},
		getCustomerByID: async (_, { id }, { dataSources }) => {
			const result = await dataSources.customerAPI.getCustomerByID(id);
			if (!result)
				return {
					success: false,
					message: "Could not find a customer with that ID"
				};
			return {
				success: true,
				message: "Customer retrieved successfully",
				customer: result
			};
		},
		getCustomerByEmail: async (_, { email }, { dataSources }) => {
			const result = await dataSources.customerAPI.getCustomerByEmail(email);
			if (!result)
				return {
					success: false,
					message: "Could not find a customer with that email"
				};
			return {
				success: true,
				message: "Customer retrieved successfully",
				customer: result
			};
		},
		getAllProducts: async (_, __, { dataSources }) => {
			const results = await dataSources.productsAPI.getAllProducts();
			return results.map(res => {
				return res;
			});
		},
		getProductByID: async (_, { id }, { dataSources }) => {
			const result = await dataSources.productsAPI.getProductByID(id);
			if (!result)
				return {
					success: false,
					message: "Could not find a product with that ID"
				};
			return {
				success: true,
				message: "Product retrieved successfully",
				product: result
			};
		},
		addCustomerCard: async (
			_,
			{ id, number, exp_month, exp_year, cvc },
			{ dataSources }
		) => {
			// Eventually this will be removed, only take in the id and token as an argument. Possibly look
			// Into creating a token with the customers ID already established that way only token is needed.
			const token = await dataSources.customerAPI.createCreditCardToken(
				number,
				exp_month,
				exp_year,
				cvc
			);
			const source = await dataSources.customerAPI.addCustomerCard(id, token);
			if (!source)
				return {
					success: false,
					message: "Card number could not be added"
				};
			return {
				success: true,
				message: "Card number added successfully",
				last_four: source
			};
		}
	},
	Mutation: {
		createCustomer: async (
			_,
			{ name, email, date, time, productID, productDescription },
			{ dataSources }
		) => {
			const customer = await dataSources.customerAPI.createCustomer({
				name,
				email,
				date,
				time,
				productID,
				productDescription
			});
			if (!customer)
				return {
					success: false,
					message: "User already registered with that email"
				};
			return {
				success: true,
				message: "Customer created successfully",
				customer: customer
			};
		},
		createInvoiceItem: async (
			_,
			{ customerID, amount, description },
			{ dataSources }
		) => {
			return await dataSources.customerAPI.createInvoiceItem(
				customerID,
				amount,
				description
				// Add metadate to hold product ID /Description ?
			);
		},
		createInvoice: async (_, { customerID }, { dataSources }) => {
			const invoice = await dataSources.customerAPI.createInvoice(customerID);
			if (!invoice)
				return {
					success: false,
					message: "Invoice could not be created"
				};
			return {
				success: true,
				message: "Invoice created successfully",
				invoice
			};
		}
	}
};

module.exports = resolvers;
