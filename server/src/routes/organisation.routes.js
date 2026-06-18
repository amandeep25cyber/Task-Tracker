import {Router} from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import { createNewUser } from "../controllers/organisation/user.organisation.js";

const router = Router();

router.route('/create-user').post(verifyUser,isAdmin,createNewUser)

export default router;