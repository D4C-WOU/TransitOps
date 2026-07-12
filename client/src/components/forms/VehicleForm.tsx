"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { vehicleSchema, type VehicleFormInput, type VehicleFormValues } from "@/lib/validators";
import type { Vehicle } from "@/types";

export default function VehicleForm({ initial, onSubmit, submitting }: { initial?: Vehicle; onSubmit: (values: VehicleFormValues) => Promise<void>; submitting?: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<VehicleFormInput, unknown, VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initial ? {
      registrationNumber: initial.registrationNumber,
      nameModel: initial.nameModel,
      type: initial.type,
      maxLoadCapacity: Number(initial.maxLoadCapacity),
      odometer: Number(initial.odometer),
      acquisitionCost: Number(initial.acquisitionCost),
      status: initial.status,
      region: initial.region || "",
    } : { status: "available", odometer: 0 },
  });
  const input = "mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900";
  return <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
    {[["registrationNumber", "Registration no."], ["nameModel", "Model"], ["type", "Type"], ["region", "Region"]].map(([name, label]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input className={input} {...register(name as keyof VehicleFormInput)} />{errors[name as keyof VehicleFormInput] && <p className="mt-1 text-xs text-red-600">{errors[name as keyof VehicleFormInput]?.message}</p>}</label>)}
    <label className="text-sm font-medium text-slate-700">Capacity<input type="number" className={input} {...register("maxLoadCapacity")} />{errors.maxLoadCapacity && <p className="mt-1 text-xs text-red-600">{errors.maxLoadCapacity.message}</p>}</label>
    <label className="text-sm font-medium text-slate-700">Odometer<input type="number" className={input} {...register("odometer")} /></label>
    <label className="text-sm font-medium text-slate-700">Acquisition cost<input type="number" className={input} {...register("acquisitionCost")} />{errors.acquisitionCost && <p className="mt-1 text-xs text-red-600">{errors.acquisitionCost.message}</p>}</label>
    <label className="text-sm font-medium text-slate-700">Status<select className={input} {...register("status")}><option value="available">available</option><option value="on_trip">on trip</option><option value="in_shop">in shop</option><option value="retired">retired</option></select></label>
    <div className="md:col-span-2"><button disabled={submitting} className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"><Save className="h-4 w-4" />Save vehicle</button></div>
  </form>;
}