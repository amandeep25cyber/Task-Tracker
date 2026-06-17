import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/AsyncHandler.js";

const logoutController = asyncHandler(async (req,res)=>{

    const options = {
            httpOnly:true,
            secure:true
        }

    res
    .clearCookie("token",options)
    .status(200)
    .json(
        new ApiResponse(200,{},"User Logged out")
    )
})

export {
    logoutController,
}