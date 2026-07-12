import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../../config/db";
import { signToken } from "../../utils/jwt";
import asyncWrapper from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
const isProd = process.env.NODE_ENV === "production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

/**
 * POST /api/auth/login
 */
export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (user.status !== "active") {
    throw new ApiError(
      403,
      "This account has been deactivated. Contact an admin."
    );
  }

  const token = signToken({
    id: user.id,
    role: user.role,
  });

  res.cookie("token", token, COOKIE_OPTIONS);

  return res.status(200).json({
    success: true,
    message: "Login successful.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * POST /api/auth/signup
 *
 * Self-serve signup deliberately only ever creates a base "driver"
 * account, regardless of anything the client sends. Every other role
 * (fleet_manager, safety_officer, financial_analyst, admin) has real
 * operational authority — assigning trips, closing maintenance, viewing
 * financials — so per the RBAC model in spec 3.1, those are provisioned
 * by an admin, not chosen by whoever fills out this form.
 */
export const signup = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError(409, "An account with this email already exists.", [
      { field: "email", message: "An account with this email already exists." },
    ]);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: "driver" },
  });

  const token = signToken({ id: user.id, role: user.role });
  res.cookie("token", token, COOKIE_OPTIONS);

  return res.status(201).json({
    success: true,
    message: "Account created.",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * GET /api/auth/me
 */
export const me = asyncWrapper(async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

/**
 * POST /api/auth/logout
 */
export const logout = asyncWrapper(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out.",
  });
});
