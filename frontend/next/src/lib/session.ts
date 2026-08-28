import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import type { UserProfile } from "./types";

export const ACCESS_COOKIE = "steg_fo_access";
export const REFRESH_COOKIE = "steg_fo_refresh";

export async function setSession(accessToken: string, refreshToken: string): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  store.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}

export async function getAccessToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return Boolean(store.get(ACCESS_COOKIE)?.value);
}

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const token = await getAccessToken();
  if (!token) {
    return null;
  }
  try {
    const base = process.env.BACKEND_API_URL ?? "http://localhost:8080/api/v1";
    const res = await fetch(`${base}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return (await res.json()) as UserProfile;
  } catch {
    return null;
  }
});
