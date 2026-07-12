import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./drivers.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await service.listDrivers(req.query) });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await service.getDriver(Number(req.params.id)) });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "Driver created.", data: await service.createDriver(req.body) });
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Driver updated.", data: await service.updateDriver(Number(req.params.id), req.body) });
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Driver removed or marked off duty.", data: await service.deleteDriver(Number(req.params.id)) });
});