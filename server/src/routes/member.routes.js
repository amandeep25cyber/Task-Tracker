import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isMember } from "../middlewares/isMember.js";
import { getDashboardStats } from "../controllers/member/dashboard.member.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isMember,getDashboardStats);

export default router;