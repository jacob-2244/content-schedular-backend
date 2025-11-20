import { Router } from "express";
import { register, login } from "../controllers/authController";
import { registerValidator, loginValidator } from "../utils/validators";
import { validate } from "../middlewares/validate";
import { authLimiter } from "../middlewares/rateLimit";

const router = Router();


router.post("/login", authLimiter, loginValidator, validate, login);
router.post("/register", authLimiter, registerValidator, validate, register);

export default router;
