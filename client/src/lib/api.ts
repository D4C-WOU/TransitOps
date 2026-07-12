import axios, { type AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

export function firstApiError(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as { message?: string; errors?: { message: string }[] } | undefined;
    return payload?.errors?.[0]?.message || payload?.message || fallback;
  }
  return fallback;
}