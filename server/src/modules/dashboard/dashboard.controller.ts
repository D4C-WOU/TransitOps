import type { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { getKpis } from "./dashboard.service";

export const kpis = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: await getKpis(req.query) });
});