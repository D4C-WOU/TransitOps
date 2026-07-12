const { validationResult } = require("express-validator");

/**
 * Runs after express-validator's chain(s) on a route.
 * Returns a structured, field-level error response, e.g.:
 * { success: false, errors: [{ field: "email", message: "Entered email is invalid" }] }
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  return res.status(400).json({
    success: false,
    errors: errors.array().map((e) => ({
      field: e.path,
      message: e.msg,
    })),
  });
}

module.exports = validate;
