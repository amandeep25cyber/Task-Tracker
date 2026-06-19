import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { Organisation } from "../../models/organization.models.js"

const loginUser = asyncHandler(async(req,res)=>{

    const {email,password,role} = req.body;

    if([email,password,role].some(field=> !field || field.trim()==='')){
        throw new ApiError(400,"Invalid fields");
    }

    const user = await User.findOne({
        email,
        role
    }).select("+password")

    if(!user){
        throw new ApiError(400,"User doesn't exist");
    }

    const passwordTrue = await user.isPasswordCorrect(password);

    if(!passwordTrue){
        throw new ApiError(400,"Invalid Credentials");
    }

    const token = await user.generateToken();

    if(!token){
        throw new ApiError(500,"Token generation error")
    }

    const userObj = user.toObject();
    delete userObj.password;

    const organisation = await Organisation.findById(userObj.organisation);

    if(!organisation){
        throw new ApiError(500,"Something went wrong");
    }

    const options = {
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .cookie("token",token,options)
    .json(
        new ApiResponse(200,{user:userObj,organisation},"Logged In Successfully")
    )
})

const getUser = asyncHandler(async(req,res)=>{

    const user = await User.findById(req.user.userId);

    res
    .status(200)
    .json(
        new ApiResponse(200,user,"Authenticated user")
    )
})

export {
    loginUser,
    getUser
}