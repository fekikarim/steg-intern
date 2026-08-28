"use client";

const ACCESS_COOKIE = "steg_fo_access";

function getAccessToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${ACCESS_COOKIE}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

export class ApiClientError extends Error {
  status: number;
  code: string;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, code: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export class ApiClient {
  private readonly base: string;

  constructor(base = "/api") {
    this.base = base;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");
    const token = getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(`${this.base}${path}`, { ...init, headers });

    if (res.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login?expired=1";
      }
      throw new ApiClientError("Session expired", 401, "UNAUTHORIZED");
    }

    if (!res.ok) {
      let message = `Request failed (${res.status})`;
      let code = "UNKNOWN";
      let fieldErrors: Record<string, string> | undefined;
      try {
        const body = (await res.json()) as {
          message?: string;
          code?: string;
          fieldErrors?: Record<string, string>;
        };
        message = body.message ?? message;
        code = body.code ?? code;
        fieldErrors = body.fieldErrors;
      } catch {
        // ignore non-JSON errors
      }
      throw new ApiClientError(message, res.status, code, fieldErrors);
    }

    if (res.status === 204) {
      return undefined as T;
    }
    return (await res.json()) as T;
  }

  get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>(path, { ...init, method: "GET" });
  }

  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>(path, {
      ...init,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }
}

export const api = new ApiClient();
