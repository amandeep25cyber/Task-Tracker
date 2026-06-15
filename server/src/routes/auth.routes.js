import { Router } from "express";
import { registerController } from "../controllers/auth/register.auth.js";
import { loginUser, getUser } from "../controllers/auth/login.auth.js";
import { logoutController } from "../controllers/auth/logout.auth.js";
import { verifyUser } from "../middlewares/verifyJWT.js"

const router = Router();

router.route('/register').post(registerController);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutController);

//Protected Routes
router.route('/me').get(verifyUser,getUser)

export default router;