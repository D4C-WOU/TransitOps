const ApiError = require("../utils/ApiError");

/**
 * Usage: router.get('/x', authenticate, authorize('fleet_manager', 'admin'), handler)
 * Must run AFTER the `authenticate` middleware (needs req.user).
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required."));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Requires role: ${allowedRoles.join(" or ")}.`)
      );
    }
    next();
  };
}

module.exports = authorize;
