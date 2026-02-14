import { Router } from "express";
import { requireAuth } from "@clerk/express";
import * as productController from "../controllers/productController";

const router = Router();

// GET - /api/products/ - get all products
router.get("/", productController.getAllProducts);

// GET /api/products/mine/- get the current user's products (protected)
router.get("/mine", requireAuth(), productController.getMyProducts);

// GET /api/products/:id - get the single product with the id (public)
router.get("/:id", productController.getProductById);

// POST /api/products/ - create the new product (protected)
router.post("/", requireAuth(), productController.createProduct);

// PUT /api/products/:id/ - update the user's product (protected)
router.put("/:id", requireAuth(), productController.updateProduct);

// DELETE /api/products/:id/ - delete the user's product (protected)
router.delete("/:id", requireAuth(), productController.deleteProduct);

export default router;
