import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const isAdmin = asyncHandler(async(req,res,next)=>{

    const user = await User.findById(req.user.userId);

    if(!user){
        throw new ApiError(403,"Access Denied!")
    }

    if(user.role !== "admin"){
        throw new ApiError(403,"Access Denied!")
    }

    req.user = user;
    
    next();
    
})

export { isAdmin }