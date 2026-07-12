import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/role.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./maintenance.controller";
import { closeMaintenanceValidation, createMaintenanceValidation, listMaintenanceValidation } from "./maintenance.validation";

const router = Router();
router.use(authenticate);
router.get("/", listMaintenanceValidation, validate, controller.list);
router.post("/", authorize("fleet_manager", "admin"), createMaintenanceValidation, validate, controller.create);
router.post("/:id/close", authorize("fleet_manager", "admin"), closeMaintenanceValidation, validate, controller.close);
export default router;