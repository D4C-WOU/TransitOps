import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/role.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./drivers.controller";
import { createDriverValidation, driverIdValidation, listDriversValidation, updateDriverValidation } from "./drivers.validation";

const router = Router();
router.use(authenticate);
router.get("/", listDriversValidation, validate, controller.list);
router.get("/:id", driverIdValidation, validate, controller.getById);
router.post("/", authorize("fleet_manager", "admin", "safety_officer"), createDriverValidation, validate, controller.create);
router.put("/:id", authorize("fleet_manager", "admin", "safety_officer"), updateDriverValidation, validate, controller.update);
router.delete("/:id", authorize("fleet_manager", "admin"), driverIdValidation, validate, controller.remove);
export default router;