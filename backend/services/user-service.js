import User from '../models/user-model.js';
import ProductService from './product-service.js';
import PayStackPaymentService from './payment-service.js';
import mongoose from 'mongoose';
import CartService from './cart-service.js';
const { Error } = mongoose;
class UserService {
    async createUser(userDetails) {
        try {
            const user = new User(userDetails);
            const savedUser = await user.save();
            console.log("New User Created:", user);

            return savedUser._id;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    async checkIfUserAlreadyExist(id){
        try {
            const user = await User.findById(id)
            await user.save();
            return user._id;
        } catch (err) {
            throw new Error(err.message);
        }
    }
    async createProduct(userId, product){
        try {
            const productService = new ProductService();
            return await productService.addProduct(userId, product)
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async deleteProduct(id){
        try {
            const productService = new ProductService();
            return await productService.deleteProduct(id)
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async addProductToCart(productId, userId, name) {
        try {
            const cartService = new CartService();
            return await cartService.addToCart(productId, userId, name);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async deleteProductFromCart(productId, name, userId) {
        try {
            const cartService = new CartService();
            return await cartService.deleteProductFromCart(productId, name, userId);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async findProduct(productId) {
        try {
            const productService = new ProductService();
            return await productService.findProductById(productId);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async findProductByProductName(productName) {
        try {
            const productService = new ProductService();
            return await productService.findProductByProductName(productName);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
    async makePayment(paymentRequest, userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return new Error('User not found');
            }
            await user.save();
            const payStackPaymentService = new PayStackPaymentService();
            return await payStackPaymentService.payment(paymentRequest);
        } catch (err) {
            throw new Error(`Error during payment process: ${err.message}`);
        }
    }
}
export default UserService

