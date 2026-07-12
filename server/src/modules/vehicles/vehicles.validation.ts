import { body, param, query } from "express-validator";

const statuses = ["available", "on_trip", "in_shop", "retired"];

export const listVehiclesValidation = [
  query("status").optional().isIn(statuses).withMessage("Vehicle status is invalid"),
  query("type").optional().isString().trim().isLength({ max: 60 }).withMessage("Vehicle type is invalid"),
  query("region").optional().isString().trim().isLength({ max: 80 }).withMessage("Region is invalid"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

export const vehicleIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Vehicle id is invalid"),
];

export const createVehicleValidation = [
  body("registrationNumber").trim().notEmpty().withMessage("Registration number is required").isLength({ max: 30 }).withMessage("Registration number is too long"),
  body("nameModel").trim().notEmpty().withMessage("Vehicle model is required").isLength({ max: 120 }).withMessage("Vehicle model is too long"),
  body("type").trim().notEmpty().withMessage("Vehicle type is required").isLength({ max: 60 }).withMessage("Vehicle type is too long"),
  body("maxLoadCapacity").isFloat({ gt: 0 }).withMessage("Max load capacity must be greater than 0"),
  body("odometer").optional().isFloat({ min: 0 }).withMessage("Odometer cannot be negative"),
  body("acquisitionCost").isFloat({ min: 0 }).withMessage("Acquisition cost cannot be negative"),
  body("status").optional().isIn(statuses).withMessage("Vehicle status is invalid"),
  body("region").optional({ nullable: true }).trim().isLength({ max: 80 }).withMessage("Region is too long"),
];

export const updateVehicleValidation = [...vehicleIdValidation, ...createVehicleValidation.map((chain) => chain.optional())];