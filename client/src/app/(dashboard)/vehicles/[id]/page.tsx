"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VehicleForm from "@/components/forms/VehicleForm";
import { api, firstApiError } from "@/lib/api";
import type { Vehicle } from "@/types";
import type { VehicleFormValues } from "@/lib/validators";

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { api.get<{ data: Vehicle }>(`/vehicles/${id}`).then((res) => setVehicle(res.data.data)).catch((err) => setError(firstApiError(err, "Unable to load vehicle"))); }, [id]);
  const save = async (values: VehicleFormValues) => { try { await api.put(`/vehicles/${id}`, values); router.push("/vehicles"); } catch (err) { setError(firstApiError(err, "Unable to update vehicle")); } };
  if (!vehicle) return <div className="text-sm text-slate-500">Loading vehicle...</div>;
  return <div className="space-y-4"><h1 className="text-2xl font-semibold text-slate-950">Edit vehicle</h1>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<VehicleForm initial={vehicle} onSubmit={save} /></div>;
}