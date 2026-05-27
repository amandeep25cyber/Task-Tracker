import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async()=>{
    try {
        const URI = process.env.MONGO_URI;
        const response = await mongoose.connect(`${URI}/${DB_NAME}`)
    } catch (error) {
        console.log("DB Connection: "+error);
        process.exit(1);
    }
}

export { connectDB };