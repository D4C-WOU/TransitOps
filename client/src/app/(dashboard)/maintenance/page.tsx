"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { api, firstApiError } from "@/lib/api";
import type { Vehicle, PaginatedResult } from "@/types";

type Maintenance = {
  id: number;
  type: string;
  description?: string;
  cost?: number | string;
  status: string;
  startedAt: string;
  vehicle: { registrationNumber: string };
};

export default function MaintenancePage() {
  const [rows, setRows] = useState<Maintenance[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [vehicleId, setVehicleId] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = () =>
    api
      .get<{ data: Maintenance[] }>("/maintenance")
      .then((res) => setRows(res.data.data))
      .catch((err) =>
        setError(firstApiError(err, "Unable to load maintenance")),
      );

  useEffect(() => {
    void load();
    api
      .get<{ data: PaginatedResult<Vehicle> }>("/vehicles", {
        params: { limit: 100 },
      })
      .then((res) => setVehicles(res.data.data.items))
      .catch(() => {});
  }, []);

  const close = async (id: number) => {
    try {
      await api.post(`/maintenance/${id}/close`);
      load();
    } catch (err) {
      setError(firstApiError(err, "Unable to close maintenance"));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !type.trim())
      return setFormError("Vehicle and maintenance type are required.");
    setSubmitting(true);
    setFormError(null);
    try {
      await api.post("/maintenance", {
        vehicleId: Number(vehicleId),
        type: type.trim(),
        description: description.trim() || undefined,
        cost: cost ? Number(cost) : undefined,
      });
      setShowForm(false);
      setVehicleId("");
      setType("");
      setDescription("");
      setCost("");
      load();
    } catch (err) {
      setFormError(firstApiError(err, "Unable to create maintenance log"));
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "mt-1 w-full rounded-md border border-paper-dim px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-signal";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-graphite">
            Maintenance
          </h1>
          <p className="text-sm text-graphite-soft">
            Active logs automatically place vehicles in shop.
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-3 py-2 text-sm font-medium text-white hover:bg-ink-soft"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> New log
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="card grid gap-4 p-4 md:grid-cols-2"
        >
          {formError && (
            <div
              className="card rail md:col-span-2 p-3 text-sm text-route"
              style={{ ["--rail-color" as string]: "#c1453a" }}
            >
              {formError}
            </div>
          )}

          <label className="text-sm font-medium text-graphite-soft">
            Vehicle
            <select
              className={inputCls}
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">Select vehicle</option>
              {vehicles
                .filter((v) => v.status !== "on_trip")
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.registrationNumber} — {v.nameModel} ({v.status})
                  </option>
                ))}
            </select>
          </label>

          <label className="text-sm font-medium text-graphite-soft">
            Type
            <input
              className={inputCls}
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Oil Change, Tyre, Brake service…"
            />
          </label>

          <label className="text-sm font-medium text-graphite-soft">
            Description (optional)
            <input
              className={inputCls}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details"
            />
          </label>

          <label className="text-sm font-medium text-graphite-soft">
            Estimated cost ₹ (optional)
            <input
              type="number"
              min={0}
              step={0.01}
              className={inputCls}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0"
            />
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {submitting ? "Opening…" : "Open maintenance log"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div
          className="card rail p-3 text-sm text-route"
          style={{ ["--rail-color" as string]: "#c1453a" }}
        >
          {error}
        </div>
      )}

      <div className="grid gap-3">
        {rows.length === 0 && !error && (
          <div className="card border-dashed p-8 text-center">
            <p className="text-sm text-graphite-faint">
              No maintenance logs found.
            </p>
          </div>
        )}
        {rows.map((row) => (
          <div
            key={row.id}
            className="card rail flex flex-wrap items-center justify-between gap-3 p-4"
            style={{ ["--rail-color" as string]: "#b3651f" }}
          >
            <div>
              <p className="font-display font-medium text-graphite">
                {row.vehicle.registrationNumber} / {row.type}
              </p>
              {row.description && (
                <p className="text-sm text-graphite-soft">{row.description}</p>
              )}
              <p className="font-tabular text-sm text-graphite-faint">
                Cost ₹{Number(row.cost || 0).toLocaleString()} ·{" "}
                {new Date(row.startedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={row.status} />
              {row.status === "active" && (
                <button
                  onClick={() => close(row.id)}
                  className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-soft"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
