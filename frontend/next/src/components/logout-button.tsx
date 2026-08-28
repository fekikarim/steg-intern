"use client";

import { useTransition } from "react";
import { logout } from "@/lib/actions/auth";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => { await logout(); })}
      disabled={pending}
      className="text-sm font-medium text-muted transition hover:text-steg disabled:opacity-50"
    >
      {children} · Déconnexion
    </button>
  );
}
