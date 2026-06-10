import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes.js"

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Hii");
})

app.use('/api/v2/auth',authRouter)

export { app };