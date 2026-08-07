import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/AsyncHandler.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { Project } from "../../models/project.models.js";
import { Task } from "../../models/task.models.js";

const createNewUser = asyncHandler(async(req,res)=>{

    const {name,email,role} = req.body;

    if([name, email, role].some(field=> !field || field.trim()==="")){
        throw new ApiError(400,"Invalid fields")
    }

    const user = await User.findOne({email})

    if(user){
        throw new ApiError(403,"User already exist")
    }

    const createdUser = await User.create({
        organisation:req.user?.organisation,
        name,
        email,
        password:email,
        role
    })

    if(!createdUser){
        throw new ApiError(500,"Something went wrong")
    }

    res
    .status(201)
    .json(
        new ApiResponse(201,createdUser,"User Created!")
    )
})

const getAllUser = asyncHandler(async(req,res)=>{
    const adminId = req.user._id;
    const orgId = req.user.organisation;

    const users = await User.find({
        organisation:orgId,
        _id: { $ne: adminId }
    })

    if(!users){
        throw new ApiError(500,"Something went wrong");
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,users,"All Users")
    )
})

const getDashboardStats = asyncHandler(async(req,res)=>{
    //total users
    //Active projects
    //completed tasks
    //pending tasks

    const totalUsers = await User.countDocuments({
        organisation:req.user?.organisation,
        role:{ $ne:"admin"}
    })

    const activeProjects = await Project.countDocuments({
        organisation:req.user?.organisation,
        status:"active"
    })

    const completedTasks = await Task.countDocuments({
        organisation:req.user?.organisation,
        status:"done"
    })

    const pendingTasks = await Task.countDocuments({
        organisation:req.user?.organisation,
        status:{$in :["todo","in-progress"]}
    })



    res.status(200)
    .json(
        new ApiResponse(200,{
            totalUsers,
            activeProjects,
            completedTasks,
            pendingTasks
        },"Fetched")
    )
})

const getDashboardTeamPerformance = asyncHandler(async(req,res)=>{
    const userStats = await User.aggregate([
    {
        $match: {
            organisation: req.user.organisation,
            role: { $ne: "admin" }
        }
    },
    {
        $group: {
            _id: { $month: "$createdAt" },
            users: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id": 1
        }
    }
    ]);

    const taskStats = await Task.aggregate([
    {
        $match: {
            organisation: req.user.organisation
        }
    },
    {
        $group: {
            _id: { $month: "$createdAt" },
            tasks: { $sum: 1 }
        }
    },
    {
        $sort: {
            "_id": 1
        }
    }
    ]);

    const months = [
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
    ];

    const chartData = months.map((month, index) => {
        const task = taskStats.find(
            item => item._id === index + 1
        );

        const user = userStats.find(
            item => item._id === index + 1
        );

        return {
            month,
            tasks: task?.tasks || 0,
            users: user?.users || 0
        };
    });


    res
    .status(200)
    .json(
        new ApiResponse(200,chartData,"Fetched")
    )
})

const getProjectsStat = asyncHandler(async(req,res)=>{
    //fetch all projects
    //fetch new projects this month
    //fetch in-progress projects
    //fetch completed projects
    //fetch this week completed projects
    //fetch at risk projects

    const allProjects = await Project.countDocuments({
        organisation:req?.user?.organisation
    })
    
    //project created this month
    const now = new Date();
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const projectsCreatedThisMonth = await Project.countDocuments({
        organisation:req?.user?.organisation,
        createdAt: {
            $gte: startOfMonth,
            $lt: startOfNextMonth
        }
    });

    //fetch in progress projects count
    const inProgressProjects = await Project.countDocuments({
        organisation:req?.user?.organisation,
        status:"active"
    })

    //Count completed Projects
    const completedProjects = await Project.countDocuments({
        organisation:req?.user?.organisation,
        status:"completed"
    })

    //This week completed projects

    const day = now.getDay(); // Sunday = 0

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const completedThisWeek = await Project.countDocuments({
        organisation:req?.user?.organisation,
        status: "completed",
        updatedAt: {
            $gte: startOfWeek,
            $lt: endOfWeek
        }
    });

    //fetch the number of projects which is at risk and are going to meet it's deadline
    const today = new Date();

    const tomorrowStart = new Date(today);
    tomorrowStart.setDate(today.getDate() + 1);
    tomorrowStart.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowStart.getDate() + 1);

    const projects = await Project.find({
        organisation:req?.user?.organisation,
        status: "active",
        deadline: {
            $gte: tomorrowStart,
            $lt: tomorrowEnd
        }
    });

    let atRiskProjects = 0;

    for (const project of projects) {

        const totalTasks = await Task.countDocuments({
            project: project._id
        });

        const completedTasks = await Task.countDocuments({
            project: project._id,
            status: "done"
        });

        if (totalTasks === 0) continue;

        const remainingPercentage =
            ((totalTasks - completedTasks) / totalTasks) * 100;

        if (remainingPercentage > 50) {
            atRiskProjects++;
        }
    }

    res
    .status(200)
    .json(
        new ApiResponse(200,{
            allProjects,
            projectsCreatedThisMonth,
            inProgressProjects,
            completedProjects,
            atRiskProjects,
            completedThisWeek
        })
    )
})

