import { asyncHandler } from "../../utils/AsyncHandler.js";
import { Project } from "../../models/project.models.js"
import { Task } from "../../models/task.models.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const getManagerProjectsAllTasks = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;
    const orgId = req.user?.organisation;

    const allProjects = await Project.find({
        $or: [
            { members: userId },
            { createdBy: userId }
        ],
        organisation: orgId
    }).lean();

    const allProjectsIds = allProjects.map(p=>p._id);

    const allTasks = await Task.find({
        project: { $in: allProjectsIds},
    })
    .populate("project","title")
    .populate("assignedTo","avatar name")
    .select("title description deadline status tags priority")

    const todoTasks = allTasks.filter(t => t.status === "todo");
    const inProgressTasks = allTasks.filter(t => t.status === "in-progress");
    const doneTasks = allTasks.filter(t => t.status === "done");

    res
    .status(200)
    .json(
        new ApiResponse(200,{todoTasks,inProgressTasks,doneTasks},"Task fetched successfully")
    )
})

export {
    getManagerProjectsAllTasks,
}