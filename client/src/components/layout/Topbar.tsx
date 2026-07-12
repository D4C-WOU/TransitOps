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
    <header className="flex h-16 items-center justify-between border-b border-paper-dim bg-paper-card px-4 md:px-6">
      <div>
        <p className="font-display text-sm font-semibold text-graphite">
          Operations workspace
        </p>
        <p className="text-xs text-graphite-soft">
          Vehicles, drivers, trips, maintenance and cost — one board
        </p>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <span className="rounded-full bg-paper-dim px-3 py-1 text-xs font-medium capitalize text-graphite-soft">
            {user.role.replace(/_/g, " ")}
          </span>
        )}
        <button
          onClick={onLogout}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-paper-dim text-graphite-soft transition hover:border-route hover:text-route"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
