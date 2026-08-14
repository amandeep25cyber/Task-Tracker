import { Task } from "../../models/task.models.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import mongoose from "mongoose";


const getDashboardStats = asyncHandler(async(req,res)=>{

    //active tasks and in progress

    //completed this month and this weak

    //hours logged this month and this week

    //Urgent task(jiska deadline 7 din ke andar hai) and overdue task(jiska deadline paar ho chuka hai);

    const userId = req.user._id;
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const day = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    const nextSevenDays = new Date(now);
    nextSevenDays.setDate(now.getDate() + 7);

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [
        activeTasks,
        inProgressTasks,
        completedThisMonth,
        completedThisWeek,
        overdueTasks,
        urgentTasks,
        hoursThisMonthAgg,
        hoursThisWeekAgg
    ] = await Promise.all([
        
        Task.countDocuments({
            assignedTo: userId,
            status: { $in: ["todo", "in-progress"] }
        }),

        Task.countDocuments({
            assignedTo: userId,
            status: "in-progress"
        }),

        Task.countDocuments({
            assignedTo: userId,
            status: "done",
            updatedAt: { $gte: startOfMonth }
        }),

        Task.countDocuments({
            assignedTo: userId,
            status: "done",
            updatedAt: { $gte: startOfWeek }
        }),

        Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "done" },
            deadline: { $lt: now }
        }),

        Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "done" },
            deadline: { $gte: now, $lte: nextSevenDays }
        }),

        Task.aggregate([
            { $match: { assignedTo: userObjectId } },
            { $unwind: "$worklogs" }, 
            { $match: { "worklogs.loggedOn": { $gte: startOfMonth } } },
            { $group: { _id: null, totalHours: { $sum: "$worklogs.hours" } } } 
        ]),

        Task.aggregate([
            { $match: { assignedTo: userObjectId } },
            { $unwind: "$worklogs" },
            { $match: { "worklogs.loggedOn": { $gte: startOfWeek } } },
            { $group: { _id: null, totalHours: { $sum: "$worklogs.hours" } } } 
        ])
    ]);

    const hoursLoggedThisMonth = hoursThisMonthAgg.length > 0 ? hoursThisMonthAgg[0].totalHours : 0;
    const hoursLoggedThisWeek = hoursThisWeekAgg.length > 0 ? hoursThisWeekAgg[0].totalHours : 0;

    res.status(200).json(
        new ApiResponse(200, {
            activeTasks,
            inProgressTasks,
            completedThisMonth,
            completedThisWeek,
            overdueTasks,
            urgentTasks,
            hoursLoggedThisMonth,
            hoursLoggedThisWeek
        }, "Member dashboard stats fetched successfully")
    );
})

export {
    getDashboardStats,
}