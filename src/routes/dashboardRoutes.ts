import { Router } from "express";
import { auth } from "../middlewares/authMiddleware";
import { getDashboardStats } from "../controllers/dashboardController";

const router = Router();

// All dashboard routes require login
router.get("/stats", auth, getDashboardStats);

export default router;
