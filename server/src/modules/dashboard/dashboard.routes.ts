import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import { kpis } from "./dashboard.controller";
import { dashboardValidation } from "./dashboard.validation";

const router = Router();
router.use(authenticate);
router.get("/kpis", dashboardValidation, validate, kpis);
export default router;