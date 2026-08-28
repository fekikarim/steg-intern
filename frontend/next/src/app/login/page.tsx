"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { ok: false };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="mt-1 text-sm text-muted">
          Accédez à votre espace candidat STEG.
        </p>

        {state.message && (
          <div
            className={`mt-4 rounded-md border px-4 py-3 text-sm ${
              state.ok
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {state.message}
          </div>
        )}

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="label">
              Adresse email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input"
            />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
            />
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="text-steg hover:underline">
            Mot de passe oublié ?
          </Link>
          <Link href="/register" className="text-steg hover:underline">
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}
