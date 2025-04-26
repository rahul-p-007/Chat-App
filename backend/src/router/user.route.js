import express from "express";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";
const router = express.Router();
router.get("/", isAuthenticated, getUsersForSidebar);

export default router;
