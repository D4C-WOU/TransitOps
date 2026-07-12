"use client";

import { useEffect, useState } from "react";
import { Activity, IndianRupee, Truck, Users } from "lucide-react";
import { api, firstApiError } from "@/lib/api";
import TripsStatusChart from "@/components/charts/TripsStatusChart";
import CostBreakdownChart from "@/components/charts/CostBreakdownChart";

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

export default function DashboardPage() {
  const [data, setData] = useState<Kpis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ data: Kpis }>("/dashboard/kpis")
      .then((res) => setData(res.data.data))
      .catch((err) => setError(firstApiError(err, "Unable to load dashboard")));
  }, []);

  if (error)
    return (
      <div
        className="card rail border-route p-4 text-sm text-route"
        style={{ ["--rail-color" as string]: "#c1453a" }}
      >
        {error}
      </div>
    );
  if (!data)
    return (
      <div className="text-sm text-graphite-faint">Loading dispatch board…</div>
    );

  const cards = [
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-graphite">
          Dashboard
        </h1>
        <p className="text-sm text-graphite-soft">
          Live snapshot pulled straight off the fleet, trip and cost tables.
        </p>
      </div>

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
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold text-graphite">
              Fleet status
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center text-sm">
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
          <h2 className="mb-3 font-display text-sm font-semibold text-graphite">
            Trips by status
          </h2>
          <TripsStatusChart data={data.trips} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div
          className="card rail p-4"
          style={{ ["--rail-color" as string]: "#b3651f" }}
        >
          <h2 className="mb-1 font-display text-sm font-semibold text-graphite">
            Operational cost split
          </h2>
          <p className="mb-2 text-xs text-graphite-faint">
            Fuel, maintenance and other logged expenses.
          </p>
          <CostBreakdownChart
            fuel={data.costs.fuel}
            maintenance={data.costs.maintenance}
            expenses={data.costs.expenses}
          />
        </div>
        <div
          className="card rail p-4"
          style={{ ["--rail-color" as string]: "#8992a0" }}
        >
          <h2 className="mb-3 font-display text-sm font-semibold text-graphite">
            Trips, in numbers
          </h2>
          <div className="space-y-2">
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
    </div>
  );
}
