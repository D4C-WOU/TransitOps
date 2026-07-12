"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import {
  driverSchema,
  type DriverFormInput,
  type DriverFormValues,
} from "@/lib/validators";
import type { Driver } from "@/types";

interface Props {
  initial?: Driver;
  onSubmit: (values: DriverFormValues) => Promise<void>;
  submitting?: boolean;
}

export default function DriverForm({ initial, onSubmit, submitting }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverFormInput, unknown, DriverFormValues>({
    resolver: zodResolver(driverSchema),
    defaultValues: initial
      ? {
          name: initial.name,
          licenseNumber: initial.licenseNumber,
          licenseCategory: initial.licenseCategory,
          licenseExpiryDate: initial.licenseExpiryDate.slice(0, 10),
          contactNumber: initial.contactNumber,
          safetyScore: Number(initial.safetyScore),
          status: initial.status,
        }
      : {
          safetyScore: 100,
          status: "available",
        },
  });

  const inputCls =
    "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900";
  const errorCls = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2"
    >
      {/* Name */}
      <label className="text-sm font-medium text-slate-700">
        Full name
        <input
          className={inputCls}
          {...register("name")}
          placeholder="Alex Morgan"
        />
        {errors.name && <p className={errorCls}>{errors.name.message}</p>}
      </label>

      {/* License number */}
      <label className="text-sm font-medium text-slate-700">
        License number
        <input
          className={inputCls}
          {...register("licenseNumber")}
          placeholder="DL-1001"
        />
        {errors.licenseNumber && (
          <p className={errorCls}>{errors.licenseNumber.message}</p>
        )}
      </label>

      {/* License category */}
      <label className="text-sm font-medium text-slate-700">
        License category
        <select className={inputCls} {...register("licenseCategory")}>
          <option value="">Select category</option>
          <option value="LMV">LMV — Light Motor Vehicle</option>
          <option value="HMV">HMV — Heavy Motor Vehicle</option>
          <option value="HGMV">HGMV — Heavy Goods Motor Vehicle</option>
          <option value="HPMV">HPMV — Heavy Passenger Motor Vehicle</option>
          <option value="MGV">MGV — Medium Goods Vehicle</option>
        </select>
        {errors.licenseCategory && (
          <p className={errorCls}>{errors.licenseCategory.message}</p>
        )}
      </label>

      {/* License expiry */}
      <label className="text-sm font-medium text-slate-700">
        License expiry date
        <input
          type="date"
          className={inputCls}
          {...register("licenseExpiryDate")}
        />
        {errors.licenseExpiryDate && (
          <p className={errorCls}>{errors.licenseExpiryDate.message}</p>
        )}
      </label>

      {/* Contact number */}
      <label className="text-sm font-medium text-slate-700">
        Contact number
        <input
          className={inputCls}
          {...register("contactNumber")}
          placeholder="9876543210"
        />
        {errors.contactNumber && (
          <p className={errorCls}>{errors.contactNumber.message}</p>
        )}
      </label>

      {/* Safety score */}
      <label className="text-sm font-medium text-slate-700">
        Safety score (0–100)
        <input
          type="number"
          min={0}
          max={100}
          step={0.01}
          className={inputCls}
          {...register("safetyScore")}
        />
        {errors.safetyScore && (
          <p className={errorCls}>{errors.safetyScore.message}</p>
        )}
      </label>

      {/* Status */}
      <label className="text-sm font-medium text-slate-700">
        Status
        <select className={inputCls} {...register("status")}>
          <option value="available">Available</option>
          <option value="on_trip">On trip</option>
          <option value="off_duty">Off duty</option>
          <option value="suspended">Suspended</option>
        </select>
        {errors.status && <p className={errorCls}>{errors.status.message}</p>}
      </label>

      {/* Submit */}
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          Save driver
        </button>
      </div>
    </form>
  );
}
