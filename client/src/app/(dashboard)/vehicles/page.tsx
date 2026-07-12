"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { PaginatedResult, Vehicle } from "@/types";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ data: PaginatedResult<Vehicle> }>("/vehicles", {
        params: { status: status || undefined, limit: 100 },
      })
      .then((res) => setVehicles(res.data.data.items))
      .catch((err) => setError(firstApiError(err, "Unable to load vehicles")));
  }, [status]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) =>
        v.registrationNumber.toLowerCase().includes(q) ||
        v.nameModel.toLowerCase().includes(q) ||
        v.type.toLowerCase().includes(q) ||
        (v.region ?? "").toLowerCase().includes(q),
    );
  }, [vehicles, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-graphite">
            Vehicles
          </h1>
          <p className="text-sm text-graphite-soft">
            Fleet records from the relational vehicle table.
          </p>
        </div>
        <Link
          href="/vehicles/new"
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
            placeholder="Search registration, model, type or region…"
            className="w-full rounded-md border border-paper-dim bg-paper-card py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-signal"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-paper-dim bg-paper-card px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="on_trip">On trip</option>
          <option value="in_shop">In shop</option>
          <option value="retired">Retired</option>
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
              <th className="p-3">Registration</th>
              <th className="p-3">Model</th>
              <th className="p-3">Type</th>
              <th className="p-3">Region</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-graphite-faint">
                  {search
                    ? "No vehicles match that search."
                    : "No vehicles found."}
                </td>
              </tr>
            )}
            {filtered.map((v) => (
              <tr key={v.id} className="border-t border-paper-dim">
                <td className="font-tabular p-3 font-medium text-graphite">
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="hover:text-signal-dark"
                  >
                    {v.registrationNumber}
                  </Link>
                </td>
                <td className="p-3">{v.nameModel}</td>
                <td className="p-3">{v.type}</td>
                <td className="p-3">{v.region || "—"}</td>
                <td className="p-3">
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
