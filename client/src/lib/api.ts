import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export function firstApiError(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string; errors?: { message: string }[] } | undefined;
    return payload?.errors?.[0]?.message || payload?.message || fallback;
  }
  return fallback;
}