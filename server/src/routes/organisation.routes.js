import {Router} from "express";
import { verifyUser } from "../middlewares/verifyJWT.js"
import { isAdmin } from "../middlewares/isAdmin.js"
import { createNewUser, createProject, getAllUser, getDashboardStats, getDashboardTeamPerformance, getOrgUsers, getProjects, getProjectsStat } from "../controllers/organisation/user.organisation.js";

const router = Router();

router.route('/user').post(verifyUser,isAdmin,createNewUser)
router.route('/users').get(verifyUser,isAdmin,getAllUser)
router.route('/dashboard/stats').get(verifyUser,isAdmin,getDashboardStats)
router.route('/dashboard/team-performance').get(verifyUser,isAdmin,getDashboardTeamPerformance)
router.route('/projects').get(verifyUser,isAdmin,getProjects);
router.route('/projects/stats').get(verifyUser,isAdmin,getProjectsStat);
router.route('/project').post(verifyUser,isAdmin,createProject);
router.route('/org-users').get(verifyUser,isAdmin,getOrgUsers);

export default router;