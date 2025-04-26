import { sendMessage } from "../controllers/message.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import express from "express";
const router = express.Router();

router.post("/send/:id", isAuthenticated, sendMessage);
export default router;
