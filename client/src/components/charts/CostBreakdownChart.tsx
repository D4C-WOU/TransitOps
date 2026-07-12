"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type Props = { fuel: number; maintenance: number; expenses: number };

const COLORS = ["#e8a13d", "#b3651f", "#1f8a7a"];

export default function CostBreakdownChart({
  fuel,
  maintenance,
  expenses,
}: Props) {
  const data = [
    { name: "Fuel", value: fuel },
    { name: "Maintenance", value: maintenance },
    { name: "Other expenses", value: expenses },
  ];
  const total = fuel + maintenance + expenses;

  if (total === 0) {
    return (
      <div className="grid h-[220px] place-items-center text-sm text-graphite-faint">
        No cost data logged yet.
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={entry.name} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [
              `Rs ${Number(value ?? 0).toLocaleString()}`,
              String(name),
            ]}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #e4e0d4",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="font-tabular text-lg font-semibold text-graphite">
            Rs {total.toLocaleString()}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-graphite-faint">
            total cost
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap justify-center gap-3 text-xs text-graphite-soft">
        {data.map((entry, i) => (
          <span key={entry.name} className="inline-flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: COLORS[i] }}
            />
            {entry.name}
          </span>
        ))}
      </div>
    </div>
  );
}
