import type { NextFunction, Request, Response } from "express";
import prisma from "../config/db";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { verifyToken } from "../utils/jwt";

const authenticate = asyncHandler(async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : null;
  const token = req.cookies?.token || bearer;

  if (!token) {
    throw new ApiError(401, "Authentication required. Please log in.");
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch {
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) throw new ApiError(401, "Account no longer exists.");
  if (user.status !== "active") throw new ApiError(403, "This account has been deactivated.");

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
});

export default authenticate;