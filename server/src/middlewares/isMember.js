import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const isMember = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user?.userId);

    if (!user) {
        throw new ApiError(403, "Access Denied! User not found.");
    }

    if (user.role !== "member") {
        throw new ApiError(403, "Access Denied! Member access required.");
    }

    req.user = user;
    next();
});

export { isMember };
