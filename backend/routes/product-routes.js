import ProductService from "../services/product-service.js"
import express from 'express';
import multer from 'multer'
import * as fs from "node:fs";
import UserService from "../services/user-service.js";
import mongoose, {isValidObjectId} from "mongoose";
const router = express.Router();
const upload = multer({ dest: 'uploads/' });


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
        const productService = new ProductService();
        const newProduct = await productService.addProduct(userId, productDetails);
        res.status(201).json({ productId: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating product", error: error.message });  // Improved error handling
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

// router.delete("/product/:productId", async (req, res) => {
//     try {
//         const { productId } = req.params;
//
//         if (!productId) {
//             return res.status(400).json({ message: "Product not found" });
//         }
//         const productService = new ProductService();
//         const deletedProduct = await productService.deleteProduct(productId);
//         if (!deletedProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }
//         return res.status(200).json({message: "Product deleted successfully"});
//     }
//     catch (error) {
//         return res.status(500).json({message: "Error deleting product", error});
//     }
// })

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