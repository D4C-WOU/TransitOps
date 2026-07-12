"use client";

import { useEffect, useState } from "react";
import { api, firstApiError } from "@/lib/api";

type CostRow = { vehicleId: number; registrationNumber: string; fuel: number; expenses: number; maintenance: number; totalCost: number; roiPercent: number };

export default function ReportsPage() {
  const [rows, setRows] = useState<CostRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { api.get<{ data: CostRow[] }>("/reports/operational-cost").then((res) => setRows(res.data.data)).catch((err) => setError(firstApiError(err, "Unable to load reports"))); }, []);
  return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-slate-950">Reports</h1><p className="text-sm text-slate-500">Operational cost and ROI generated from relational records.</p></div><a href="http://localhost:5000/api/reports/operational-cost?format=csv" className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white">Export CSV</a></div>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Vehicle</th><th className="p-3">Fuel</th><th className="p-3">Expenses</th><th className="p-3">Maintenance</th><th className="p-3">Total</th><th className="p-3">ROI</th></tr></thead><tbody>{rows.map((row) => <tr key={row.vehicleId} className="border-t border-slate-100"><td className="p-3 font-medium">{row.registrationNumber}</td><td className="p-3">Rs {row.fuel.toLocaleString()}</td><td className="p-3">Rs {row.expenses.toLocaleString()}</td><td className="p-3">Rs {row.maintenance.toLocaleString()}</td><td className="p-3">Rs {row.totalCost.toLocaleString()}</td><td className="p-3">{row.roiPercent}%</td></tr>)}</tbody></table></div></div>;
}