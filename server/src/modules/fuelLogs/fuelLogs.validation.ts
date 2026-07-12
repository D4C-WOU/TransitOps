import { body, param, query } from "express-validator";

export const listFuelLogsValidation = [query("vehicleId").optional().isInt({ min: 1 }).withMessage("Vehicle id is invalid")];
export const fuelLogIdValidation = [param("id").isInt({ min: 1 }).withMessage("Fuel log id is invalid")];
export const fuelLogValidation = [
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle is required"),
  body("tripId").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Trip id is invalid"),
  body("liters").isFloat({ gt: 0 }).withMessage("Liters must be greater than 0"),
  body("cost").isFloat({ min: 0 }).withMessage("Cost cannot be negative"),
  body("logDate").isISO8601().withMessage("Log date is invalid"),
];