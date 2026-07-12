"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";

type Maintenance = { id: number; type: string; description?: string; cost?: number | string; status: string; startedAt: string; vehicle: { registrationNumber: string } };

export default function MaintenancePage() {
  const [rows, setRows] = useState<Maintenance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => api.get<{ data: Maintenance[] }>("/maintenance").then((res) => setRows(res.data.data)).catch((err) => setError(firstApiError(err, "Unable to load maintenance")));
  useEffect(() => { void load(); }, []);
  const close = async (id: number) => { try { await api.post(`/maintenance/${id}/close`); load(); } catch (err) { setError(firstApiError(err, "Unable to close maintenance")); } };
  return <div className="space-y-4"><div><h1 className="text-2xl font-semibold text-slate-950">Maintenance</h1><p className="text-sm text-slate-500">Active logs automatically place vehicles in shop.</p></div>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="grid gap-3">{rows.map((row) => <div key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div><p className="font-medium">{row.vehicle.registrationNumber} / {row.type}</p><p className="text-sm text-slate-500">Cost Rs {Number(row.cost || 0).toLocaleString()}</p></div><div className="flex items-center gap-2"><StatusBadge status={row.status} />{row.status === "active" && <button onClick={() => close(row.id)} className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">Close</button>}</div></div>)}</div></div>;
}
