"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { PaginatedResult, Vehicle } from "@/types";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { api.get<{ data: PaginatedResult<Vehicle> }>("/vehicles", { params: { status: status || undefined } }).then((res) => setVehicles(res.data.data.items)).catch((err) => setError(firstApiError(err, "Unable to load vehicles"))); }, [status]);
  return <div className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-semibold text-slate-950">Vehicles</h1><p className="text-sm text-slate-500">Fleet records from the relational vehicle table.</p></div><Link href="/vehicles/new" className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4" />New</Link></div><select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-300 px-3 py-2 text-sm"><option value="">All statuses</option><option value="available">Available</option><option value="on_trip">On trip</option><option value="in_shop">In shop</option><option value="retired">Retired</option></select>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-3">Registration</th><th className="p-3">Model</th><th className="p-3">Type</th><th className="p-3">Region</th><th className="p-3">Status</th></tr></thead><tbody>{vehicles.map((v) => <tr key={v.id} className="border-t border-slate-100"><td className="p-3 font-medium"><Link href={`/vehicles/${v.id}`}>{v.registrationNumber}</Link></td><td className="p-3">{v.nameModel}</td><td className="p-3">{v.type}</td><td className="p-3">{v.region || "-"}</td><td className="p-3"><StatusBadge status={v.status} /></td></tr>)}</tbody></table></div></div>;
}