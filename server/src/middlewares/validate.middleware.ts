import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export default function validate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    message: "Validation failed.",
    errors: errors.array().map((error) => ({
      field: error.type === "field" ? error.path : "request",
      message: error.msg,
    })),
  });
}