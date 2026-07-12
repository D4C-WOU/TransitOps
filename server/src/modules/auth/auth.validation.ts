import { body } from "express-validator";

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Entered email is invalid")
    .normalizeEmail(),
  body("password")
    .isString()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
];