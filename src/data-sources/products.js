const { RESTDataSource } = require("apollo-datasource-rest");
require("dotenv").config();

class ProductsAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = process.env.API_URL;
	}
	willSendRequest(request) {
		request.headers.set("Authorization", `Bearer ${process.env.API_SECRET}`);
	}
	async getAllProducts() {
		const response = await this.get("products");

		return response.data.map(product => this.productReducer(product));
	}
	async getProductByID(id) {
		const response = await this.get("products");
		const filteredProducts = response.data.filter(product =>
			product.id === id ? true : false
		);
		const [product] = filteredProducts;
		return product ? this.productReducer(product) : false;
	}
	productReducer(product) {
		return {
			id: product.id,
			allotedTime: product.metadata.allotedTime,
			price: product.metadata.price,
			description: product.description,
			images: product.images
		};
	}
}

module.exports = ProductsAPI;
