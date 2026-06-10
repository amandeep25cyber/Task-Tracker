import { Router } from "express";
import { registerController } from "../controllers/auth/register.auth.js";
import { loginUser } from "../controllers/auth/login.auth.js";
import { logoutController } from "../controllers/auth/logout.auth.js";

const router = Router();

router.route('/register').post(registerController);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutController);

export default router;