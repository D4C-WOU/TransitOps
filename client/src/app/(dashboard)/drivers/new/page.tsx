// client/src/app/(dashboard)/drivers/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DriverForm from "@/components/forms/DriverForm";
import { api, firstApiError } from "@/lib/api";
import type { DriverFormValues } from "@/lib/validators";

export default function NewDriverPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const save = async (values: DriverFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/drivers", values);
      router.push("/drivers");
    } catch (err) {
      setError(firstApiError(err, "Unable to create driver"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          New driver
        </h1>
        <p className="text-sm text-graphite-soft">
          Register a new driver with license and contact details.
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
      <DriverForm onSubmit={save} submitting={submitting} />
    </div>
  );
}
