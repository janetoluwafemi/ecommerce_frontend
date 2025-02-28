const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = 'mongodb://localhost:27017/e-commerce';
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected successfully');

        require('models/user-model.js');
        require('models/product-model.js');
        require('models/cart-model.js');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
