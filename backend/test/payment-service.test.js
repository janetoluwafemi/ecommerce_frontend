const axios = require('axios');
const PayStackPaymentService = require('../services/payment-service');
const paymentModel = require('../models/payment-model');
const fs = require("fs");
const mongoose = require("mongoose");
const Payment = require("../models/payment-model");

jest.mock('axios');
jest.mock('../models/payment-model');
jest.mock('fs');

describe('PayStackPaymentService', () => {
    let paystackService;
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/testdb', {useNewUrlParser: true, useUnifiedTopology: true});
        paystackService = new PayStackPaymentService();
    });

    afterAll(async () => {
        await Payment.deleteMany({});
        await mongoose.connection.close();
    });
    it('should initialize payment successfully when Paystack responds with status "true"', async () => {
        const mockPaymentRequest = { email: 'test@example.com', amount: 1000 };

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
        const result = await paystackService.payment(mockPaymentRequest);
        expect(saveMock).toHaveBeenCalled();
        expect(result.status).toBe('Payment initialized successfully.');
        expect(result.authorization_url).toBe('https://paystack.com/authorize');
        expect(saveMock).toHaveBeenCalledTimes(1);
    });


    it('should return an error when email or amount is missing', async () => {
        const mockPaymentRequest = { email: '', amount: 1000 };
        const result = await paystackService.payment(mockPaymentRequest);
        expect(result.error).toBe('Email and amount are required.');
    });

    it('should return error when Paystack responds with an unexpected status', async () => {
        const mockPaymentRequest = { email: 'test@example.com', amount: 1000 };
        const mockResponse = {
            status: 200,
            data: {
                status: false,
            },
        };
        axios.post.mockResolvedValue(mockResponse);
        const result = await paystackService.payment(mockPaymentRequest);
        expect(result.error).toBe('Unexpected response format from Paystack.');
    });

    it('should handle 401 error from Paystack', async () => {
        const mockPaymentRequest = { email: 'test@example.com', amount: 1000 };
        const mockResponse = {
            status: 401,
            data: {},
        };
        axios.post.mockResolvedValue(mockResponse);
        const result = await paystackService.payment(mockPaymentRequest);
        expect(result.error).toBe('Unauthorized: Invalid API key or credentials.');
    });

    it('should handle network error', async () => {
        const mockPaymentRequest = { email: 'test@example.com', amount: 1000 };
        axios.post.mockRejectedValue(new Error('Network Error'));  // Mock network error
        const result = await paystackService.payment(mockPaymentRequest);
        expect(result.error).toBe('Network error occurred: Network Error');
    });
});
