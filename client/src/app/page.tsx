"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// "/" had its own full copy of the dashboard, unguarded by the
// (dashboard) layout's auth check — that's how a stale session could
// land here and just print a raw API error. Collapse it into a single
// redirect; the real dashboard lives at /dashboard behind the auth guard.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center bg-paper text-sm text-graphite-faint">
      Redirecting to dashboard...
    </div>
  );
}
