"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Truck } from "lucide-react";
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
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

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
    `w-full rounded-lg border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-signal ${
      hasError ? "border-route" : "border-paper-dim"
    }`;

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-signal">
            <Truck className="h-6 w-6 text-ink" />
          </div>
          <h1 className="font-display text-xl font-semibold text-white">
            Create your account
          </h1>
          <p className="mt-1 text-center text-sm text-graphite-faint">
            Get on the dispatch board as a driver
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
              <p className="mt-1 text-xs text-route">{errors.name.message}</p>
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
            className="w-full rounded-lg bg-signal py-2.5 text-sm font-semibold text-ink transition hover:bg-signal-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-graphite-faint">
          This creates a{" "}
          <span className="font-medium text-slate-300">driver</span> account.
          Need Fleet Manager, Safety Officer, or Financial Analyst access? Ask
          an admin to set that up for you.
        </p>
        <p className="mt-3 text-center text-sm text-graphite-faint">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-signal hover:text-signal-dark"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
