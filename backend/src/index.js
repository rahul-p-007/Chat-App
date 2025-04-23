import express from "express";
import { connectDB } from "./connection/connectDB.js";

const app = express();

connectDB(app);
