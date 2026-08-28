"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/lib/actions/auth";
import type { ActionState } from "@/lib/actions/auth";

const initialState: ActionState = { ok: false };

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(register, initialState);

  return (
    <div className="mx-auto flex max-w-lg flex-col justify-center px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold">Créer mon compte candidat</h1>
        <p className="mt-1 text-sm text-muted">
          Inscrivez-vous pour soumettre votre candidature de stage.
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="label">
                Prénom *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="label">
                Nom *
              </label>
              <input id="lastName" name="lastName" type="text" required className="input" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="label">
              Adresse email *
            </label>
            <input id="email" name="email" type="email" required className="input" />
          </div>
          <div>
            <label htmlFor="password" className="label">
              Mot de passe *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              className="input"
            />
            <p className="mt-1 text-xs text-muted">
              Au moins 8 caractères, une majuscule et un chiffre.
            </p>
          </div>
          <div>
            <label htmlFor="phone" className="label">
              Téléphone
            </label>
            <input id="phone" name="phone" type="tel" className="input" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="university" className="label">
                Université
              </label>
              <input id="university" name="university" type="text" className="input" />
            </div>
            <div>
              <label htmlFor="speciality" className="label">
                Spécialité
              </label>
              <input id="speciality" name="speciality" type="text" className="input" />
            </div>
          </div>
          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Inscription..." : "Créer mon compte"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-steg hover:underline">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
}
