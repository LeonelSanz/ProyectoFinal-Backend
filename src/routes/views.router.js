import { Router } from "express";
import { executePolicies } from "../middlewares/auth.js";
import viewsController from "../controllers/views.controller.js";

const router = Router();

router.get('/', executePolicies(["USER"]), viewsController.home);
router.get('/login', viewsController.login);
router.get('/register', viewsController.register);
router.get('/profile', executePolicies(["AUTHENTICATED"]), viewsController.profile)
router.get('/create', viewsController.create);
router.get('/cart', executePolicies(["USER"]), viewsController.cart);
router.get('/buy', executePolicies(["USER"]), viewsController.buyPage);
router.get('/logout', executePolicies(["USER"]), viewsController.logout);

export default router;