const { verifyToken } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");
const asyncWrapper = require("../utils/asyncWrapper");
const prisma = require("../config/db");

/**
 * Verifies the JWT (from httpOnly cookie, or Authorization: Bearer header
 * as a fallback for non-browser clients) and attaches the current user
 * to req.user. Rejects if the user no longer exists or is inactive.
 */
const authenticate = asyncWrapper(async (req, res, next) => {
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
  } catch (err) {
    throw new ApiError(401, "Session expired or invalid. Please log in again.");
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new ApiError(401, "Account no longer exists.");
  }
  if (user.status !== "active") {
    throw new ApiError(403, "This account has been deactivated.");
  }

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
});

module.exports = authenticate;
