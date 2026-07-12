"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { Driver, PaginatedResult } from "@/types";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    api
      .get<{ data: PaginatedResult<Driver> }>("/drivers", {
        params: { status: statusFilter || undefined, limit: 100 },
      })
      .then((res) => setDrivers(res.data.data.items))
      .catch((err) => setError(firstApiError(err, "Unable to load drivers")));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return drivers;
    return drivers.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.licenseNumber.toLowerCase().includes(q) ||
        d.licenseCategory.toLowerCase().includes(q),
    );
  }, [drivers, search]);

  const isExpired = (dateStr: string) => new Date(dateStr) < new Date();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-graphite">
            Drivers
          </h1>
          <p className="text-sm text-graphite-soft">
            License validity, safety score and availability controls.
          </p>
        </div>
        <Link
          href="/drivers/new"
          className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-soft"
        >
          <Plus className="h-4 w-4" />
          New
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, license number or category…"
            className="w-full rounded-md border border-paper-dim bg-paper-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-signal"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-paper-dim bg-paper-card px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="on_trip">On trip</option>
          <option value="off_duty">Off duty</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {error && (
        <div
          className="rail card p-3 text-sm"
          style={{ ["--rail-color" as string]: "#c1453a", color: "#8f2c24" }}
        >
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-paper text-xs uppercase text-graphite-faint">
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
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6 text-center text-graphite-faint">
                  {search
                    ? "No drivers match that search."
                    : "No drivers found."}
                </td>
              </tr>
            )}
            {filtered.map((d) => (
              <tr key={d.id} className="border-t border-paper-dim">
                <td className="p-3 font-medium text-graphite">{d.name}</td>
                <td className="font-tabular p-3">{d.licenseNumber}</td>
                <td className="p-3">{d.licenseCategory}</td>
                <td className="p-3">
                  <span
                    className={
                      isExpired(d.licenseExpiryDate)
                        ? "font-medium text-route"
                        : "text-graphite-soft"
                    }
                  >
                    {new Date(d.licenseExpiryDate).toLocaleDateString()}
                    {isExpired(d.licenseExpiryDate) && " ⚠️"}
                  </span>
                </td>
                <td className="font-tabular p-3">
                  {Number(d.safetyScore).toFixed(1)}
                </td>
                <td className="p-3">
                  <StatusBadge status={d.status} />
                </td>
                <td className="p-3">
                  <Link
                    href={`/drivers/${d.id}`}
                    className="text-xs font-medium text-graphite-soft underline hover:text-signal-dark"
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
