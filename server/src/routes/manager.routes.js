import { Router } from "express";
import { verifyUser } from "../middlewares/verifyJWT.js";
import { isManager } from "../middlewares/isManager.js";
import { dashboardActiveProjects, dashboardStats, dashboardUpcomingDeadlines } from "../controllers/manager/dashboard.manager.js";
import { createNewProject, createNewTask, deleteManagerProject, getAllUsers, getProject, getProjectFilesController, managerProjects, updateExistedProject, updateTaskStatusById, uploadFileController } from "../controllers/manager/projects.manager.js";
import { getManagerProjectsAllTasks } from "../controllers/manager/taskBoard.manager.controllers.js";
import { getUsersData, updateJobRole } from "../controllers/manager/teamMember.manager.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js"

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
router.route('/team-members').get(verifyUser,isManager,getUsersData);
router.route('/team-member/role/:userId').put(verifyUser,isManager,updateJobRole);
router.route("/file").post(verifyUser,isManager,upload.single("file"),uploadFileController);
router.route('/files/:projectId').get(verifyUser,isManager,getProjectFilesController);

export default router;