import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { asyncHandler } from "../../utils/AsyncHandler.js";
import { ApiError } from "../../utils/ApiError.js"
import { Organisation } from "../../models/organization.models.js"
import { generateSlug } from "../../utils/generateSlug.js";
import { User } from "../../models/user.models.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { getCookieOptions } from "../../utils/cookieOptions.js";

const registerController = async(req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        if(!req.body){
            throw new ApiError(400,"Invalid All Fields.")
        }

        const {organisationName, name, email, password} = req.body;

        if([organisationName, name, email, password].some(field=> !field || field.trim()==='')){
            throw new ApiError(400,"Invalid fields");
        }

        //Checking if user already exists
        const user = await User.findOne({email})

        if(user){
            throw new ApiError(400,"User Already exists");
        }

        // Creating Admin's Organisation
        const organisation = await Organisation.create([{
            name:organisationName,
            slug:generateSlug(organisationName)
        }],{session});

        if(!organisation[0]){
            throw new ApiError(500,"Organisation creation error");
        }

        // Creating Admin User

        const adminUser = await User.create([{
            organisation:organisation[0],
            name,
            email,
            password,
            role:"admin"
        }],{session})

        if(!adminUser[0]){
            throw new ApiError(500,"Admin creation issue");
        }

        organisation[0].createdBy = adminUser[0]._id;

        await organisation[0].save({session});

        const token = await adminUser[0].generateToken();

        if(!token){
            throw new ApiError(500,"Token Error");
        }

        const createdUser = await User.findById(adminUser[0]._id).session(session);

        await session.commitTransaction();
        await session.endSession();

        const options = getCookieOptions();

        res
        .status(201)
        .cookie("token",token,options)
        .json(
            new ApiResponse(201,{
                user:createdUser,
                organisation:organisation[0]
            },"Organisation setup successfull")
        )

        
    } catch (error) {
        
        await session.abortTransaction();

        await session.endSession();

        throw new ApiError(500,error.message)
    }
}

export {
    registerController,
}