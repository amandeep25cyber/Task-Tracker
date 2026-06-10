import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt, { decode } from "jsonwebtoken"

const verifyUser = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.token;

    if(!token){
        throw new ApiError(400,"Invalid Token");
    }

    const decodedToken = await jwt.verify(token,process.env.JWT_SECRET);

    if(!decodedToken){
        throw new ApiError(400,"Unauthorized User");
    }

    req.user = decodedToken;

    next();
})

export {
    verifyUser,
}