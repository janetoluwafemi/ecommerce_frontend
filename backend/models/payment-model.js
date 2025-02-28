import mongoose, {Schema} from 'mongoose';

const paymentSchema = new Schema({
    email: { type: String, required: true },
    amount: { type: Number, required: true },
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;