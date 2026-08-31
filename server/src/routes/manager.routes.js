import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js";
import { isManager } from "../middlewares/isManager.js";
import { dashboardActiveProjects, dashboardStats, dashboardUpcomingDeadlines } from "../controllers/manager/dashboard.manager.js";
import { createNewProject, createNewTask, deleteManagerProject, getAllUsers, getProject, managerProjects, updateExistedProject, updateTaskStatusById } from "../controllers/manager/projects.manager.js";
import { getManagerProjectsAllTasks } from "../controllers/manager/taskBoard.manager.controllers.js";

const router = Router();

router.route('/dashboard-stats').get(verifyUser,isManager,dashboardStats);
router.route('/active-projects').get(verifyUser,isManager,dashboardActiveProjects);
router.route('/upcoming-deadlines').get(verifyUser,isManager,dashboardUpcomingDeadlines);
router.route('/projects').get(verifyUser,isManager,managerProjects);
router.route('/users').get(verifyUser,isManager,getAllUsers);
router.route('/project').post(verifyUser,isManager,createNewProject);
router.route('/project/:projectId').put(verifyUser,isManager,updateExistedProject);
router.route('/project/:projectId').delete(verifyUser,isManager,deleteManagerProject);
router.route('/project/:projectId').get(verifyUser,isManager,getProject);
router.route('/task/:taskId').put(verifyUser,isManager,updateTaskStatusById);
router.route('/task').post(verifyUser,isManager,createNewTask);
router.route('/tasks').get(verifyUser,isManager,getManagerProjectsAllTasks);

export default router;