import { asyncHandler } from "../../utils/AsyncHandler.js";
import { Project } from "../../models/project.models.js"
import { Task } from "../../models/task.models.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

const dashboardStats = asyncHandler(async(req,res)=>{
    const userId = req.user._id;
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const myProjects = await Project.find({
        $or: [
            { createdBy: userId },
            { members: userId }
        ]
    });

    const myProjectIds = myProjects.map(p => p._id);

    let activeProjects = 0;
    let projectsThisMonth = 0;
    const uniqueMembers = new Set();

    myProjects.forEach(project => {

        if (project.status !== "Completed") {
            activeProjects++;
        }
        if (project.createdAt >= startOfMonth) {
            projectsThisMonth++;
        }

        uniqueMembers.add(project.createdBy.toString());
        if (project.members && project.members.length > 0) {
            project.members.forEach(memberId => uniqueMembers.add(memberId.toString()));
        }
    });

    const [pendingTasks, completedThisWeek] = await Promise.all([
        
        Task.countDocuments({
            project: { $in: myProjectIds },
            status: { $ne: "done" } 
        }),

        Task.countDocuments({
            project: { $in: myProjectIds },
            status: "done",
            updatedAt: { $gte: startOfWeek } 
        })
    ]);

    res.status(200).json(
        new ApiResponse(200, {
            activeProjects,
            projectsThisMonth,
            pendingTasks,
            completedThisWeek,
            teamMembers:uniqueMembers.size
        }, "Dashboard cards data fetched successfully.")
    );
})

export {
    dashboardStats,
}