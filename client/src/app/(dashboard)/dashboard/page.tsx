"use client";

import { useEffect, useState } from "react";
import { Activity, IndianRupee, Truck, Users } from "lucide-react";
import { api, firstApiError } from "@/lib/api";

type Kpis = {
  fleet: { totalVehicles: number; available: number; onTrip: number; inShop: number; utilization: number };
  drivers: { totalDrivers: number };
  trips: { status: string; count: number }[];
  costs: { fuel: number; maintenance: number; expenses: number; total: number; liters: number };
};

export default function DashboardPage() {
  const [data, setData] = useState<Kpis | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get<{ data: Kpis }>("/dashboard/kpis").then((res) => setData(res.data.data)).catch((err) => setError(firstApiError(err, "Unable to load dashboard")));
  }, []);

  if (error) return <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!data) return <div className="text-sm text-slate-500">Loading KPIs...</div>;

  const cards = [
    { label: "Fleet", value: data.fleet.totalVehicles, sub: `${data.fleet.available} available`, icon: Truck },
    { label: "Utilization", value: `${data.fleet.utilization}%`, sub: `${data.fleet.onTrip} on trip`, icon: Activity },
    { label: "Drivers", value: data.drivers.totalDrivers, sub: "registered drivers", icon: Users },
    { label: "Ops cost", value: `Rs ${data.costs.total.toLocaleString()}`, sub: `${data.costs.liters} L fuel`, icon: IndianRupee },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Dashboard</h1>
        <p className="text-sm text-slate-500">Live operational snapshot from MySQL via Prisma aggregations.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return <div key={card.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm text-slate-500">{card.label}</p><Icon className="h-4 w-4 text-slate-400" /></div><p className="mt-3 text-2xl font-semibold text-slate-950">{card.value}</p><p className="text-xs text-slate-500">{card.sub}</p></div>;
        })}
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-sm font-semibold text-slate-900">Fleet status</h2><div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm"><div className="rounded-md bg-emerald-50 p-3 text-emerald-700">{data.fleet.available}<br />available</div><div className="rounded-md bg-blue-50 p-3 text-blue-700">{data.fleet.onTrip}<br />on trip</div><div className="rounded-md bg-amber-50 p-3 text-amber-700">{data.fleet.inShop}<br />in shop</div></div></div>
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-sm font-semibold text-slate-900">Trips by status</h2><div className="mt-4 space-y-2">{data.trips.map((trip) => <div key={trip.status} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 text-sm"><span>{trip.status.replace(/_/g, " ")}</span><span className="font-semibold">{trip.count}</span></div>)}</div></div>
      </section>
    </div>
  );
}