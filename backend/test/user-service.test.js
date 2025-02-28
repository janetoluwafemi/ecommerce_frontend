const mongoose = require('mongoose');
const UserService = require('../services/user-service');
const User = require('../models/user-model');
const fs = require('fs');
const {expect} = require("@jest/globals");
const ProductService = require('../services/product-service');
const Product = require("../models/product-model");
const CartService = require('../services/cart-service');
const Cart = require("../models/cart-model");
const axios = require("axios");
const paymentModel = require("../models/payment-model");
const PayStackPaymentService = require('../services/payment-service');

jest.mock('axios');
jest.mock('../models/payment-model');
jest.mock('fs');
describe('UserService - createUser', () => {
    let paystackService;
    jest.mock('../models/payment-model', () => {
        return jest.fn().mockImplementation(() => {
            return { save: jest.fn().mockResolvedValue(true) };
        });
    });
    let userId;
    let productId;
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
        paystackService = new PayStackPaymentService();
    });
    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });
    it('should create a user and return an id', async () => {
        const mockImageBuffer = Buffer.from('mock-image-data');
        fs.readFileSync.mockReturnValue(mockImageBuffer);
        const userDetails = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'securepassword',
            phoneNumber: '123456789',
            accountNumber: '987654321',
            address: 'Some address',
        };
        userId = await UserService.createUser(userDetails);
        const user = await User.findById(userId);
        expect(userId).toBe(userId._id);
        expect(userId).not.toBeNull();
        expect(user).not.toBeNull();
    });
    it('should return the user ID if the user exists', async () => {
        const mockUserId = userId;
        const mockUser = { _id: mockUserId, save: jest.fn() };
        const findByIdMock = jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
        const result = await UserService.checkIfUserAlreadyExist(mockUserId);
        console.log('User ID:', mockUserId);
        expect(result).toBe(mockUserId);
        expect(findByIdMock).toHaveBeenCalledWith(mockUserId);
        expect(mockUser.save).toHaveBeenCalled();
        findByIdMock.mockRestore();
    });
    it('should create a product and return an id', async () => {
        const mockImageBuffer = Buffer.from('mock-image-data');
        fs.readFileSync.mockReturnValue(mockImageBuffer);
        const productDetails = {
            name: 'Sample Product',
            price: 100,
            category: 'Product 1',
            image: { data: mockImageBuffer, contentType: 'image/jpeg' },
            description: 'A sample product description',
        };
        productId = await ProductService.addProduct(productDetails);
        const product = await Product.findById(productId);
        console.log('Product ID:', productId);
        expect(product).not.toBeNull();
        expect(productId).not.toBeNull();
        expect(product.name).toBe('Sample Product');
        expect(product.price).toBe("100");
        expect(product.description).toBe('A sample product description');
        expect(product.image.data.toString('base64')).toEqual(mockImageBuffer.toString('base64'));
    });
    it('should return the product if the product exists by the name', async () => {
        const productName = "Sample Product";
        const mockProduct = { name: productName, save: jest.fn() };
        const findOneMock = jest.spyOn(Product, 'findOne').mockResolvedValue(mockProduct);
        const result = await ProductService.findProductByProductName(productName);
        console.log("Sample Product", result);
        console.log()
        expect(result).toBe(mockProduct);
        expect(findOneMock).toHaveBeenCalledWith({ name: productName });
        expect(mockProduct.save).not.toHaveBeenCalled();
        findOneMock.mockRestore();
    });

    it('should add a new product to the cart when the product exists and cart is empty', async () => {
        const productId = '67b0c623191853ed7f81986e';
        const userId = '67b0c6465addce38d32300ff';
        const quantity = 2;
        Cart.findOne = jest.fn().mockResolvedValue(null);
        Product.findById = jest.fn().mockResolvedValue({ _id: productId, name: 'Product' });
        Cart.prototype.save = jest.fn().mockResolvedValue({
            userId,
            items: [{ productId, quantity }],
            totalPrice: 100,
        });
        const result = await CartService.addToCart(productId, userId, quantity);
        console.log('Product ID inside cart:', result.items[0].productId);
        expect(result.items).toHaveLength(1);
        expect(result).not.toBeNull();
        expect(result.items[0].productId.toString()).toEqual(productId);
        expect(result.items[0].quantity).toBe(quantity);
    });
    it('should delete a product from the cart', async () => {
        const productId = '67b0c623191853ed7f81986e';
        const mockCart = {
            userId,
            items: [{ productId, quantity: 2 }],
            totalPrice: 100,
            save: jest.fn().mockResolvedValue({
                userId,
                items: [],
                totalPrice: 100,
            }),
        };
        Cart.findOne = jest.fn().mockResolvedValue(mockCart);
        const result = await CartService.deleteProductFromCart(productId, 1, userId);
        console.log(result);
        expect(result).not.toBeUndefined();
        expect(result.items).toHaveLength(0);
    });
    it('should initialize payment successfully when Paystack responds with status "true"', async () => {
        const mockUserId = userId;
        const mockUser = { _id: mockUserId, save: jest.fn() };
        const findByIdMock = jest.spyOn(User, 'findById').mockResolvedValue(mockUser);
        const result1 = await UserService.checkIfUserAlreadyExist(mockUserId);
        const mockPaymentRequest = { email: 'john@example.com', amount: 1000 };
        const mockResponse = {
            status: 200,
            data: {
                status: true,
                data: {
                    authorization_url: 'https://paystack.com/authorize',
                },
            },
        };
        axios.post.mockResolvedValue(mockResponse);
        const saveMock = jest.fn().mockResolvedValue(true);
        paymentModel.mockImplementation(() => {
            return { save: saveMock };
        });
        const payStackPaymentService = new PayStackPaymentService();
        const result = await payStackPaymentService.payment(mockPaymentRequest);
        expect(result1).toBe(mockUserId);
        expect(findByIdMock).toHaveBeenCalledWith(mockUserId);
        expect(mockUser.save).toHaveBeenCalled();
        findByIdMock.mockRestore();
        expect(saveMock).toHaveBeenCalled();
        expect(result.status).toBe('Payment initialized successfully.');
        expect(result.authorization_url).toBe('https://paystack.com/authorize');
        expect(saveMock).toHaveBeenCalledTimes(1);
    });
});