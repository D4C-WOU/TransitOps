import { body, param, query } from "express-validator";

export const listMaintenanceValidation = [query("vehicleId").optional().isInt({ min: 1 }).withMessage("Vehicle id is invalid")];
export const maintenanceIdValidation = [param("id").isInt({ min: 1 }).withMessage("Maintenance id is invalid")];
export const createMaintenanceValidation = [
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle is required"),
  body("type").trim().notEmpty().withMessage("Maintenance type is required").isLength({ max: 80 }).withMessage("Maintenance type is too long"),
  body("description").optional({ nullable: true }).trim().isLength({ max: 500 }).withMessage("Description is too long"),
  body("cost").optional({ nullable: true }).isFloat({ min: 0 }).withMessage("Cost cannot be negative"),
];
export const closeMaintenanceValidation = [
  ...maintenanceIdValidation,
  body("cost").optional({ nullable: true }).isFloat({ min: 0 }).withMessage("Cost cannot be negative"),
];