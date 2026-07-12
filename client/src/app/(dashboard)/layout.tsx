"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Topbar from "@/components/layout/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [isHydrated, hydrate]);

  useEffect(() => {
    // Belt-and-suspenders: middleware.ts already redirects on missing cookie,
    // this catches the case where the cookie exists but the session/user
    // turned out to be invalid (e.g. deactivated account) once we ask the API.
    if (isHydrated && !isLoading && !user) {
      router.replace("/login");
    }
  }, [isHydrated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1 p-6 bg-slate-50">{children}</main>
    </div>
  );
}
