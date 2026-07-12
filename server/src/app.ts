import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import driverRoutes from "./modules/drivers/drivers.routes";
import expenseRoutes from "./modules/expenses/expenses.routes";
import fuelLogRoutes from "./modules/fuelLogs/fuelLogs.routes";
import maintenanceRoutes from "./modules/maintenance/maintenance.routes";
import reportRoutes from "./modules/reports/reports.routes";
import tripRoutes from "./modules/trips/trips.routes";
import vehicleRoutes from "./modules/vehicles/vehicles.routes";
import errorHandler from "./middlewares/error.middleware";
import { apiLimiter } from "./middlewares/rateLimiter";
import ApiError from "./utils/ApiError";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api", apiLimiter);

app.get("/api/health", (_req, res) => res.json({ success: true, status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/fuel-logs", fuelLogRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, _res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;