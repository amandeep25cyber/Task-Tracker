import {Router} from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import { createNewUser, getAllUser, getDashboardStats, getDashboardTeamPerformance } from "../controllers/organisation/user.organisation.js";

const router = Router();

router.route('/user').post(verifyUser,isAdmin,createNewUser)
router.route('/users').get(verifyUser,isAdmin,getAllUser)
router.route('/dashboard/stats').get(verifyUser,isAdmin,getDashboardStats)
router.route('/dashboard/team-performance').get(verifyUser,isAdmin,getDashboardTeamPerformance)

export default router;