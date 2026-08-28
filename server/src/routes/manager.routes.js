import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js";
import { isManager } from "../middlewares/isManager.js";
import { dashboardActiveProjects, dashboardStats, dashboardUpcomingDeadlines } from "../controllers/manager/dashboard.manager.js";
import { getAllUsers, managerProjects } from "../controllers/manager/projects.manager.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isManager,dashboardStats);
router.route('/active-projects').get(verifyUser,isManager,dashboardActiveProjects);
router.route('/upcoming-deadlines').get(verifyUser,isManager,dashboardUpcomingDeadlines);
router.route('/projects').get(verifyUser,isManager,managerProjects);
router.route('/users').get(verifyUser,isManager,getAllUsers);

export default router;