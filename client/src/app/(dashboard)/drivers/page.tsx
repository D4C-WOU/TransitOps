// client/src/app/(dashboard)/drivers/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { Driver, PaginatedResult } from "@/types";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    api
      .get<{ data: PaginatedResult<Driver> }>("/drivers", {
        params: { status: statusFilter || undefined },
      })
      .then((res) => setDrivers(res.data.data.items))
      .catch((err) => setError(firstApiError(err, "Unable to load drivers")));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">Drivers</h1>
          <p className="text-sm text-slate-500">
            License validity, safety score and availability controls.
          </p>
        </div>
        <Link
          href="/drivers/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          New
        </Link>
      </div>

      {/* Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm"
      >
        <option value="">All statuses</option>
        <option value="available">Available</option>
        <option value="on_trip">On trip</option>
        <option value="off_duty">Off duty</option>
        <option value="suspended">Suspended</option>
      </select>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">License</th>
              <th className="p-3">Category</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Safety</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 && (
              <tr>
                <td colSpan={7} className="p-4 text-center text-slate-500">
                  No drivers found.
                </td>
              </tr>
            )}
            {drivers.map((d) => (
              <tr key={d.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{d.name}</td>
                <td className="p-3">{d.licenseNumber}</td>
                <td className="p-3">{d.licenseCategory}</td>
                <td className="p-3">
                  <span
                    className={
                      isExpired(d.licenseExpiryDate)
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {new Date(d.licenseExpiryDate).toLocaleDateString()}
                    {isExpired(d.licenseExpiryDate) && " ⚠️"}
                  </span>
                </td>
                <td className="p-3">{Number(d.safetyScore).toFixed(1)}</td>
                <td className="p-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="p-3">
                  <Link
                    href={`/drivers/${d.id}`}
                    className="text-xs font-medium text-slate-600 underline hover:text-slate-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
