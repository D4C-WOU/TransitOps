"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) void hydrate();
  }, [isHydrated, hydrate]);

  // Redirect belongs in an effect, not render — calling router.replace()
  // while DashboardLayout is rendering trips React's "setState during
  // render of a different component" warning and can drop the navigation.
  useEffect(() => {
    if (isHydrated && !user) {
      router.replace("/login");
    }
  }, [isHydrated, user, router]);

  if (!isHydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper text-sm text-graphite-faint">
        Loading workspace...
      </div>
    );
  }

  if (!user) {
    // Effect above will redirect; render nothing in the meantime.
    return null;
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
