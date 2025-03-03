import axios from 'axios'
import Payment from '../models/payment-model.js';

class PayStackPaymentService {
    constructor() {
        this.secretKey = process.env.PAYSTACK_SECRET_KEY;
        this.paystackUrl = 'https://api.paystack.co/transaction/initialize';
    }

    async payment(paymentRequest) {
        try {
            if (!paymentRequest.email || !paymentRequest.amount) {
                return { error: 'Email and amount are required.' };
            }
            const response = await axios.post(this.paystackUrl, {
                email: paymentRequest.email,
                amount: paymentRequest.amount,
            }, {
                headers: {
                    Authorization: `Bearer ${this.secretKey}`,
                },
            });

            if (response.status === 200) {
                const responseBody = response.data;
                if (responseBody.status) {
                    const paymentData = new Payment({
                        email: paymentRequest.email,
                        amount: paymentRequest.amount,
                    });
                    const savedPayment = await paymentData.save();
                    return {
                        status: 'Payment initialized successfully.',
                        authorization_url: responseBody.data.authorization_url,
                        payment: savedPayment,
                    };
                } else {
                    return { error: 'Unexpected response format from Paystack.' };
                }
            } else {
                let errorMessage;
                if (response.status === 401) {
                    errorMessage = 'Unauthorized: Invalid API key or credentials.';
                } else if (response.status === 500) {
                    errorMessage = 'Internal server error occurred.';
                } else if (response.status === 503) {
                    errorMessage = 'Service unavailable.';
                } else {
                    errorMessage = 'Payment initialization failed.';
                }
                return { error: errorMessage };
            }
        } catch (error) {
            console.error('Error initializing payment:', error);
            return { error: `Network error occurred: ${error.message}` };
        }
    }

}

export default PayStackPaymentService

