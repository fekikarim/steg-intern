import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { getCandidateProfile } from "@/lib/queries";

export default async function ProfilePage() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const candidate = await getCandidateProfile();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Mon profil</h1>
      <p className="mt-1 text-muted">
        Vos informations personnelles et universitaires.
      </p>

      {candidate ? (
        <div className="card mt-8">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted">Prénom</dt>
              <dd className="font-medium">{candidate.firstName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Nom</dt>
              <dd className="font-medium">{candidate.lastName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Email</dt>
              <dd className="font-medium">{candidate.contactEmail}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Téléphone</dt>
              <dd className="font-medium">{candidate.phone ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Adresse</dt>
              <dd className="font-medium">{candidate.address ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">N° carte nationale</dt>
              <dd className="font-medium">{candidate.nationalId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Université</dt>
              <dd className="font-medium">{candidate.university ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Spécialité</dt>
              <dd className="font-medium">{candidate.speciality ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Diplôme</dt>
              <dd className="font-medium">{candidate.diploma ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Compétences</dt>
              <dd className="font-medium">{candidate.skills ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Langues</dt>
              <dd className="font-medium">{candidate.languages ?? "—"}</dd>
            </div>
          </dl>
          <div className="mt-6 flex gap-3">
            <Link href="/applications/new" className="btn-primary">
              Nouvelle candidature
            </Link>
          </div>
        </div>
      ) : (
        <p className="mt-8 text-muted">Impossible de charger votre profil.</p>
      )}
    </div>
  );
}
