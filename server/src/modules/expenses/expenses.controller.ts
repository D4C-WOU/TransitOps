import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import * as service from "./expenses.service";

export const list = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await service.listExpenses(req.query.vehicleId ? Number(req.query.vehicleId) : undefined) });
});
export const create = asyncHandler(async (req: Request, res: Response) => {
  res.status(201).json({ success: true, message: "Expense created.", data: await service.createExpense(req.body) });
});
export const remove = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, message: "Expense deleted.", data: await service.deleteExpense(Number(req.params.id)) });
});