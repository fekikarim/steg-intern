import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/session";
import { getMyApplications } from "@/lib/queries";
import { StatusBadge } from "@/components/status-badge";

export default async function ApplicationsPage() {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const applications = await getMyApplications();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes candidatures</h1>
          <p className="mt-1 text-muted">
            Suivez le statut de vos candidatures de stage.
          </p>
        </div>
        <Link href="/applications/new" className="btn-primary">
          Nouvelle candidature
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="card mt-8 border-dashed bg-gray-50 text-center">
          <p className="font-medium">Aucune candidature pour le moment.</p>
          <p className="mt-1 text-sm text-muted">
            Commencez une candidature pour la soumettre à la STEG.
          </p>
          <Link href="/applications/new" className="btn-primary mt-4">
            Commencer
          </Link>
        </div>
      ) : (
        <div className="card mt-8 overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="text-muted">
                <th className="px-4 py-3 font-medium">Référence</th>
                <th className="px-4 py-3 font-medium">Date de soumission</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Nouvelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-4 py-3 font-medium">{app.reference}</td>
                  <td className="px-4 py-3 text-muted">
                    {app.submissionDate ?? "Brouillon"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-4 py-3">
                    <Link href="/applications/new" className="text-steg hover:underline">
                      Nouvelle candidature
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
