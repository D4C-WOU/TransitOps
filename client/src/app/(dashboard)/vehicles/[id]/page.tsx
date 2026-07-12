"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VehicleForm from "@/components/forms/VehicleForm";
import { api, firstApiError } from "@/lib/api";
import type { Vehicle } from "@/types";
import type { VehicleFormValues } from "@/lib/validators";

export default function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ data: Vehicle }>(`/vehicles/${id}`)
      .then((res) => setVehicle(res.data.data))
      .catch((err) => setError(firstApiError(err, "Unable to load vehicle")));
  }, [id]);

  const save = async (values: VehicleFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.put(`/vehicles/${id}`, values);
      router.push("/vehicles");
    } catch (err) {
      setError(firstApiError(err, "Unable to update vehicle"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!vehicle && !error)
    return (
      <div className="text-sm text-graphite-faint">Loading vehicle...</div>
    );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          Edit vehicle
        </h1>
        {vehicle && (
          <p className="font-tabular text-sm text-graphite-soft">
            {vehicle.registrationNumber} — {vehicle.nameModel}
          </p>
        )}
      </div>

      {error && (
        <div
          className="card rail p-3 text-sm text-route"
          style={{ ["--rail-color" as string]: "#c1453a" }}
        >
          {error}
        </div>
      )}

      {vehicle && (
        <VehicleForm
          initial={vehicle}
          onSubmit={save}
          submitting={submitting}
        />
      )}
    </div>
  );
}
