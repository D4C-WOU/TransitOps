import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./reports.service";

function respond(req: Request, res: Response, rows: Record<string, unknown>[], filename: string) {
  if (req.query.format === "csv") {
    res.header("Content-Type", "text/csv");
    res.attachment(filename);
    return res.send(service.toCsv(rows));
  }
  return res.json({ success: true, data: rows });
}

export const fuelEfficiency = asyncHandler(async (req: Request, res: Response) => {
  respond(req, res, await service.fuelEfficiency(req.query.vehicleId ? Number(req.query.vehicleId) : undefined), "fuel-efficiency.csv");
});
export const utilization = asyncHandler(async (req: Request, res: Response) => {
  respond(req, res, await service.utilization(), "fleet-utilization.csv");
});
export const operationalCost = asyncHandler(async (req: Request, res: Response) => {
  respond(req, res, await service.operationalCost(req.query.vehicleId ? Number(req.query.vehicleId) : undefined), "operational-cost.csv");
});