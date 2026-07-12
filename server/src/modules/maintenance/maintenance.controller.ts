import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./maintenance.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await service.listMaintenance(req.query.vehicleId ? Number(req.query.vehicleId) : undefined) });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "Maintenance opened.", data: await service.createMaintenance(req.body) });
});

export const close = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Maintenance closed.", data: await service.closeMaintenance(Number(req.params.id), req.body.cost ? Number(req.body.cost) : undefined) });
});