"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colorsFor } from "@/lib/statusColors";

type Row = { status: string; count: number };

export default function TripsStatusChart({ data }: { data: Row[] }) {
  const chartData = data.map((row) => ({
    ...row,
    label: row.status.replace(/_/g, " "),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
      >
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#8992a0" }}
          axisLine={{ stroke: "#e4e0d4" }}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#8992a0" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(16,25,43,0.04)" }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e4e0d4",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {chartData.map((row) => (
            <Cell key={row.status} fill={colorsFor(row.status).dot} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
