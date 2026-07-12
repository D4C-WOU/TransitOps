const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler.middleware");
const ApiError = require("./utils/ApiError");

// NOTE: vehicle/driver/trip/maintenance/fuel/expense/dashboard/report routes
// are scaffolded as empty files and get mounted here as each phase lands.
// const vehicleRoutes = require("./routes/vehicle.routes");
// const driverRoutes = require("./routes/driver.routes");
// const tripRoutes = require("./routes/trip.routes");

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // allow the httpOnly auth cookie to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// General API rate limit (separate, stricter one applied to /auth/login)
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --- Health check ---
app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

// --- Routes ---
app.use("/api/auth", authRoutes);
// app.use("/api/vehicles", vehicleRoutes);
// app.use("/api/drivers", driverRoutes);
// app.use("/api/trips", tripRoutes);

// --- 404 fallback ---
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// --- Global error handler (must be last) ---
app.use(errorHandler);

module.exports = app;
