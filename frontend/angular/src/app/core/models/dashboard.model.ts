/**
 * Aggregate counters returned by the backend /dashboard/stats endpoint.
 */
export interface DashboardStats {
  totalCandidates: number;
  totalApplications: number;
  totalInternships: number;
  activeInternships: number;
  activeAssignments: number;
  totalSupervisors: number;
  totalEmployees: number;
  pendingPayments: number;
}
