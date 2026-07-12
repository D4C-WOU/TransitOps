"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck } from "lucide-react";
import { loginSchema, type LoginFormValues } from "@/lib/validators";
import { loginRequest } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import type { ApiErrorResponse } from "@/lib/types";
import axios from "axios";

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
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    setSubmitting(true);
    try {
      const user = await loginRequest(values.email, values.password);
      setUser(user);
      const redirectTo = searchParams.get("redirectTo") || "/dashboard";
      router.push(redirectTo);
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
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-signal">
            <Truck className="h-6 w-6 text-ink" />
          </div>
          <h1 className="font-display text-xl font-semibold text-white">
            TransitOps
          </h1>
          <p className="mt-1 text-sm text-graphite-faint">
            Sign in to the dispatch board
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="card space-y-4 p-6"
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
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-signal ${
                errors.email ? "border-route" : "border-paper-dim"
              }`}
              placeholder="you@transitops.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-route">{errors.email.message}</p>
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
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-signal ${
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
            className="w-full rounded-lg bg-signal py-2.5 text-sm font-semibold text-ink transition hover:bg-signal-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-graphite-faint">
          New driver?{" "}
          <Link
            href="/signup"
            className="font-medium text-signal hover:text-signal-dark"
          >
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-graphite-faint">
          Fleet Manager, Safety Officer or Financial Analyst access is
          provisioned by an administrator.
        </p>
      </div>
    </main>
  );
}
