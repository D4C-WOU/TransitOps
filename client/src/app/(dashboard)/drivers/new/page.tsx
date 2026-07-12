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
        <h1 className="text-2xl font-semibold text-slate-950">New driver</h1>
        <p className="text-sm text-slate-500">
          Register a new driver with license and contact details.
        </p>
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <DriverForm onSubmit={save} submitting={submitting} />
    </div>
  );
}
