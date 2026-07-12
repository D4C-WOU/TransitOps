"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, ArrowRight } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { loginRequest } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import type { ApiErrorResponse } from "@/lib/types";
import axios from "axios";

const ROUTE_D =
  "M 20 340 C 90 340, 90 260, 160 260 S 230 160, 300 160 S 340 60, 380 40";

function RouteLine() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      {/* fill="none" set directly as an SVG attribute, not just via CSS
          class — an unfilled bezier still renders as a solid black
          shape if the stylesheet hasn't applied yet, since SVG's
          default fill is black. */}
      <path d={ROUTE_D} className="route-track" fill="none" />
      <path
        id="route-path-login"
        d={ROUTE_D}
        className="route-line"
        fill="none"
      />

      {[
        [20, 340],
        [160, 260],
        [300, 160],
        [380, 40],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={4}
          fill="var(--color-paper)"
          opacity={0.5}
        />
      ))}

      {/* SMIL animateMotion — broadly supported, no offset-path fallback
          issues, no risk of a filled shape if CSS lags. */}
      <circle r={5} fill="var(--color-signal)" className="route-dot-glow">
        <animateMotion dur="6s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-path-login" />
        </animateMotion>
      </circle>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const user = await loginRequest(values.email, values.password);
      setUser(user);
      router.push(searchParams.get("redirectTo") || "/dashboard");
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setServerError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ticket-shell">
      <div className="ticket-stub p-10">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-signal">
            <Truck className="h-5 w-5 text-ink" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">TransitOps</p>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Dispatch board
            </p>
          </div>
        </div>

        <div className="relative -mx-6 my-8 flex-1">
          <RouteLine />
        </div>

        <div className="space-y-1">
          <p className="ticket-tag text-signal">Route 04 · Active</p>
          <p className="font-display text-2xl font-medium leading-snug">
            Every trip, vehicle, and license — <br /> tracked on one board.
          </p>
          <p className="max-w-sm text-sm text-slate-400">
            Fleet managers, drivers, safety officers and analysts all sign in
            here to run the same manifest.
          </p>
        </div>
      </div>

      <div className="ticket-panel">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-start lg:hidden">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-signal">
              <Truck className="h-5 w-5 text-ink" />
            </div>
            <h1 className="font-display text-xl font-semibold text-graphite">
              TransitOps
            </h1>
          </div>

          <div className="ticket-form-card">
            <p className="ticket-tag mb-1 text-transit-dark">
              Boarding pass · Sign in
            </p>
            <h2 className="font-display mb-6 text-xl font-semibold text-graphite">
              Welcome back
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {serverError && (
                <div
                  className="rail rounded-md p-3 text-sm"
                  style={{
                    ["--rail-color" as string]: "#c1453a",
                    background: "#f8e2df",
                    color: "#8f2c24",
                  }}
                >
                  {serverError}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-graphite"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-signal ${
                    errors.email ? "border-route" : "border-paper-dim"
                  }`}
                  placeholder="you@transitops.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-route">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-graphite"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-signal ${
                    errors.password ? "border-route" : "border-paper-dim"
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-route">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign in"}
                {!submitting && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-graphite-faint">
            New driver?{" "}
            <Link
              href="/signup"
              className="font-medium text-signal-dark hover:text-rust"
            >
              Create an account
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-graphite-faint">
            Fleet Manager, Safety Officer or Financial Analyst access is
            provisioned by an administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
