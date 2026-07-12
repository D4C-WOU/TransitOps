// client/src/app/(dashboard)/trips/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { Trip } from "@/types";

// ── Complete-trip modal ──────────────────────────────────────────────────────
function CompleteModal({
  trip,
  onConfirm,
  onCancel,
}: {
  trip: Trip;
  onConfirm: (actualDistance: number | undefined) => void;
  onCancel: () => void;
}) {
  const [val, setVal] = useState(String(trip.plannedDistance));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-base font-semibold text-slate-900">
          Complete trip
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {trip.source} → {trip.destination}
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Actual distance (km)
          <input
            type="number"
            min={0}
            step={0.01}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900"
          />
          <p className="mt-1 text-xs text-slate-400">
            Planned: {Number(trip.plannedDistance)} km — leave as-is if
            unchanged.
          </p>
        </label>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onConfirm(val ? Number(val) : undefined)}
            className="flex-1 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Mark complete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [completingTrip, setCompletingTrip] = useState<Trip | null>(null);

  const load = () => {
    setError(null);
    api
      .get<{ data: Trip[] }>("/trips", {
        params: { status: statusFilter || undefined },
      })
      .then((res) => setTrips(res.data.data))
      .catch((err) => setError(firstApiError(err, "Unable to load trips")));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const doAction = async (
    id: number,
    endpoint: string,
    body?: Record<string, unknown>,
  ) => {
    setActionLoading(id);
    setError(null);
    try {
      await api.post(`/trips/${id}/${endpoint}`, body ?? {});
      load();
    } catch (err) {
      setError(firstApiError(err, `Action failed`));
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = (trip: Trip) => setCompletingTrip(trip);

  const confirmComplete = async (actualDistance: number | undefined) => {
    if (!completingTrip) return;
    setCompletingTrip(null);
    await doAction(
      completingTrip.id,
      "complete",
      actualDistance !== undefined ? { actualDistance } : {},
    );
  };

  // Group counts for the summary bar
  const counts = trips.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  const statusColors: Record<string, string> = {
    draft: "bg-slate-100 text-slate-600",
    dispatched: "bg-blue-50 text-blue-700",
    completed: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <>
      {completingTrip && (
        <CompleteModal
          trip={completingTrip}
          onConfirm={confirmComplete}
          onCancel={() => setCompletingTrip(null)}
        />
      )}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">Trips</h1>
            <p className="text-sm text-slate-500">
              Draft → Dispatch → Complete. Each transition is
              database-transaction backed.
            </p>
          </div>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            New trip
          </Link>
        </div>

        {/* Summary pills */}
        {Object.keys(counts).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(counts).map(([status, count]) => (
              <span
                key={status}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  statusColors[status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {status.replace(/_/g, " ")}: {count}
              </span>
            ))}
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="dispatched">Dispatched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={load}
            className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Trip cards */}
        {trips.length === 0 && !error && (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm text-slate-500">No trips found.</p>
            <Link
              href="/trips/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-slate-900 underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first trip
            </Link>
          </div>
        )}

        <div className="grid gap-3">
          {trips.map((trip) => {
            const loading = actionLoading === trip.id;
            return (
              <div
                key={trip.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Top row: route + status */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-950">
                      {trip.source} <span className="text-slate-400">→</span>{" "}
                      {trip.destination}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {trip.vehicle?.registrationNumber} · {trip.driver?.name} ·{" "}
                      {Number(trip.cargoWeight).toLocaleString()} kg ·{" "}
                      {Number(trip.plannedDistance)} km planned
                      {trip.actualDistance != null &&
                        ` · ${Number(trip.actualDistance)} km actual`}
                    </p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>

                {/* Action buttons */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {trip.status === "draft" && (
                    <button
                      disabled={loading}
                      onClick={() => doAction(trip.id, "dispatch")}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {loading ? "…" : "Dispatch"}
                    </button>
                  )}

                  {trip.status === "dispatched" && (
                    <button
                      disabled={loading}
                      onClick={() => handleComplete(trip)}
                      className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {loading ? "…" : "Complete"}
                    </button>
                  )}

                  {(trip.status === "draft" ||
                    trip.status === "dispatched") && (
                    <button
                      disabled={loading}
                      onClick={() => doAction(trip.id, "cancel")}
                      className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {loading ? "…" : "Cancel"}
                    </button>
                  )}

                  {trip.status === "completed" && (
                    <span className="text-xs text-slate-400 italic">
                      Trip closed — no further actions.
                    </span>
                  )}
                  {trip.status === "cancelled" && (
                    <span className="text-xs text-slate-400 italic">
                      Cancelled.
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
