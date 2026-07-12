import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./vehicles.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.listVehicles(req.query);
  res.json({ success: true, data });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.getVehicle(Number(req.params.id));
  res.json({ success: true, data });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.createVehicle(req.body);
  res.status(201).json({ success: true, message: "Vehicle created.", data });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.updateVehicle(Number(req.params.id), req.body);
  res.json({ success: true, message: "Vehicle updated.", data });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  const data = await service.deleteVehicle(Number(req.params.id));
  res.json({ success: true, message: "Vehicle removed or retired.", data });
});