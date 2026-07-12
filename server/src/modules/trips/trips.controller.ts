import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./trips.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await service.listTrips(req.query) });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "Trip drafted.", data: await service.createTrip({ ...req.body, createdById: req.user?.id }) });
});

export const dispatch = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Trip dispatched.", data: await service.dispatchTrip(Number(req.params.id)) });
});

export const complete = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Trip completed.", data: await service.completeTrip(Number(req.params.id), req.body.actualDistance ? Number(req.body.actualDistance) : undefined) });
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Trip cancelled.", data: await service.cancelTrip(Number(req.params.id)) });
});