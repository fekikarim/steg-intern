"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { ok: false };

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialState);

  return (
    <div className="mx-auto flex max-w-md flex-col justify-center px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-muted">
          Saisissez votre email pour recevoir un lien de réinitialisation.
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
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Envoi..." : "Envoyer le lien"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          <Link href="/login" className="text-steg hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
