import { query } from "express-validator";

export const reportValidation = [
  query("vehicleId").optional().isInt({ min: 1 }).withMessage("Vehicle id is invalid"),
  query("format").optional().isIn(["json", "csv"]).withMessage("Report format is invalid"),
];