import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import type { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-only-change-me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export type JwtPayload = {
  id: number;
  role: Role;
};

export function signToken(payload: JwtPayload) {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}