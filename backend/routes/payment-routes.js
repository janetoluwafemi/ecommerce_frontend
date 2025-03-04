import express from 'express';
const router = express.Router();
import PaymentService from "../services/payment-service.js";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    console.log('Received Token:', token);

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided or malformed token' });
    }

    const tokenWithoutBearer = token.split(' ')[1];
    jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

router.post('/payment', verifyToken, async (req, res) => {
    try {
        const paymentRequest = req.body;

        if (!paymentRequest.email || !paymentRequest.amount) {
            return res.status(400).json({ error: 'Email and amount are required.' });
        }

        const paymentService = new PaymentService();
        const paymentResponse = await paymentService.payment(paymentRequest);

        if (paymentResponse.error) {
            return res.status(500).json({ error: paymentResponse.error });
        }

        return res.status(200).json({
            status: paymentResponse.status,
            authorization_url: paymentResponse.authorization_url,
            payment: paymentResponse.payment,
        });
    } catch (error) {
        console.error('Error handling payment request:', error);
        return res.status(500).json({ error: 'An error occurred while processing the payment.' });
    }
});

export default router;
