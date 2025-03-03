import mongoose, {Schema} from 'mongoose';

const CartItemSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
});

const CartSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [CartItemSchema],
    totalPrice: { type: Number, default: 0 },
});

const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
