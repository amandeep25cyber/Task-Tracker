import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isMember } from "../middlewares/isMember.js";
import { getDashboardStats, getTodaysTasks, logTaskTime } from "../controllers/member/dashboard.member.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isMember,getDashboardStats);
router.route('/todays-tasks').get(verifyUser,isMember,getTodaysTasks);
router.route('/log-time').put(verifyUser,isMember,logTaskTime);

export default router;