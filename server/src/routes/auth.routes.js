import { Router } from "express";
import { registerController } from "../controllers/auth/register.auth.js";

const router = Router();

router.route('/register').post(registerController);

export default router;