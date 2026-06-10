import { Router } from "express";
import { registerController } from "../controllers/auth/register.auth.js";
import { loginUser } from "../controllers/auth/login.auth.js";

const router = Router();

router.route('/register').post(registerController);
router.route('/login').post(loginUser)

export default router;