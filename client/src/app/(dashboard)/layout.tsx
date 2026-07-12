"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) void hydrate();
  }, [isHydrated, hydrate]);

  useEffect(() => {
    if (isHydrated && !isLoading && !user) router.replace("/login");
  }, [isHydrated, isLoading, user, router]);

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading workspace...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}