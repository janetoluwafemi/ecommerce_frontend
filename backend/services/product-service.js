import Product from "../models/product-model.js";
import mongoose, {Types} from "mongoose";
import User from "../models/user-model.js";

class ProductService {
    async addProduct(product, userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return new Error('User not found');
            }
            const productInstance = new Product(product);
            console.log("Saving product with data:", product);
            const savedProduct = await productInstance.save();
            console.log("Product created and saved:", savedProduct);
            await new Promise(resolve => setTimeout(resolve, 500));
            return savedProduct._id;
        } catch (error) {
            console.error("Error creating product:", error);
            throw new Error('Error creating product');
        }
    }


    async updateProduct(data) {
        const product = await Product.findById(data._id);
        if (!product) throw new Error('Product not found');
        product.name = data.name;
        return product.save();
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await Product.findById(productId);
            if (!deletedProduct) {
                return new Error('product not found');
            }
            await Product.findByIdAndDelete(productId);
            return deletedProduct;
        } catch (error) {
            throw new Error(error.message);
        }

        // try {
        //     const deletedProduct = await Product.findByIdAndDelete(productId);
        //     if (!deletedProduct) {
        //         return null;
        //     }
        //     return deletedProduct;
        // } catch (error) {
        //     throw new Error("Error in deleting product");
        // }
    }

    async findProductById(userId, id){
        const product = await Product.findById(userId, id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async findProductByProductName(userId, name) {
        try {
            const product = await Product.findOne({ userId: userId ,name: name });
            if (!product) {
                return new Error('Product not found');
            }
            return product._id;
        } catch (error) {
            console.error('Error finding product:', error);
            throw new Error('Error finding product');
        }
    }
}

export default ProductService

