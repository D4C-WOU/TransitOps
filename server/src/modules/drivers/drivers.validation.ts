import { body, param, query } from "express-validator";

const statuses = ["available", "on_trip", "off_duty", "suspended"];

export const listDriversValidation = [
  query("status").optional().isIn(statuses).withMessage("Driver status is invalid"),
  query("licenseCategory").optional().trim().isLength({ max: 40 }).withMessage("License category is invalid"),
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
];

export const driverIdValidation = [param("id").isInt({ min: 1 }).withMessage("Driver id is invalid")];

export const createDriverValidation = [
  body("userId").optional({ nullable: true }).isInt({ min: 1 }).withMessage("User id is invalid"),
  body("name").trim().notEmpty().withMessage("Driver name is required").isLength({ max: 120 }).withMessage("Driver name is too long"),
  body("licenseNumber").trim().notEmpty().withMessage("License number is required").isLength({ max: 60 }).withMessage("License number is too long"),
  body("licenseCategory").trim().notEmpty().withMessage("License category is required").isLength({ max: 40 }).withMessage("License category is too long"),
  body("licenseExpiryDate").isISO8601().withMessage("License expiry date is invalid"),
  body("contactNumber").trim().isLength({ min: 8, max: 20 }).withMessage("Contact number is invalid"),
  body("safetyScore").optional().isFloat({ min: 0, max: 100 }).withMessage("Safety score must be between 0 and 100"),
  body("status").optional().isIn(statuses).withMessage("Driver status is invalid"),
];

export const updateDriverValidation = [
  ...driverIdValidation,
  body("userId").optional({ nullable: true }).isInt({ min: 1 }).withMessage("User id is invalid"),
  body("name").optional().trim().notEmpty().withMessage("Driver name is required").isLength({ max: 120 }).withMessage("Driver name is too long"),
  body("licenseNumber").optional().trim().notEmpty().withMessage("License number is required").isLength({ max: 60 }).withMessage("License number is too long"),
  body("licenseCategory").optional().trim().notEmpty().withMessage("License category is required").isLength({ max: 40 }).withMessage("License category is too long"),
  body("licenseExpiryDate").optional().isISO8601().withMessage("License expiry date is invalid"),
  body("contactNumber").optional().trim().isLength({ min: 8, max: 20 }).withMessage("Contact number is invalid"),
  body("safetyScore").optional().isFloat({ min: 0, max: 100 }).withMessage("Safety score must be between 0 and 100"),
  body("status").optional().isIn(statuses).withMessage("Driver status is invalid"),
];