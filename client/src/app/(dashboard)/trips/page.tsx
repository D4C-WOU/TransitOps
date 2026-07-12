// client/src/app/(dashboard)/trips/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import { colorsFor } from "@/lib/statusColors";
import type { Trip } from "@/types";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <div className="ticket-form-card">
        <p className="ticket-tag mb-1 text-transit-dark">Complete trip</p>
        <h2 className="font-display text-base font-semibold text-graphite">
          {trip.source} <span className="text-graphite-faint">→</span>{" "}
          {trip.destination}
        </h2>

        <label className="mt-4 block text-sm font-medium text-graphite">
          Actual distance (km)
          <input
            type="number"
            min={0}
            step={0.01}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="mt-1 w-full rounded-md border border-paper-dim px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-signal"
          />
          <p className="mt-1 text-xs text-graphite-faint">
            Planned: {Number(trip.plannedDistance)} km — leave as-is if
            unchanged.
          </p>
        </label>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => onConfirm(val ? Number(val) : undefined)}
            className="flex-1 rounded-md bg-transit px-4 py-2 text-sm font-medium text-white hover:bg-transit-dark"
          >
            Mark complete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 rounded-md border border-paper-dim px-4 py-2 text-sm font-medium text-graphite-soft hover:bg-paper"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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
      setError(firstApiError(err, "Action failed"));
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

  const counts = trips.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold text-graphite">
              Trips
            </h1>
            <p className="text-sm text-graphite-soft">
              Draft → Dispatch → Complete. Each transition is
              database-transaction backed.
            </p>
          </div>
          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-soft"
          >
            <Plus className="h-4 w-4" />
            New trip
          </Link>
        </div>

        {Object.keys(counts).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {Object.entries(counts).map(([status, count]) => {
              const c = colorsFor(status);
              return (
                <span
                  key={status}
                  className="status-pill capitalize"
                  style={{ color: c.fg, background: c.bg }}
                >
                  <span className="status-dot" style={{ background: c.dot }} />
                  {status.replace(/_/g, " ")}: {count}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-paper-dim bg-paper-card px-3 py-2 text-sm text-graphite outline-none focus:ring-2 focus:ring-signal"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="dispatched">Dispatched</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={load}
            className="rounded-md border border-paper-dim px-3 py-2 text-sm text-graphite-soft hover:bg-paper"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div
            className="card rail p-3 text-sm text-route"
            style={{ ["--rail-color" as string]: "#c1453a" }}
          >
            {error}
          </div>
        )}

        {trips.length === 0 && !error && (
          <div className="card border-dashed p-8 text-center">
            <p className="text-sm text-graphite-faint">No trips found.</p>
            <Link
              href="/trips/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-graphite underline"
            >
              <Plus className="h-3.5 w-3.5" />
              Create your first trip
            </Link>
          </div>
        )}

        <div className="grid gap-3">
          {trips.map((trip) => {
            const loading = actionLoading === trip.id;
            const rail = colorsFor(trip.status).dot;
            return (
              <div
                key={trip.id}
                className="card rail p-4"
                style={{ ["--rail-color" as string]: rail }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-display font-semibold text-graphite">
                      {trip.source}{" "}
                      <span className="text-graphite-faint">→</span>{" "}
                      {trip.destination}
                    </p>
                    <p className="font-tabular mt-0.5 text-sm text-graphite-soft">
                      {trip.vehicle?.registrationNumber} · {trip.driver?.name} ·{" "}
                      {Number(trip.cargoWeight).toLocaleString()} kg ·{" "}
                      {Number(trip.plannedDistance)} km planned
                      {trip.actualDistance != null &&
                        ` · ${Number(trip.actualDistance)} km actual`}
                    </p>
                  </div>
                  <StatusBadge status={trip.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {trip.status === "draft" && (
                    <button
                      disabled={loading}
                      onClick={() => doAction(trip.id, "dispatch")}
                      className="rounded-md bg-signal px-3 py-1.5 text-xs font-medium text-ink hover:bg-signal-dark hover:text-white disabled:opacity-50"
                    >
                      {loading ? "…" : "Dispatch"}
                    </button>
                  )}

                  {trip.status === "dispatched" && (
                    <button
                      disabled={loading}
                      onClick={() => handleComplete(trip)}
                      className="rounded-md bg-transit px-3 py-1.5 text-xs font-medium text-white hover:bg-transit-dark disabled:opacity-50"
                    >
                      {loading ? "…" : "Complete"}
                    </button>
                  )}

                  {(trip.status === "draft" ||
                    trip.status === "dispatched") && (
                    <button
                      disabled={loading}
                      onClick={() => doAction(trip.id, "cancel")}
                      className="rounded-md border border-paper-dim px-3 py-1.5 text-xs font-medium text-graphite-soft hover:bg-paper disabled:opacity-50"
                    >
                      {loading ? "…" : "Cancel"}
                    </button>
                  )}

                  {trip.status === "completed" && (
                    <span className="text-xs italic text-graphite-faint">
                      Trip closed — no further actions.
                    </span>
                  )}
                  {trip.status === "cancelled" && (
                    <span className="text-xs italic text-graphite-faint">
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
