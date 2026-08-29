import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js";
import { isManager } from "../middlewares/isManager.js";
import { dashboardActiveProjects, dashboardStats, dashboardUpcomingDeadlines } from "../controllers/manager/dashboard.manager.js";
import { createNewProject, deleteManagerProject, getAllUsers, managerProjects, updateExistedProject } from "../controllers/manager/projects.manager.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isManager,dashboardStats);
router.route('/active-projects').get(verifyUser,isManager,dashboardActiveProjects);
router.route('/upcoming-deadlines').get(verifyUser,isManager,dashboardUpcomingDeadlines);
router.route('/projects').get(verifyUser,isManager,managerProjects);
router.route('/users').get(verifyUser,isManager,getAllUsers);
router.route('/project').post(verifyUser,isManager,createNewProject);
router.route('/project/:projectId').put(verifyUser,isManager,updateExistedProject);
router.route('/project/:projectId').delete(verifyUser,isManager,deleteManagerProject)

export default router;