import express from "express";
import { connectDB } from "./connection/connectDB.js";
import cookieParser from "cookie-parser";
import authRoute from "./router/auth.route.js";
import messageRoutes from "./router/message.route.js";
import userRoutes from "./router/user.route.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/v1/auth", authRoute);
app.use("/v1/messages", messageRoutes);
app.use("/v1/users", userRoutes);

connectDB(app);
