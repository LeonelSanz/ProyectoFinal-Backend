import { Router } from "express";
import productsController from "../controllers/products.controller.js";
import uploader from '../services/upload.js';

const router = Router();

router.get('/', productsController.getProducts);
router.post('/', uploader.single('image'), productsController.createProduct);

export default router;