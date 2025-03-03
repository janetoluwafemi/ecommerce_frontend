import CartService from "../services/cart-service.js"
import express from 'express';
const router = express.Router();

router.post('/addProduct/:userId/:productId', async (req, res) => {    try {
    const { userId, productId } = req.params;
    const { name } = req.body;

    if (!userId || !productId || !name) {
        return res.status(400).json({ message: "Missing required fields: userId, productId, name" });
    }
    const cartService = new CartService();
    const cart = await cartService.addToCart(productId, userId, name);

    res.status(201).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product", error });
    }
});

router.delete('/deleteProduct/:userId/:productId', async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { name } = req.body;
        if (!productId || !userId || !name) {
            return res.status(400).json({ message: "Missing required fields: userId, productId, name" });
        }
        const cartService = new CartService();
        const result  = await cartService.deleteProductFromCart(productId, userId, name);
        res.status(201).json({ message: "Product deleted from cart", data: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product", error });
    }
});

export default router;