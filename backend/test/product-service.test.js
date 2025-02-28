const mongoose = require('mongoose');
const ProductService = require('../services/product-service');
const Product = require('../models/product-model');
const fs = require('fs');
const ImageService = require('../services/image-service');

jest.mock('fs');

describe('ProductService - addProduct', () => {
    let productId;
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
    });
    afterAll(async () => {
        await Product.deleteMany({});
        await mongoose.connection.close();
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
        expect(product).not.toBeNull();
        expect(productId).not.toBeNull();
        expect(product.name).toBe('Sample Product');
        expect(product.price).toBe("100");
        expect(product.description).toBe('A sample product description');
        expect(product.image.data.toString('base64')).toEqual(mockImageBuffer.toString('base64'));
    });
    it('should delete a product', async () => {
        const mockImageBuffer = Buffer.from('mock-image-data');
        fs.readFileSync.mockReturnValue(mockImageBuffer);
        const productDetails = {
            name: 'Sample Product',
            price: 100,
            category: 'Product 1',
            image: { data: mockImageBuffer, contentType: 'image/jpeg' },
            description: 'A sample product description',
        };
        const mockProduct = {
            _id: productId,
            name: 'Sample Product',
            price: 100,
            category: 'Product 1',
            image: { data: mockImageBuffer, contentType: 'image/jpeg' },
            description: 'A sample product description',
        };
        Product.findById = jest.fn().mockResolvedValue(mockProduct);
        ProductService.deleteProduct = jest.fn().mockResolvedValue(productId);
        const deletedProductId = await ProductService.deleteProduct(productDetails);
        Product.findById = jest.fn().mockResolvedValue(null);
        const product = await Product.findById(deletedProductId);
        expect(product).toBeNull();
        expect(deletedProductId).toBe(productId);
    });
});
