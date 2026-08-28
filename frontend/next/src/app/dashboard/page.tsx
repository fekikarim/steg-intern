import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { getCandidateProfile, getMyApplications } from "@/lib/queries";
import { StatusBadge } from "@/components/status-badge";

export default async function DashboardPage() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const [candidate, applications] = await Promise.all([
    getCandidateProfile(),
    getMyApplications(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">
        Bonjour {candidate?.firstName ?? ""} {candidate?.lastName ?? ""}
      </h1>
      <p className="mt-1 text-muted">
        Bienvenue sur votre espace candidat. Gérez votre profil et vos candidatures.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-1">
          <h2 className="text-lg font-semibold">Mon profil</h2>
          {candidate ? (
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted">Nom complet</dt>
                <dd className="font-medium">
                  {candidate.firstName} {candidate.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium">{candidate.contactEmail}</dd>
              </div>
              <div>
                <dt className="text-muted">Téléphone</dt>
                <dd className="font-medium">{candidate.phone ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Université</dt>
                <dd className="font-medium">{candidate.university ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Spécialité</dt>
                <dd className="font-medium">{candidate.speciality ?? "—"}</dd>
              </div>
            </dl>
          ) : (
            <p className="mt-4 text-sm text-muted">Impossible de charger le profil.</p>
          )}
          <Link href="/profile" className="btn-outline mt-6">
            Voir mon profil
          </Link>
        </div>

        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Mes candidatures</h2>
            <Link href="/applications/new" className="btn-primary">
              Nouvelle candidature
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="mt-6 rounded-md border border-dashed border-border bg-gray-50 p-8 text-center">
              <p className="font-medium">Aucune candidature</p>
              <p className="mt-1 text-sm text-muted">
                Soumettez une candidature pour débuter votre parcours.
              </p>
              <Link href="/applications/new" className="btn-primary mt-4">
                Commencer
              </Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-border">
              {applications.map((app) => (
                <li key={app.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{app.reference}</p>
                    <p className="text-sm text-muted">
                      {app.submissionDate ?? "Non soumise"} ·{" "}
                      {app.submittedOnline ? "En ligne" : "Manuelle"}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
