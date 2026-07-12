"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircleDollarSign, ClipboardList, Gauge, Menu, ShieldCheck, Truck, Users } from "lucide-react";
import clsx from "clsx";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/vehicles", label: "Vehicles", icon: Truck },
  { href: "/drivers", label: "Drivers", icon: Users },
  { href: "/trips", label: "Trips", icon: ClipboardList },
  { href: "/maintenance", label: "Maintenance", icon: ShieldCheck },
  { href: "/fuel-expenses", label: "Fuel & costs", icon: CircleDollarSign },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white md:block">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-900 text-white"><Menu className="h-4 w-4" /></div>
        <div>
          <p className="text-sm font-semibold text-slate-900">TransitOps</p>
          <p className="text-xs text-slate-500">Fleet command</p>
        </div>
      </div>
      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={clsx("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", active ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950")}>
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}