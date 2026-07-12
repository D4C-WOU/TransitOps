import { body, param, query } from "express-validator";

const statuses = ["draft", "dispatched", "completed", "cancelled"];

export const listTripsValidation = [
  query("status").optional().isIn(statuses).withMessage("Trip status is invalid"),
  query("vehicleId").optional().isInt({ min: 1 }).withMessage("Vehicle id is invalid"),
  query("driverId").optional().isInt({ min: 1 }).withMessage("Driver id is invalid"),
];

export const tripIdValidation = [param("id").isInt({ min: 1 }).withMessage("Trip id is invalid")];

export const createTripValidation = [
  body("source").trim().notEmpty().withMessage("Source is required").isLength({ max: 120 }).withMessage("Source is too long"),
  body("destination").trim().notEmpty().withMessage("Destination is required").isLength({ max: 120 }).withMessage("Destination is too long"),
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle is required"),
  body("driverId").isInt({ min: 1 }).withMessage("Driver is required"),
  body("cargoWeight").isFloat({ gt: 0 }).withMessage("Cargo weight must be greater than 0"),
  body("plannedDistance").isFloat({ gt: 0 }).withMessage("Planned distance must be greater than 0"),
];

export const completeTripValidation = [
  ...tripIdValidation,
  body("actualDistance").optional().isFloat({ gt: 0 }).withMessage("Actual distance must be greater than 0"),
];