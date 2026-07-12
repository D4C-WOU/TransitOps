import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/role.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./fuelLogs.controller";
import { fuelLogIdValidation, fuelLogValidation, listFuelLogsValidation } from "./fuelLogs.validation";

const router = Router();
router.use(authenticate);
router.get("/", listFuelLogsValidation, validate, controller.list);
router.post("/", authorize("fleet_manager", "admin", "financial_analyst"), fuelLogValidation, validate, controller.create);
router.delete("/:id", authorize("admin", "financial_analyst"), fuelLogIdValidation, validate, controller.remove);
export default router;