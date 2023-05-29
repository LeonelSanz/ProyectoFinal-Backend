import cartsController from "../controllers/carts.controller.js";
import { Router } from 'express';
import { executePolicies } from "../middlewares/auth.js";

const router = Router();

router.get('/product/:pid', executePolicies(["USER"]), cartsController.insertToCart);
router.get('/purchase', executePolicies(['USER']), cartsController.purchase);
router.post('/deleteProduct', cartsController.deleteProductById);
router.post('/deleteAll', cartsController.deleteCart);

export default router;