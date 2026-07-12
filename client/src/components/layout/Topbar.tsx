"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div>
        <p className="text-sm font-semibold text-slate-900">Operations workspace</p>
        <p className="text-xs text-slate-500">Real-time fleet, trip, maintenance and cost controls</p>
      </div>
      <div className="flex items-center gap-3">
        {user && <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{user.role.replace(/_/g, " ")}</span>}
        <button onClick={onLogout} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50" aria-label="Log out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}