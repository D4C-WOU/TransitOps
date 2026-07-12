"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { api, firstApiError } from "@/lib/api";
import {
  tripSchema,
  type TripFormInput,
  type TripFormValues,
} from "@/lib/validators";
import type { Vehicle, Driver, PaginatedResult } from "@/types";

export type { TripFormValues };

interface Props {
  onSubmit: (values: TripFormValues) => Promise<void>;
  submitting?: boolean;
}

export default function TripForm({ onSubmit, submitting }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<{ data: PaginatedResult<Vehicle> }>("/vehicles", {
        params: { status: "available", limit: 100 },
      }),
      api.get<{ data: PaginatedResult<Driver> }>("/drivers", {
        params: { status: "available", limit: 100 },
      }),
    ])
      .then(([vRes, dRes]) => {
        setVehicles(vRes.data.data.items);
        setDrivers(dRes.data.data.items);
      })
      .catch((err) =>
        setLoadError(firstApiError(err, "Unable to load vehicles/drivers")),
      );
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TripFormInput, unknown, TripFormValues>({
    resolver: zodResolver(tripSchema),
  });

  const selectedVehicleId = watch("vehicleId") as number;
  const cargoWeight = watch("cargoWeight") as number;
  const selectedVehicle = vehicles.find(
    (v) => v.id === Number(selectedVehicleId),
  );
  const overCapacity =
    selectedVehicle &&
    cargoWeight > 0 &&
    cargoWeight > Number(selectedVehicle.maxLoadCapacity);

  const inputCls =
    "mt-1 w-full rounded-md border border-paper-dim px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-signal disabled:bg-paper disabled:text-graphite-faint";
  const errorCls = "mt-1 text-xs text-route";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card rail grid gap-4 p-4 md:grid-cols-2 md:p-6"
      style={{ ["--rail-color" as string]: "#1f8a7a" }}
    >
      {loadError && (
        <div
          className="card rail md:col-span-2 p-3 text-sm"
          style={{ ["--rail-color" as string]: "#e8a13d", color: "#8a5f14" }}
        >
          {loadError}
        </div>
      )}

      <label className="text-sm font-medium text-graphite-soft">
        Origin / source
        <input
          className={inputCls}
          {...register("source")}
          placeholder="Mumbai"
        />
        {errors.source && <p className={errorCls}>{errors.source.message}</p>}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Destination
        <input
          className={inputCls}
          {...register("destination")}
          placeholder="Pune"
        />
        {errors.destination && (
          <p className={errorCls}>{errors.destination.message}</p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Vehicle
        <select className={inputCls} {...register("vehicleId")}>
          <option value="">Select available vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.registrationNumber} — {v.nameModel} (cap:{" "}
              {Number(v.maxLoadCapacity)} kg)
            </option>
          ))}
        </select>
        {errors.vehicleId && (
          <p className={errorCls}>{errors.vehicleId.message}</p>
        )}
        {vehicles.length === 0 && !loadError && (
          <p className="mt-1 text-xs text-graphite-faint">
            No available vehicles right now.
          </p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Driver
        <select className={inputCls} {...register("driverId")}>
          <option value="">Select available driver</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.licenseCategory} (score:{" "}
              {Number(d.safetyScore).toFixed(0)})
            </option>
          ))}
        </select>
        {errors.driverId && (
          <p className={errorCls}>{errors.driverId.message}</p>
        )}
        {drivers.length === 0 && !loadError && (
          <p className="mt-1 text-xs text-graphite-faint">
            No available drivers right now.
          </p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Cargo weight (kg)
        <input
          type="number"
          min={0}
          step={0.01}
          className={inputCls}
          {...register("cargoWeight")}
          placeholder="500"
        />
        {errors.cargoWeight && (
          <p className={errorCls}>{errors.cargoWeight.message}</p>
        )}
        {overCapacity && (
          <p className="mt-1 text-xs font-medium text-route">
            ⚠️ Exceeds vehicle capacity of{" "}
            {Number(selectedVehicle!.maxLoadCapacity)} kg — dispatch will be
            rejected.
          </p>
        )}
        {selectedVehicle && !overCapacity && cargoWeight > 0 && (
          <p className="mt-1 text-xs" style={{ color: "#146357" }}>
            Within capacity ({Number(selectedVehicle.maxLoadCapacity)} kg max).
          </p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Planned distance (km)
        <input
          type="number"
          min={0}
          step={0.01}
          className={inputCls}
          {...register("plannedDistance")}
          placeholder="150"
        />
        {errors.plannedDistance && (
          <p className={errorCls}>{errors.plannedDistance.message}</p>
        )}
      </label>

      <div className="md:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-soft disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {submitting ? "Creating…" : "Create trip (draft)"}
        </button>
        <p className="text-xs text-graphite-faint">
          Trip is saved as a draft — dispatch separately when ready.
        </p>
      </div>
    </form>
  );
}
