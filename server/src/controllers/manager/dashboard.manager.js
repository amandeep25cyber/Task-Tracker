import { asyncHandler } from "../../utils/AsyncHandler.js";

const dashboardStats = asyncHandler(async(req,res)=>{
    res.send("hii! I am in Manager Dashboard");
})

export {
    dashboardStats,
}