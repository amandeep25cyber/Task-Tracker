import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.routes.js"
import organisationRoute from "./src/routes/organisation.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.use('/api/v2/auth',authRouter)
app.use('/api/v2/organisation',organisationRoute);

// Error handling code
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.statusCode,
    message: err.message,
  });
});

export { app };