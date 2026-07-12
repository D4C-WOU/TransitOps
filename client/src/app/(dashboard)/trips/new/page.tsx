"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TripForm, { type TripFormValues } from "@/components/forms/TripForm";
import { api, firstApiError } from "@/lib/api";

export default function NewTripPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const save = async (values: TripFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/trips", values);
      router.push("/trips");
    } catch (err) {
      setError(firstApiError(err, "Unable to create trip"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          New trip
        </h1>
        <p className="text-sm text-graphite-soft">
          Draft a trip — assign a vehicle, driver, route and cargo. Dispatch
          when ready.
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

      <TripForm onSubmit={save} submitting={submitting} />
    </div>
  );
}
