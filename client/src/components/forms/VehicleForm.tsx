"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import {
  vehicleSchema,
  type VehicleFormInput,
  type VehicleFormValues,
} from "@/lib/validators";
import type { Vehicle } from "@/types";

interface Props {
  initial?: Vehicle;
  onSubmit: (values: VehicleFormValues) => Promise<void>;
  submitting?: boolean;
}

const STATUS_OPTIONS = ["available", "on_trip", "in_shop", "retired"] as const;

export default function VehicleForm({ initial, onSubmit, submitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initial
      ? {
          registrationNumber: initial.registrationNumber,
          nameModel: initial.nameModel,
          type: initial.type,
          maxLoadCapacity: Number(initial.maxLoadCapacity),
          odometer: Number(initial.odometer),
          acquisitionCost: Number(initial.acquisitionCost),
          status: initial.status,
          region: initial.region || "",
        }
      : { status: "available", odometer: 0 },
  });

  const inputCls =
    "mt-1 w-full rounded-md border border-paper-dim px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-signal";
  const errorCls = "mt-1 text-xs text-route";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="card rail grid gap-4 p-4 md:grid-cols-2 md:p-6"
      style={{ ["--rail-color" as string]: "#e8a13d" }}
    >
      <label className="text-sm font-medium text-graphite-soft">
        Registration number
        <input
          className={inputCls}
          {...register("registrationNumber")}
          placeholder="VAN-05"
        />
        {errors.registrationNumber && (
          <p className={errorCls}>{errors.registrationNumber.message}</p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Name / model
        <input
          className={inputCls}
          {...register("nameModel")}
          placeholder="Tata Ace Van"
        />
        {errors.nameModel && (
          <p className={errorCls}>{errors.nameModel.message}</p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Type
        <input
          className={inputCls}
          {...register("type")}
          placeholder="Van, Truck, Bike…"
        />
        {errors.type && <p className={errorCls}>{errors.type.message}</p>}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Region
        <input
          className={inputCls}
          {...register("region")}
          placeholder="North, South, East, West"
        />
        {errors.region && <p className={errorCls}>{errors.region.message}</p>}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Max load capacity (kg)
        <input
          type="number"
          min={0}
          step={0.01}
          className={inputCls}
          {...register("maxLoadCapacity")}
        />
        {errors.maxLoadCapacity && (
          <p className={errorCls}>{errors.maxLoadCapacity.message}</p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Odometer (km)
        <input
          type="number"
          min={0}
          step={0.01}
          className={inputCls}
          {...register("odometer")}
        />
        {errors.odometer && (
          <p className={errorCls}>{errors.odometer.message}</p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Acquisition cost (₹)
        <input
          type="number"
          min={0}
          step={0.01}
          className={inputCls}
          {...register("acquisitionCost")}
        />
        {errors.acquisitionCost && (
          <p className={errorCls}>{errors.acquisitionCost.message}</p>
        )}
      </label>

      <label className="text-sm font-medium text-graphite-soft">
        Status
        <select className={inputCls} {...register("status")}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
        {errors.status && <p className={errorCls}>{errors.status.message}</p>}
      </label>

      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-soft disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {submitting ? "Saving…" : "Save vehicle"}
        </button>
      </div>
    </form>
  );
}
