import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

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

    const options = {
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .cookie("token",token,options)
    .json(
        new ApiResponse(200,userObj,"Logged In Successfully")
    )
})

export {
    loginUser
}