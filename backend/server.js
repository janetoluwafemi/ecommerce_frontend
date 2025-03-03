import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user-routes.js';
import productRoutes from './routes/product-routes.js';
import cardRoutes from './routes/cart-routes.js';
import paymentRoutes from './routes/payment-routes.js';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', cardRoutes);
app.use('/api', paymentRoutes);
app.listen(8083, () => {
    console.log('Server is running on http://localhost:8083');
});
