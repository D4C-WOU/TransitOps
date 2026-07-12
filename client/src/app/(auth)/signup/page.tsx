"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck, ArrowRight } from "lucide-react";
import { signupSchema, type SignupFormValues } from "@/lib/validators";
import { signupRequest } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import type { ApiErrorResponse } from "@/lib/types";
import axios from "axios";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (values: SignupFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const user = await signupRequest(
        values.name,
        values.email,
        values.password,
      );
      setUser(user);
      router.push("/dashboard");
    } catch (err) {
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        setServerError(
          err.response?.data?.message ||
            "Could not create account. Please try again.",
        );
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = (hasError?: boolean) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-signal ${
      hasError ? "border-route" : "border-paper-dim"
    }`;

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

        <div className="my-8 grid flex-1 grid-cols-2 gap-3 content-center">
          {[
            ["01", "Register", "Vehicles and drivers enter the manifest."],
            ["02", "Dispatch", "Trips assign, validate, and go live."],
            ["03", "Maintain", "Shop time is tracked, not guessed."],
            ["04", "Report", "Cost, ROI and utilization, in one view."],
          ].map(([n, title, body]) => (
            <div
              key={n}
              className="rounded-lg border border-ink-line bg-ink-soft p-3"
            >
              <p className="font-tabular text-xs text-signal">{n}</p>
              <p className="mt-1 text-sm font-medium text-white">{title}</p>
              <p className="mt-0.5 text-xs text-slate-400">{body}</p>
            </div>
          ))}
        </div>

        <p className="max-w-sm text-sm text-slate-400">
          Every account starts as a driver — the manifest stays clean, and
          admins hand out the rest.
        </p>
      </div>

      <div className="ticket-panel">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-start lg:hidden">
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-signal">
              <Truck className="h-5 w-5 text-ink" />
            </div>
            <h1 className="font-display text-xl font-semibold text-graphite">
              Create your account
            </h1>
          </div>

          <div className="ticket-form-card">
            <p className="ticket-tag mb-1 text-transit-dark">
              Boarding pass · New rider
            </p>
            <h2 className="font-display mb-1 text-xl font-semibold text-graphite">
              Join the dispatch board
            </h2>
            <p className="mb-6 text-sm text-graphite-faint">
              Creates a driver account — ask an admin for elevated roles.
            </p>

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
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-graphite"
                >
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  className={inputCls(!!errors.name)}
                  placeholder="Alex Morgan"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-route">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  className={inputCls(!!errors.email)}
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
                  autoComplete="new-password"
                  {...register("password")}
                  className={inputCls(!!errors.password)}
                  placeholder="At least 8 characters"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-route">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium text-graphite"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                  className={inputCls(!!errors.confirmPassword)}
                  placeholder="Type it again"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-route">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-ink py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating account…" : "Create account"}
                {!submitting && (
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-graphite-faint">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-signal-dark hover:text-rust"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
