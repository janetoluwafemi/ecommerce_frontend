import ProductService from "../services/product-service.js"
import express from 'express';
import multer from 'multer'
const router = express.Router();
import Product from "../models/product-model.js";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/createProduct/:userId', upload.single('image'), async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        const {userId} = req.params;
        const image = req.file ? req.file.path : null;

        if (!image) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const product = new Product({
            name,
            category,
            price,
            description,
            image,
            userId: req.params.userId
        });
        const productService = new ProductService();
        const productId = productService.addProduct(userId, req.body);
        // res.json({ productId: savedProduct._id });
        if (productId instanceof Error) {
            return res.status(404).json({ message: productId.message });
        }
        return res.status(200).json({ productId });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Error creating product: ' + error.message });
    }
});

router.put("/updateProduct", async (req, res) => {
    try {
        const productService = new ProductService();
        const newProduct = await productService.updateProduct(req.body);
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({message: "Error updating product", error});
    }
})

router.delete("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        // if (!mongoose.Types.ObjectId.isValid(productId)) {
        //     return res.status(400).json({ message: "Invalid Product ID format" });
        // }

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const productService = new ProductService();
        const deletedProduct = await productService.deleteProduct(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error in delete route:', error);
        return res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

router.get("/product", async (req, res) => {
    try {
        const productService = new ProductService();
        await productService.findProductById(req.params.id);
        res.status(200).json({message: "Product list successfully"});
    }
    catch (error) {
        res.status(500).json({message: "Error deleting product", error});
    }
})

router.get("/product/:userId/:name", async (req, res) => {
    try {
        const { name, userId } = req.params;
        if (!name || !userId) {
            return res.status(400).json({ message: "Name is required." });
        }
        const productService = new ProductService();
        const productId = await productService.findProductByProductName(userId, name);
        if (productId instanceof Error) {
            return res.status(404).json({ message: productId.message });
        }
        return res.status(200).json({ productId });

    } catch (error) {
        console.error('Error in getCardByName route:', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
})

export default router;