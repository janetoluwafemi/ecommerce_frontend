import ProductService from "../services/product-service.js"
import express from 'express';
import multer from 'multer'
import * as fs from "node:fs";
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/createProduct', upload.single('image'), async (req, res) => {
    try {
        const productDetails = req.body;
        productDetails.image = {
            data: fs.readFileSync(req.file.path),
            contentType: req.file.mimetype,
        };
        const productService = new ProductService();
        const newProduct = await productService.addProduct(productDetails);
        res.status(201).json({ productId: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating product", error });
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
router.delete("/deleteProduct", async (req, res) => {
    try {
        const productService = new ProductService();
        await productService.deleteProduct(req.params.id);
        res.status(200).json({message: "Product deleted successfully"});
    }
    catch (error) {
        res.status(500).json({message: "Error deleting product", error});
    }
})
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

router.get("/product/:name", async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }
        const productService = new ProductService();
        const productId = await productService.findProductByProductName(name);
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