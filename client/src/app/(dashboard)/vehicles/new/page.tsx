"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VehicleForm from "@/components/forms/VehicleForm";
import { api, firstApiError } from "@/lib/api";
import type { VehicleFormValues } from "@/lib/validators";

export default function NewVehiclePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const save = async (values: VehicleFormValues) => { setSubmitting(true); setError(null); try { await api.post("/vehicles", values); router.push("/vehicles"); } catch (err) { setError(firstApiError(err, "Unable to create vehicle")); } finally { setSubmitting(false); } };
  return <div className="space-y-4"><h1 className="text-2xl font-semibold text-slate-950">New vehicle</h1>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<VehicleForm onSubmit={save} submitting={submitting} /></div>;
}