import "server-only";
import { getAccessToken } from "./session";
import type { Application, CandidateProfile } from "./types";

const BASE = process.env.BACKEND_API_URL ?? "http://localhost:8080/api/v1";

async function authFetch<T>(path: string): Promise<T> {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("unauthenticated");
  }
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export async function getCandidateProfile(): Promise<CandidateProfile | null> {
  try {
    return await authFetch<CandidateProfile>("/candidates/me");
  } catch {
    return null;
  }
}

export async function getMyApplications(): Promise<Application[]> {
  try {
    return await authFetch<Application[]>("/applications/mine");
  } catch {
    return [];
  }
}
