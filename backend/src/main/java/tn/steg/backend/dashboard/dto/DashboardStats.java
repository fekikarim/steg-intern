package tn.steg.backend.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

/**
 * Aggregate counters shown on the Back Office dashboard.
 */
@Getter
@Builder
public class DashboardStats {

    /** Total registered candidates. */
    private final long totalCandidates;

    /** Total internship applications received. */
    private final long totalApplications;

    /** Total internships across all states. */
    private final long totalInternships;

    /** Internships currently in the ACTIVE state. */
    private final long activeInternships;

    /** Internship assignments currently in the ACTIVE state. */
    private final long activeAssignments;

    /** Registered internship supervisors. */
    private final long totalSupervisors;

    /** Total company employees (internal staff). */
    private final long totalEmployees;

    /** Financial payments still awaiting validation/payment. */
    private final long pendingPayments;
}
