"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CircleDollarSign,
  ClipboardList,
  Gauge,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
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
    <aside className="hidden w-64 shrink-0 bg-ink md:flex md:flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-ink-line px-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-signal font-display text-base font-bold text-ink">
          T
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-white">
            TransitOps
          </p>
          <p className="text-[11px] uppercase tracking-wide text-graphite-faint">
            Dispatch board
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-3 rounded-md py-2 pl-4 pr-3 text-sm font-medium transition",
                active
                  ? "bg-ink-soft text-white"
                  : "text-slate-400 hover:bg-ink-soft/60 hover:text-slate-200",
              )}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-signal" />
              )}
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-lg border border-ink-line bg-ink-soft p-3">
        <p className="font-tabular text-[11px] uppercase tracking-wide text-graphite-faint">
          Line status
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-transit" />
          All systems dispatched
        </p>
      </div>
    </aside>
  );
}
