"use client";

import { useEffect, useState } from "react";
import { Activity, IndianRupee, Truck, Users } from "lucide-react";
import { api, firstApiError } from "@/lib/api";

type Kpis = {
  fleet: {
    totalVehicles: number;
    available: number;
    onTrip: number;
    inShop: number;
    utilization: number;
  };
  drivers: { totalDrivers: number };
  trips: { status: string; count: number }[];
  costs: {
    fuel: number;
    maintenance: number;
    expenses: number;
    total: number;
    liters: number;
  };
};

const VEHICLE_TYPES = ["Van", "Truck", "Bike"];
const REGIONS = ["North", "South", "East", "West"];

export default function DashboardPage() {
  const [data, setData] = useState<Kpis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState("");
  const [region, setRegion] = useState("");

  const load = () => {
    setError(null);
    api
      .get<{ data: Kpis }>("/dashboard/kpis", {
        params: { type: type || undefined, region: region || undefined },
      })
      .then((res) => setData(res.data.data))
      .catch((err) => setError(firstApiError(err, "Unable to load dashboard")));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, region]);

  const cards = data
    ? [
        {
          label: "Fleet",
          value: data.fleet.totalVehicles,
          sub: `${data.fleet.available} available`,
          icon: Truck,
          rail: "#1f8a7a",
        },
        {
          label: "Utilization",
          value: `${data.fleet.utilization}%`,
          sub: `${data.fleet.onTrip} on trip`,
          icon: Activity,
          rail: "#e8a13d",
        },
        {
          label: "Drivers",
          value: data.drivers.totalDrivers,
          sub: "registered drivers",
          icon: Users,
          rail: "#8992a0",
        },
        {
          label: "Ops cost",
          value: `Rs ${data.costs.total.toLocaleString()}`,
          sub: `${data.costs.liters} L fuel`,
          icon: IndianRupee,
          rail: "#b3651f",
        },
      ]
    : [];

  const selectCls =
    "rounded-md border border-paper-dim bg-paper-card px-3 py-2 text-sm text-graphite outline-none focus:ring-2 focus:ring-signal";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          Dashboard
        </h1>
        <p className="text-sm text-graphite-soft">
          Live operational snapshot from MySQL via Prisma aggregations.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={selectCls}
        >
          <option value="">All vehicle types</option>
          {VEHICLE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={selectCls}
        >
          <option value="">All regions</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {(type || region) && (
          <button
            onClick={() => {
              setType("");
              setRegion("");
            }}
            className="rounded-md border border-paper-dim px-3 py-2 text-sm text-graphite-soft hover:bg-paper"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && (
        <div
          className="card rail p-4 text-sm text-route"
          style={{ ["--rail-color" as string]: "#c1453a" }}
        >
          {error}
        </div>
      )}
      {!data && !error && (
        <div className="text-sm text-graphite-faint">Loading KPIs...</div>
      )}

      {data && (
        <>
          <section className="grid gap-4 md:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="card rail p-4"
                  style={{ ["--rail-color" as string]: card.rail }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-graphite-soft">{card.label}</p>
                    <Icon className="h-4 w-4 text-graphite-faint" />
                  </div>
                  <p className="font-tabular mt-3 text-2xl font-semibold text-graphite">
                    {card.value}
                  </p>
                  <p className="text-xs text-graphite-faint">{card.sub}</p>
                </div>
              );
            })}
          </section>
          <section className="grid gap-4 lg:grid-cols-2">
            <div
              className="card rail p-4"
              style={{ ["--rail-color" as string]: "#1f8a7a" }}
            >
              <h2 className="font-display text-sm font-semibold text-graphite">
                Fleet status
              </h2>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                <div
                  className="rounded-md p-3"
                  style={{ background: "#e4f3ef", color: "#146357" }}
                >
                  <p className="font-tabular text-lg font-semibold">
                    {data.fleet.available}
                  </p>
                  available
                </div>
                <div
                  className="rounded-md p-3"
                  style={{ background: "#fbedd6", color: "#8a5f14" }}
                >
                  <p className="font-tabular text-lg font-semibold">
                    {data.fleet.onTrip}
                  </p>
                  on trip
                </div>
                <div
                  className="rounded-md p-3"
                  style={{ background: "#f5e6d8", color: "#7a4315" }}
                >
                  <p className="font-tabular text-lg font-semibold">
                    {data.fleet.inShop}
                  </p>
                  in shop
                </div>
              </div>
            </div>
            <div
              className="card rail p-4"
              style={{ ["--rail-color" as string]: "#e8a13d" }}
            >
              <h2 className="font-display text-sm font-semibold text-graphite">
                Trips by status
              </h2>
              <div className="mt-4 space-y-2">
                {data.trips.map((trip) => (
                  <div
                    key={trip.status}
                    className="flex items-center justify-between rounded-md bg-paper px-3 py-2 text-sm"
                  >
                    <span className="capitalize text-graphite-soft">
                      {trip.status.replace(/_/g, " ")}
                    </span>
                    <span className="font-tabular font-semibold text-graphite">
                      {trip.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
