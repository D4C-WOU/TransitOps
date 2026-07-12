import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./reports.controller";
import { reportValidation } from "./reports.validation";

const router = Router();
router.use(authenticate);
router.get("/fuel-efficiency", reportValidation, validate, controller.fuelEfficiency);
router.get("/utilization", reportValidation, validate, controller.utilization);
router.get("/operational-cost", reportValidation, validate, controller.operationalCost);
export default router;