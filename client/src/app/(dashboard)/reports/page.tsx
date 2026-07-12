"use client";

import { useEffect, useState } from "react";
import { api, firstApiError } from "@/lib/api";

type CostRow = {
  vehicleId: number;
  registrationNumber: string;
  fuel: number;
  expenses: number;
  maintenance: number;
  totalCost: number;
  roiPercent: number;
};
type FuelRow = {
  vehicleId: number;
  registrationNumber: string;
  distance: number;
  liters: number;
  kmPerLiter: number;
};
type UtilRow = {
  vehicleId: number;
  registrationNumber: string;
  status: string;
  totalTrips: number;
  completedTrips: number;
  utilizationScore: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function ExportButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="rounded-md bg-ink px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-soft"
    >
      Export CSV
    </a>
  );
}

export default function ReportsPage() {
  const [cost, setCost] = useState<CostRow[]>([]);
  const [fuel, setFuel] = useState<FuelRow[]>([]);
  const [util, setUtil] = useState<UtilRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<{ data: CostRow[] }>("/reports/operational-cost"),
      api.get<{ data: FuelRow[] }>("/reports/fuel-efficiency"),
      api.get<{ data: UtilRow[] }>("/reports/utilization"),
    ])
      .then(([c, f, u]) => {
        setCost(c.data.data);
        setFuel(f.data.data);
        setUtil(u.data.data);
      })
      .catch((err) => setError(firstApiError(err, "Unable to load reports")));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          Reports
        </h1>
        <p className="text-sm text-graphite-soft">
          Fuel efficiency, fleet utilization, operational cost and ROI —
          generated from relational records.
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

      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-graphite">
            Fuel efficiency (km/L)
          </h2>
          <ExportButton
            href={`${API_BASE}/reports/fuel-efficiency?format=csv`}
          />
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase text-graphite-faint">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Distance (km)</th>
                <th className="p-3">Liters</th>
                <th className="p-3">km/L</th>
              </tr>
            </thead>
            <tbody>
              {fuel.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="p-4 text-center text-graphite-faint"
                  >
                    No fuel data yet.
                  </td>
                </tr>
              )}
              {fuel.map((row) => (
                <tr
                  key={row.vehicleId}
                  className="border-t border-paper-dim font-tabular"
                >
                  <td className="p-3 font-medium text-graphite">
                    {row.registrationNumber}
                  </td>
                  <td className="p-3">{row.distance}</td>
                  <td className="p-3">{row.liters}</td>
                  <td className="p-3">{row.kmPerLiter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-graphite">
            Fleet utilization
          </h2>
          <ExportButton href={`${API_BASE}/reports/utilization?format=csv`} />
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase text-graphite-faint">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total trips</th>
                <th className="p-3">Completed</th>
                <th className="p-3">Utilization %</th>
              </tr>
            </thead>
            <tbody>
              {util.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-graphite-faint"
                  >
                    No trip data yet.
                  </td>
                </tr>
              )}
              {util.map((row) => (
                <tr key={row.vehicleId} className="border-t border-paper-dim">
                  <td className="p-3 font-tabular font-medium text-graphite">
                    {row.registrationNumber}
                  </td>
                  <td className="p-3 capitalize text-graphite-soft">
                    {row.status.replace(/_/g, " ")}
                  </td>
                  <td className="font-tabular p-3">{row.totalTrips}</td>
                  <td className="font-tabular p-3">{row.completedTrips}</td>
                  <td className="font-tabular p-3">{row.utilizationScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-semibold text-graphite">
            Operational cost & ROI
          </h2>
          <ExportButton
            href={`${API_BASE}/reports/operational-cost?format=csv`}
          />
        </div>
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-paper text-xs uppercase text-graphite-faint">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Fuel</th>
                <th className="p-3">Expenses</th>
                <th className="p-3">Maintenance</th>
                <th className="p-3">Total</th>
                <th className="p-3">ROI</th>
              </tr>
            </thead>
            <tbody>
              {cost.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-4 text-center text-graphite-faint"
                  >
                    No cost data yet.
                  </td>
                </tr>
              )}
              {cost.map((row) => (
                <tr
                  key={row.vehicleId}
                  className="border-t border-paper-dim font-tabular"
                >
                  <td className="p-3 font-medium text-graphite">
                    {row.registrationNumber}
                  </td>
                  <td className="p-3">Rs {row.fuel.toLocaleString()}</td>
                  <td className="p-3">Rs {row.expenses.toLocaleString()}</td>
                  <td className="p-3">Rs {row.maintenance.toLocaleString()}</td>
                  <td className="p-3">Rs {row.totalCost.toLocaleString()}</td>
                  <td className="p-3">{row.roiPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
