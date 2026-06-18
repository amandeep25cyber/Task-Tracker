import { User } from "../../models/user.models.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/AsyncHandler.js"
import { ApiResponse } from "../../utils/ApiResponse.js"

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

export {
    createNewUser,
    getAllUser,
}