const getProjects = asyncHandler(async(req,res)=>{

    const projects = await Project.find({ 
        organisation: req?.user?.organisation
    }).populate("members", "name avatar"); 

    const projectData = [];

    for (const project of projects) {

        const totalTasks = await Task.countDocuments({
            project: project._id
        });

        const completedTasks = await Task.countDocuments({
            project: project._id,
            status: "done"
        });
        const progress = totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        projectData.push({
            id: project._id,
            name: project.title,
            status: project.status,
            progress,
            team: project.members,
            deadline: project.deadline,
            tasks: {
                total: totalTasks,
                completed: completedTasks
            }
        });
    }

    return res.status(200).json(
        new ApiResponse(200, projectData, "Projects details fetched successfully")
    );
})

const createProject = asyncHandler(async(req,res)=>{

    const { title, description, status, health, deadline, members } = req.body;
    
    if (!title) {
        throw new ApiError(400, "Project title is required");
    }

    // 2. Organization cross-check (Optional but highly recommended)
    // Agar frontend ne members bheje hain, toh ensure karo sab same org ke hain
    if (members && members.length > 0) {
        const validMembers = await User.countDocuments({
            _id: { $in: members },
            organisation: req.user.organisation // Token se aayi Org ID
        });
        
        if (validMembers !== members.length) {
            throw new ApiError(403, "Some members do not belong to your organisation");
        }
    }

    const newProject = await Project.create({
        organisation: req.user.organisation, 
        createdBy: req.user._id,          
        title,
        description,
        status: status || "Planning",
        health: health || "Good",
        deadline,
        members: members || []
    });

    return res.status(201).json(
        new ApiResponse(201,newProject,"Project created Successfully")
    );
})


//for dropdown selecting members in project creation
const getOrgUsers = asyncHandler(async (req, res) => {
    
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

const getSingleProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const orgId = req.user.organisation;

    const project = await Project.findOne({ 
        _id: projectId, 
        organisation: orgId 
    }).populate("members", "name email avatar")
      .populate("createdBy", "name avatar");

    if (!project) {
        throw new ApiError(404, "Project not found or you don't have access");
    }

    const tasks = await Task.find({ project: projectId })
        .populate("assignedTo", "name avatar") 
        .sort({ createdAt: -1 });

    // Kanban Board ke liye Tasks ko format karna
    const formattedTasks = {
        todo: tasks.filter(task => task.status === "todo"),
        inProgress: tasks.filter(task => task.status === "in-progress"),
        done: tasks.filter(task => task.status === "done")
    };

    return res.status(200).json(
        new ApiResponse(200, { 
            project, 
            tasks: formattedTasks
        }, "Project details and tasks fetched successfully")
    );
});

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { title, description, status, health, deadline, members } = req.body;
    const orgId = req.user.organisation;

    if (members && members.length > 0) {
        const validMembers = await User.countDocuments({
            _id: { $in: members },
            organisation: orgId
        });
        
        if (validMembers !== members.length) {
            throw new ApiError(403, "Some members do not belong to your organisation");
        }
    }

    const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, organisation: orgId },
        { 
            $set: { title, description, status, health, deadline, members } 
        }, 
        { new: true, runValidators: true }
    );

    if (!updatedProject) {
        throw new ApiError(404, "Project not found or access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedProject, "Project updated successfully")
    );
});

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const orgId = req.user.organisation;

    const deletedProject = await Project.findOneAndDelete({ 
        _id: projectId, 
        organisation: orgId 
    });

    if (!deletedProject) {
        throw new ApiError(404, "Project not found or access denied");
    }

    // Database Cleanup: Is project ke saare tasks bhi delete kar do
    await Task.deleteMany({ project: projectId });

    return res.status(200).json(
        new ApiResponse(200, {}, "Project and its associated tasks deleted successfully")
    );
});

export {
    createNewUser,
    getAllUser,
    getDashboardStats,
    getDashboardTeamPerformance,
    getProjectsStat,
    getProjects,
    createProject,
    getOrgUsers,
    getSingleProject,
    updateProject,
    deleteProject,
}