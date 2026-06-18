import {Router} from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import { createNewUser, getAllUser } from "../controllers/organisation/user.organisation.js";

const router = Router();

router.route('/user').post(verifyUser,isAdmin,createNewUser)
router.route('/users').get(verifyUser,isAdmin,getAllUser)

export default router;