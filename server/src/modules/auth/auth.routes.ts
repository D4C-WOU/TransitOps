import { Router } from "express";
import { login, logout, me, signup } from "./auth.controller";
import { loginValidation, signupValidation } from "./auth.validation";
import authenticate from "../../middlewares/auth.middleware";
import { loginLimiter } from "../../middlewares/rateLimiter";
import validate from "../../middlewares/validate.middleware";

const router = Router();

router.post("/login", loginLimiter, loginValidation, validate, login);
router.post("/signup", loginLimiter, signupValidation, validate, signup);
router.get("/me", authenticate, me);
router.post("/logout", logout);

export default router;
