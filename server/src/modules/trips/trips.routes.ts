import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/role.middleware";
import validate from "../../middlewares/validate.middleware";
import * as controller from "./trips.controller";
import { completeTripValidation, createTripValidation, listTripsValidation, tripIdValidation } from "./trips.validation";

const router = Router();
router.use(authenticate);
router.get("/", listTripsValidation, validate, controller.list);
router.post("/", authorize("fleet_manager", "admin"), createTripValidation, validate, controller.create);
router.post("/:id/dispatch", authorize("fleet_manager", "admin"), tripIdValidation, validate, controller.dispatch);
router.post("/:id/complete", authorize("fleet_manager", "admin"), completeTripValidation, validate, controller.complete);
router.post("/:id/cancel", authorize("fleet_manager", "admin"), tripIdValidation, validate, controller.cancel);
export default router;