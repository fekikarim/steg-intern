import type { ApplicationStatus } from "@/lib/types";

const styles: Record<ApplicationStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const labels: Record<ApplicationStatus, string> = {
  DRAFT: "Brouillon",
  SUBMITTED: "Soumise",
  UNDER_REVIEW: "En cours d'examen",
  ACCEPTED: "Acceptée",
  REJECTED: "Rejetée",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`badge ${styles[status] ?? styles.DRAFT}`}>{labels[status] ?? status}</span>;
}
