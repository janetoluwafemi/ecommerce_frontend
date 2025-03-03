import Cart from '../models/cart-model.js';
import Product from '../models/product-model.js';

class CartService {
    async addToCart(productId, userId, name) {
        try {
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                cart = new Cart({ userId, items: [], totalPrice: 0 });
                await cart.save();
            }
            const product = await Product.findById(productId);
            if (!product) {
                return new Error(`Product with id ${productId} not found`);
            }
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (existingItem) {
                existingItem.name += name;
            } else {
                cart.items.push({ productId, name });
            }
            await cart.save();
            return cart;

        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteProductFromCart(userId, productId, name) {
        try {
            let cart = await Cart.findOne({ userId });
            if (!cart) {
                return  new Error("Cart not found for this user.");
            }
            const existingItem = cart.items.find(item => item.productId.toString() === productId);
            if (!existingItem) {
                return  new Error(`Product with id ${productId} is not in the cart.`);
            }
            existingItem.name -= name;
            if (existingItem.name <= 0) {
                cart.items = cart.items.filter(item => item.productId.toString() !== productId);
            }
            return await cart.save();
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

export default CartService