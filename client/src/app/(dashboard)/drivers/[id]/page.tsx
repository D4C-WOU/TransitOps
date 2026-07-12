// client/src/app/(dashboard)/drivers/[id]/page.tsx
"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DriverForm from "@/components/forms/DriverForm";
import { api, firstApiError } from "@/lib/api";
import type { Driver } from "@/types";
import type { DriverFormValues } from "@/lib/validators";

export default function EditDriverPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<{ data: Driver }>(`/drivers/${id}`)
      .then((res) => setDriver(res.data.data))
      .catch((err) => setError(firstApiError(err, "Unable to load driver")));
  }, [id]);

  const save = async (values: DriverFormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await api.put(`/drivers/${id}`, values);
      router.push("/drivers");
    } catch (err) {
      setError(firstApiError(err, "Unable to update driver"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!driver && !error)
    return <div className="text-sm text-slate-500">Loading driver...</div>;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Edit driver</h1>
        <p className="text-sm text-slate-500">
          Update license or contact information.
        </p>
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {driver && (
        <DriverForm initial={driver} onSubmit={save} submitting={submitting} />
      )}
    </div>
  );
}
