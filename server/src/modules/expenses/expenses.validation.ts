import { body, param, query } from "express-validator";

export const listExpensesValidation = [query("vehicleId").optional().isInt({ min: 1 }).withMessage("Vehicle id is invalid")];
export const expenseIdValidation = [param("id").isInt({ min: 1 }).withMessage("Expense id is invalid")];
export const expenseValidation = [
  body("vehicleId").isInt({ min: 1 }).withMessage("Vehicle is required"),
  body("tripId").optional({ nullable: true }).isInt({ min: 1 }).withMessage("Trip id is invalid"),
  body("category").trim().notEmpty().withMessage("Expense category is required").isLength({ max: 80 }).withMessage("Expense category is too long"),
  body("amount").isFloat({ min: 0 }).withMessage("Amount cannot be negative"),
  body("expenseDate").isISO8601().withMessage("Expense date is invalid"),
];