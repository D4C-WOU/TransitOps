import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/role.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./vehicles.controller";
import { createVehicleValidation, listVehiclesValidation, updateVehicleValidation, vehicleIdValidation } from "./vehicles.validation";

const router = Router();

router.use(authenticate);
router.get("/", listVehiclesValidation, validate, controller.list);
router.get("/:id", vehicleIdValidation, validate, controller.getById);
router.post("/", authorize("fleet_manager", "admin"), createVehicleValidation, validate, controller.create);
router.put("/:id", authorize("fleet_manager", "admin"), updateVehicleValidation, validate, controller.update);
router.delete("/:id", authorize("fleet_manager", "admin"), vehicleIdValidation, validate, controller.remove);

export default router;