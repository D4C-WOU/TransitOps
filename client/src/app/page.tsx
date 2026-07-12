import { redirect } from "next/navigation";

// Root route just forwards to the dashboard; middleware.ts will bounce
// unauthenticated users to /login before this ever renders.
export default function RootPage() {
  redirect("/dashboard");
}
