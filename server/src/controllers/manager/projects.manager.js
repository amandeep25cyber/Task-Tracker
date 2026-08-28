import { asyncHandler } from "../../utils/AsyncHandler.js"
import { Project } from "../../models/project.models.js"
import { Task } from "../../models/task.models.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { User } from "../../models/user.models.js"

const managerProjects = asyncHandler(async(req,res)=>{
    
    const userId = req.user._id;
    const orgId = req.user.organisation;

    const projects = await Project.find({
        organisation: orgId,
        $or:[
            { createdBy: userId },
            { members: userId }
        ]
    })
    .select("title description status deadline members taskCount priority health")
    .populate("members","name avatar")
    .lean();

    if (!projects.length) {
        return res.status(200).json([]);
    }

    const projectIds = projects.map(project => project._id);

    const completedTasksData = await Task.aggregate([
        {
            $match: {
                project: { $in: projectIds },
                organisation: orgId,
                status: "done"
            }
        },
        {
            $group: {
                _id: "$project",
                completedCount: { $sum: 1 }
            }
        }
    ]);

    // Create a dictionary : { "projectId": count }
    const completedTasksMap = completedTasksData.reduce((acc, curr) => {
        acc[curr._id.toString()] = curr.completedCount;
        return acc;
    }, {});

    const updatedProjects = projects.map(project => {
        
        const completedTask = completedTasksMap[project._id.toString()] || 0;
        
        const pendingTask = Math.max(0, project.taskCount - completedTask);
        
        const progress = project.taskCount > 0 
            ? Math.round((completedTask / project.taskCount) * 100) 
            : 0;

        return {
            ...project,
            progress,
            tasks: { 
                total: project.taskCount,
                completed: completedTask, 
                pending: pendingTask 
            }
        };
    });

    res
    .status(200)
    .json(
        new ApiResponse( 200, updatedProjects, "fetched successfully")
    )
});

const getAllUsers = asyncHandler(async (req, res) => {
    
    const orgId = req.user.organisation;
    
    // Agar frontend ne koi specific role manga hai (like ?role=manager)
    const { role } = req.query; 

    const query = { organisation: orgId };
    if (role) {
        query.role = role;
    }

    const users = await User.find(query)
        .select("name email role avatar")
        .sort({ createdAt: -1 }); // Naye users upar dikhein

    return res.status(200).json(
        new ApiResponse(200, users, "Organisation users fetched successfully")
    );
});

export {
    managerProjects,
    getAllUsers,
}

