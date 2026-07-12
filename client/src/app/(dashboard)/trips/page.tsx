"use client";

import { useEffect, useState } from "react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { Trip } from "@/types";

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const load = () => api.get<{ data: Trip[] }>("/trips").then((res) => setTrips(res.data.data)).catch((err) => setError(firstApiError(err, "Unable to load trips")));
  useEffect(() => { void load(); }, []);
  const action = async (id: number, name: "dispatch" | "complete" | "cancel") => { try { await api.post(`/trips/${id}/${name}`); load(); } catch (err) { setError(firstApiError(err, `Unable to ${name} trip`)); } };
  return <div className="space-y-4"><div><h1 className="text-2xl font-semibold text-slate-950">Trips</h1><p className="text-sm text-slate-500">Dispatch, complete and cancel transitions are transaction-backed.</p></div>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="grid gap-3">{trips.map((trip) => <div key={trip.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-medium text-slate-950">{trip.source} to {trip.destination}</p><p className="text-sm text-slate-500">{trip.vehicle?.registrationNumber} / {trip.driver?.name} / {Number(trip.cargoWeight)} kg</p></div><StatusBadge status={trip.status} /></div><div className="mt-3 flex gap-2">{trip.status === "draft" && <button onClick={() => action(trip.id, "dispatch")} className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">Dispatch</button>}{trip.status === "dispatched" && <button onClick={() => action(trip.id, "complete")} className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white">Complete</button>}{["draft", "dispatched"].includes(trip.status) && <button onClick={() => action(trip.id, "cancel")} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700">Cancel</button>}</div></div>)}</div></div>;
}
