"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { api, firstApiError } from "@/lib/api";
import type { Vehicle, PaginatedResult } from "@/types";

type Fuel = {
  id: number;
  liters: number | string;
  cost: number | string;
  logDate: string;
  vehicle: { registrationNumber: string };
};
type Expense = {
  id: number;
  category: string;
  amount: number | string;
  expenseDate: string;
  vehicle: { registrationNumber: string };
};

const EXPENSE_CATEGORIES = [
  "toll",
  "parking",
  "repair",
  "cleaning",
  "insurance",
  "other",
];

export default function FuelExpensesPage() {
  const [fuel, setFuel] = useState<Fuel[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [showFuelForm, setShowFuelForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const [fVehicleId, setFVehicleId] = useState("");
  const [fLiters, setFLiters] = useState("");
  const [fCost, setFCost] = useState("");
  const [fDate, setFDate] = useState(new Date().toISOString().slice(0, 10));
  const [fSubmitting, setFSubmitting] = useState(false);
  const [fError, setFError] = useState<string | null>(null);

  const [eVehicleId, setEVehicleId] = useState("");
  const [eCategory, setECategory] = useState("toll");
  const [eAmount, setEAmount] = useState("");
  const [eDate, setEDate] = useState(new Date().toISOString().slice(0, 10));
  const [eSubmitting, setESubmitting] = useState(false);
  const [eError, setEError] = useState<string | null>(null);

  const load = () =>
    Promise.all([
      api.get<{ data: Fuel[] }>("/fuel-logs"),
      api.get<{ data: Expense[] }>("/expenses"),
    ])
      .then(([f, e]) => {
        setFuel(f.data.data);
        setExpenses(e.data.data);
      })
      .catch((err) => setError(firstApiError(err, "Unable to load cost data")));

  useEffect(() => {
    void load();
    api
      .get<{ data: PaginatedResult<Vehicle> }>("/vehicles", {
        params: { limit: 100 },
      })
      .then((res) => setVehicles(res.data.data.items))
      .catch(() => {});
  }, []);

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fVehicleId || !fLiters || !fCost)
      return setFError("All fields are required.");
    setFSubmitting(true);
    setFError(null);
    try {
      await api.post("/fuel-logs", {
        vehicleId: Number(fVehicleId),
        liters: Number(fLiters),
        cost: Number(fCost),
        logDate: fDate,
      });
      setShowFuelForm(false);
      setFVehicleId("");
      setFLiters("");
      setFCost("");
      load();
    } catch (err) {
      setFError(firstApiError(err, "Unable to save fuel log"));
    } finally {
      setFSubmitting(false);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eVehicleId || !eAmount) return setEError("All fields are required.");
    setESubmitting(true);
    setEError(null);
    try {
      await api.post("/expenses", {
        vehicleId: Number(eVehicleId),
        category: eCategory,
        amount: Number(eAmount),
        expenseDate: eDate,
      });
      setShowExpenseForm(false);
      setEVehicleId("");
      setEAmount("");
      load();
    } catch (err) {
      setEError(firstApiError(err, "Unable to save expense"));
    } finally {
      setESubmitting(false);
    }
  };

  const inputCls =
    "mt-1 w-full rounded-md border border-paper-dim px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-signal";
  const addBtnCls =
    "inline-flex items-center gap-1 rounded-md bg-ink px-2 py-1 text-xs font-medium text-white hover:bg-ink-soft";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          Fuel & costs
        </h1>
        <p className="text-sm text-graphite-soft">
          Cost records are normalized by vehicle and optional trip.
        </p>
      </div>

      {error && (
        <div
          className="card rail p-3 text-sm text-route"
          style={{ ["--rail-color" as string]: "#c1453a" }}
        >
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Fuel logs */}
        <section
          className="card rail space-y-3 p-4"
          style={{ ["--rail-color" as string]: "#e8a13d" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-graphite">
              Fuel logs
            </h2>
            <button
              onClick={() => setShowFuelForm((v) => !v)}
              className={addBtnCls}
            >
              {showFuelForm ? (
                <X className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              {showFuelForm ? "Cancel" : "Add"}
            </button>
          </div>

          {showFuelForm && (
            <form
              onSubmit={handleFuelSubmit}
              className="space-y-2 border-t border-paper-dim pt-3"
            >
              {fError && <p className="text-xs text-route">{fError}</p>}
              <label className="block text-xs font-medium text-graphite-soft">
                Vehicle
                <select
                  className={inputCls}
                  value={fVehicleId}
                  onChange={(e) => setFVehicleId(e.target.value)}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-graphite-soft">
                Liters
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className={inputCls}
                  value={fLiters}
                  onChange={(e) => setFLiters(e.target.value)}
                  placeholder="40"
                />
              </label>
              <label className="block text-xs font-medium text-graphite-soft">
                Cost (₹)
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className={inputCls}
                  value={fCost}
                  onChange={(e) => setFCost(e.target.value)}
                  placeholder="4200"
                />
              </label>
              <label className="block text-xs font-medium text-graphite-soft">
                Date
                <input
                  type="date"
                  className={inputCls}
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={fSubmitting}
                className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
              >
                {fSubmitting ? "Saving…" : "Save fuel log"}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {fuel.length === 0 && (
              <p className="py-4 text-center text-xs text-graphite-faint">
                No fuel logs yet.
              </p>
            )}
            {fuel.map((row) => (
              <div
                key={row.id}
                className="flex justify-between rounded-md bg-paper px-3 py-2 text-sm"
              >
                <span className="font-tabular">
                  {row.vehicle.registrationNumber} / {Number(row.liters)} L
                  <span className="ml-2 text-xs text-graphite-faint">
                    {new Date(row.logDate).toLocaleDateString()}
                  </span>
                </span>
                <span className="font-tabular">
                  ₹{Number(row.cost).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Expenses */}
        <section
          className="card rail space-y-3 p-4"
          style={{ ["--rail-color" as string]: "#b3651f" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-graphite">
              Expenses
            </h2>
            <button
              onClick={() => setShowExpenseForm((v) => !v)}
              className={addBtnCls}
            >
              {showExpenseForm ? (
                <X className="h-3 w-3" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              {showExpenseForm ? "Cancel" : "Add"}
            </button>
          </div>

          {showExpenseForm && (
            <form
              onSubmit={handleExpenseSubmit}
              className="space-y-2 border-t border-paper-dim pt-3"
            >
              {eError && <p className="text-xs text-route">{eError}</p>}
              <label className="block text-xs font-medium text-graphite-soft">
                Vehicle
                <select
                  className={inputCls}
                  value={eVehicleId}
                  onChange={(e) => setEVehicleId(e.target.value)}
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-graphite-soft">
                Category
                <select
                  className={inputCls}
                  value={eCategory}
                  onChange={(e) => setECategory(e.target.value)}
                >
                  {EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-medium text-graphite-soft">
                Amount (₹)
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  className={inputCls}
                  value={eAmount}
                  onChange={(e) => setEAmount(e.target.value)}
                  placeholder="350"
                />
              </label>
              <label className="block text-xs font-medium text-graphite-soft">
                Date
                <input
                  type="date"
                  className={inputCls}
                  value={eDate}
                  onChange={(e) => setEDate(e.target.value)}
                />
              </label>
              <button
                type="submit"
                disabled={eSubmitting}
                className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
              >
                {eSubmitting ? "Saving…" : "Save expense"}
              </button>
            </form>
          )}

          <div className="space-y-2">
            {expenses.length === 0 && (
              <p className="py-4 text-center text-xs text-graphite-faint">
                No expenses yet.
              </p>
            )}
            {expenses.map((row) => (
              <div
                key={row.id}
                className="flex justify-between rounded-md bg-paper px-3 py-2 text-sm"
              >
                <span className="font-tabular">
                  {row.vehicle.registrationNumber} / {row.category}
                  <span className="ml-2 text-xs text-graphite-faint">
                    {new Date(row.expenseDate).toLocaleDateString()}
                  </span>
                </span>
                <span className="font-tabular">
                  ₹{Number(row.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
