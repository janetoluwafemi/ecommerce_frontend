import Product from "../models/product-model.js";
import {Types} from "mongoose";

class ProductService {
    async addProduct(product) {
        const productInstance = new Product(product);
        const savedProduct = await productInstance.save();
        return savedProduct._id;
    }
    async updateProduct(data) {
        const product = await Product.findById(data._id);
        if (!product) throw new Error('Product not found');
        product.name = data.name;
        return product.save();
    }

    async deleteProduct(id) {
        const deletedProduct = await new Product.findByIdAndDelete(id)
        if (!deletedProduct) throw new Error("Product not found");
    }
    async findProductById(id){
        const product = await Product.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async findProductByProductName(productName){
        const product = await Product.findOne({name: productName});
        if (!product) {
            throw new Error('Product not found');
        }
        return product._id;
    }
}

export default ProductService

