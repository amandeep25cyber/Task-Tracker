import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyUser = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        throw new ApiError(401, "Invalid or missing token");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new ApiError(401, "Unauthorized or expired token");
    }
})

export {
    verifyUser,
}