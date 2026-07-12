import { api } from "./api";
import type { User } from "@/types";

export async function loginRequest(email: string, password: string) {
  const { data } = await api.post<{ user: User }>("/auth/login", { email, password });
  return data.user;
}

export async function signupRequest(name: string, email: string, password: string) {
  const { data } = await api.post<{ user: User }>("/auth/signup", { name, email, password });
  return data.user;
}

export async function meRequest() {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}
