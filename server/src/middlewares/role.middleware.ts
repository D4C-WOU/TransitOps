import type { NextFunction, Request, Response } from "express";
import type { Role } from "@prisma/client";
import ApiError from "../utils/ApiError";

export default function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new ApiError(401, "Authentication required."));
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Access denied. Requires role: ${allowedRoles.join(" or ")}.`));
    }
    next();
  };
}