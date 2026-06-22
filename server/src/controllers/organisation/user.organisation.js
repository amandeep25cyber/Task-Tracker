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
            organization: req.user.organisation
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

export {
    createNewUser,
    getAllUser,
    getDashboardStats,
    getDashboardTeamPerformance,
}