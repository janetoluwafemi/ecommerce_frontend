import express from 'express';
const router = express.Router();
import UserService from '../services/user-service.js'
import fs from "node:fs";
import multer from "multer";
import CartService from "../services/cart-service.js";
import ProductService from "../services/product-service.js";
import mongoose, {isValidObjectId} from "mongoose";
const upload = multer({ dest: 'uploads/' });

async function checkUserExists(req, res, next) {
    try {
        const userId = req.body.userId || req.params.userId;
        const userService = new UserService();
        await userService.checkIfUserAlreadyExist(userId);
        next();
    } catch (error) {
        console.error("User not found:", error);
        return res.status(404).json({ message: 'User not found', error: error.message });
    }
}

router.post('/users', async (req, res) => {
    try {
        const { firstName, lastName, phoneNumber, email, password, accountNumber, address} = req.body;

        if (!firstName || !lastName || !phoneNumber || !email || !password || !accountNumber || !address) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const userService = new UserService();
        const userId = await userService.createUser(req.body);
        console.log("Returned User ID (String):", userId);

        return res.status(201).json({ message: "User created successfully", userId: userId });
    } catch (error) {
        if (error.message === 'Email or Phone Number already in use.') {
            return res.status(400).json({ message: 'Email or Phone Number already in use.' });
        }
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

router.post('/createProduct/:userId', upload.single('image'), async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const productDetails = req.body;
        productDetails.image = {
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype,
        };

        const userService = new UserService();
        const newProduct = await userService.createProduct(userId, productDetails);
        res.status(201).json({ productId: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating product", error: error.message });  // Improved error handling
    }
});
router.delete("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        // if (!mongoose.Types.ObjectId.isValid(productId)) {
        //     return res.status(400).json({ message: "Invalid Product ID format" });
        // }
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const userService = new UserService();
        const deletedProduct = await userService.deleteProduct(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error in delete route:', error);
        return res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

router.get("/product/:name", async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }
        const userService = new UserService();
        const productId = await userService.findProductByProductName(name);
        if (productId instanceof Error) {
            return res.status(404).json({ message: productId.message });
        }
        return res.status(200).json({ productId });

    } catch (error) {
        console.error('Error in getCardByName route:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

router.post('/addProduct/:userId/:productId', async (req, res) => {    try {
    const { userId, productId } = req.params;
    const { name } = req.body;

    if (!userId || !productId || !name) {
        return res.status(400).json({ message: "Missing required fields: userId, productId, name" });
    }
    const userService = new UserService();
    const cart = await userService.addProductToCart(productId, userId, name);

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
        const userService = new UserService();
        const result = await userService.deleteProductFromCart(productId, userId, name);
        res.status(201).json({ message: "Product deleted from cart", data: result});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product", error });
    }
});



export default router