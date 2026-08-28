"use server";

import { redirect } from "next/navigation";
import { setSession, clearSession } from "../session";
import type { AuthResponse, RegisterPayload } from "../types";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:8080/api/v1";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = data as { message?: string; fieldErrors?: Record<string, string> };
    throw new Error(err.message ?? `Request failed (${res.status})`);
  }
  return data as T;
}

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  try {
    const auth = await postJson<AuthResponse>("/auth/login", { email, password });
    await setSession(auth.accessToken, auth.refreshToken);
    redirect("/dashboard");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unable to sign in.";
    return { ok: false, message };
  }
}

export async function register(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const payload: RegisterPayload = {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
    firstName: String(formData.get("firstName") ?? "").trim(),
    lastName: String(formData.get("lastName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim() || undefined,
    university: String(formData.get("university") ?? "").trim() || undefined,
    speciality: String(formData.get("speciality") ?? "").trim() || undefined,
  };

  if (!payload.email || !payload.password || !payload.firstName || !payload.lastName) {
    return { ok: false, message: "Please fill in all required fields." };
  }

  try {
    await postJson<{ id: string }>("/auth/register", payload);
    const auth = await postJson<AuthResponse>("/auth/login", {
      email: payload.email,
      password: payload.password,
    });
    await setSession(auth.accessToken, auth.refreshToken);
    redirect("/dashboard");
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed.";
    return { ok: false, message };
  }
}

export async function logout(): Promise<void> {
  await clearSession();
  redirect("/");
}

export async function requestPasswordReset(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    return { ok: false, message: "Email is required." };
  }
  try {
    await postJson("/auth/forgot-password", { email });
    return {
      ok: true,
      message: "If that email exists, a reset link has been sent.",
    };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Request failed." };
  }
}
