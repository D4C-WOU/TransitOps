"use client";

import { useEffect, useState } from "react";
import { api, firstApiError } from "@/lib/api";

type Fuel = { id: number; liters: number | string; cost: number | string; logDate: string; vehicle: { registrationNumber: string } };
type Expense = { id: number; category: string; amount: number | string; expenseDate: string; vehicle: { registrationNumber: string } };

export default function FuelExpensesPage() {
  const [fuel, setFuel] = useState<Fuel[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { Promise.all([api.get<{ data: Fuel[] }>("/fuel-logs"), api.get<{ data: Expense[] }>("/expenses")]).then(([f, e]) => { setFuel(f.data.data); setExpenses(e.data.data); }).catch((err) => setError(firstApiError(err, "Unable to load cost data"))); }, []);
  return <div className="space-y-4"><div><h1 className="text-2xl font-semibold text-slate-950">Fuel & costs</h1><p className="text-sm text-slate-500">Cost records are normalized by vehicle and optional trip.</p></div>{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}<div className="grid gap-4 lg:grid-cols-2"><section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-sm font-semibold">Fuel logs</h2><div className="mt-3 space-y-2">{fuel.map((row) => <div key={row.id} className="flex justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"><span>{row.vehicle.registrationNumber} / {Number(row.liters)} L</span><span>Rs {Number(row.cost).toLocaleString()}</span></div>)}</div></section><section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-sm font-semibold">Expenses</h2><div className="mt-3 space-y-2">{expenses.map((row) => <div key={row.id} className="flex justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"><span>{row.vehicle.registrationNumber} / {row.category}</span><span>Rs {Number(row.amount).toLocaleString()}</span></div>)}</div></section></div></div>;
}