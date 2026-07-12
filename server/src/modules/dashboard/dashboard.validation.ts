import { query } from "express-validator";
export const dashboardValidation = [
  query("region").optional().trim().isLength({ max: 80 }).withMessage("Region is invalid"),
  query("type").optional().trim().isLength({ max: 60 }).withMessage("Vehicle type is invalid"),
];