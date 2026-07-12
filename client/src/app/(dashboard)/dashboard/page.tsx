"use client";

import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="text-slate-500 mt-1">
        Signed in as {user?.name} ({user?.role.replace("_", " ")}).
      </p>
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-sm">
        KPI cards, fleet status, and charts land here in Phase 8 (Dashboard).
      </div>
    </div>
  );
}
