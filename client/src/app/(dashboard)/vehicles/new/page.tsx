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

  const save = async (values: VehicleFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/vehicles", values);
      router.push("/vehicles");
    } catch (err) {
      setError(firstApiError(err, "Unable to create vehicle"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          New vehicle
        </h1>
        <p className="text-sm text-graphite-soft">
          Add a vehicle to the fleet manifest — registration number must be
          unique.
        </p>
      </div>

      {error && (
        <div
          className="card rail p-3 text-sm text-route"
          style={{ ["--rail-color" as string]: "#c1453a" }}
        >
          {error}
        </div>
      )}

      <VehicleForm onSubmit={save} submitting={submitting} />
    </div>
  );
}
