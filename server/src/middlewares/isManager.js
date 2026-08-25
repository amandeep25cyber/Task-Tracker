import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const isManager = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user?.userId);

    if (!user) {
        throw new ApiError(403, "Access Denied! User not found.");
    }

    if (user.role !== "manager") {
        throw new ApiError(403, "Access Denied! Manager access required.");
    }

    req.user = user;
    next();
});

export { isManager };