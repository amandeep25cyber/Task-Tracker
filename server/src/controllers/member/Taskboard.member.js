import { Task } from "../../models/task.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const getUserTasks = asyncHandler(async(req,res)=>{
    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(403,"User not authorized or missing permissions");
    }

    const tasks = await Task.find({
        assignedTo:userId,
        organisation:req.user?.organisation
    }).select("title description priority tags status").populate("createdBy","name avatar")

    const inProgress = tasks.filter((task)=>task.status==="in-progress");
    const todo = tasks.filter((task)=>task.status==="todo");
    const done = tasks.filter((task)=>task.status==="done");

    return res
    .status(200)
    .json(
        new ApiResponse(200,{todo,inProgress,done},"Formatted tasks Fetched successfully")
    )
})

export {
    getUserTasks,
}