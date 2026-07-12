const ApiError = require("../utils/ApiError");

/* eslint-disable no-unused-vars */
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.fieldErrors ? { errors: err.fieldErrors } : {}),
    });
  }

  // Prisma unique-constraint violation
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] || "field";
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  console.error("[Unhandled Error]", err);
  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again.",
  });
}

module.exports = errorHandler;
