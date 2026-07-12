import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import ApiError from "../utils/ApiError";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.fieldErrors ? { errors: err.fieldErrors } : {}),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const field = Array.isArray(err.meta?.target)
        ? String(err.meta?.target[0])
        : "field";

      return res.status(409).json({
        success: false,
        message: `${field} already exists.`,
        errors: [{ field, message: `${field} already exists.` }],
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found.",
      });
    }
  }

  console.error("[Unhandled Error]", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again.",
  });
}