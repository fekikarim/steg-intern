"use client";

import { useEffect, useState } from "react";
import { api, ApiClientError } from "@/lib/client-api";
import type { Application, CandidateProfile } from "@/lib/types";

type Step = "info" | "review" | "done";

export default function NewApplicationPage() {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [step, setStep] = useState<Step>("info");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Application | null>(null);

  useEffect(() => {
    api
      .get<CandidateProfile>("/candidates/me")
      .then(setCandidate)
      .catch((e) => setError(e instanceof Error ? e.message : "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  async function createAndSubmit() {
    setCreating(true);
    setError(null);
    try {
      const draft = await api.post<Application>("/applications", { submittedOnline: true });
      const submitted = await api.patch<Application>(`/applications/${draft.id}/submit`);
      setCreated(submitted);
      setStep("done");
    } catch (e) {
      if (e instanceof ApiClientError) {
        setError(e.message);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-muted">
        Chargement...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Nouvelle candidature</h1>
      <p className="mt-1 text-muted">
        Suivez les étapes pour soumettre votre candidature de stage.
      </p>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {step !== "done" && (
        <ol className="mt-8 flex items-center gap-2 text-sm">
          {["Informations", "Vérification", "Soumission"].map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step === (["info", "review", "done"] as Step[])[i]
                    ? "bg-steg text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {i + 1}
              </span>
              <span className={step === (["info", "review", "done"] as Step[])[i] ? "font-medium" : "text-muted"}>
                {label}
              </span>
              {i < 2 && <span className="mx-2 h-px w-6 bg-border" />}
            </li>
          ))}
        </ol>
      )}

      <div className="card mt-6">
        {!candidate ? (
          <p className="text-muted">Impossible de charger vos informations.</p>
        ) : step === "info" ? (
          <>
            <h2 className="text-lg font-semibold">Vos informations</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted">Nom complet</dt>
                <dd className="font-medium">
                  {candidate.firstName} {candidate.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Email</dt>
                <dd className="font-medium">{candidate.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Université</dt>
                <dd className="font-medium">{candidate.university ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Spécialité</dt>
                <dd className="font-medium">{candidate.speciality ?? "—"}</dd>
              </div>
            </dl>
            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep("review")} className="btn-primary">
                Continuer
              </button>
            </div>
          </>
        ) : step === "review" ? (
          <>
            <h2 className="text-lg font-semibold">Vérifiez vos informations</h2>
            <p className="mt-2 text-sm text-muted">
              En soumettant, vous déclarez que les informations ci-dessus sont exactes.
            </p>
            <div className="mt-6 flex justify-between gap-3">
              <button onClick={() => setStep("info")} className="btn-outline">
                Retour
              </button>
              <button onClick={createAndSubmit} disabled={creating} className="btn-primary">
                {creating ? "Soumission..." : "Soumettre ma candidature"}
              </button>
            </div>
          </>
        ) : created ? (
          <>
            <h2 className="text-lg font-semibold text-green-700">Candidature soumise !</h2>
            <p className="mt-2">
              Référence de la candidature :{" "}
              <span className="font-semibold">{created.reference}</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Statut actuel : soumise. Vous serez notifié de son avancement.
            </p>
            <a href="/applications" className="btn-outline mt-6">
              Voir mes candidatures
            </a>
          </>
        ) : null}
      </div>
    </div>
  );
}
