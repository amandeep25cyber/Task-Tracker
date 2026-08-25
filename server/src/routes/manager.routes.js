import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js";
import { isManager } from "../middlewares/isManager.js";
import { dashboardStats } from "../controllers/manager/dashboard.manager.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isManager,dashboardStats);

export default router;