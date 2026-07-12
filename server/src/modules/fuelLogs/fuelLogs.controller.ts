import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./fuelLogs.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await service.listFuelLogs(req.query.vehicleId ? Number(req.query.vehicleId) : undefined) });
});
export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "Fuel log created.", data: await service.createFuelLog(req.body) });
});
export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Fuel log deleted.", data: await service.deleteFuelLog(Number(req.params.id)) });
});