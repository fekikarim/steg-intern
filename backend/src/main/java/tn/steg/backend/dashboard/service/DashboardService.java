package tn.steg.backend.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.applications.repository.InternshipApplicationRepository;
import tn.steg.backend.assignments.entity.AssignmentStatus;
import tn.steg.backend.assignments.repository.InternshipAssignmentRepository;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.dashboard.dto.DashboardStats;
import tn.steg.backend.departments.repository.EmployeeRepository;
import tn.steg.backend.departments.repository.SupervisorRepository;
import tn.steg.backend.finance.entity.PaymentStatus;
import tn.steg.backend.finance.repository.PaymentRepository;
import tn.steg.backend.internships.entity.InternshipStatus;
import tn.steg.backend.internships.repository.InternshipRepository;

/**
 * Aggregates lightweight counters for the dashboard. Read-only.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CandidateRepository candidateRepository;
    private final InternshipApplicationRepository applicationRepository;
    private final InternshipRepository internshipRepository;
    private final InternshipAssignmentRepository assignmentRepository;
    private final SupervisorRepository supervisorRepository;
    private final EmployeeRepository employeeRepository;
    private final PaymentRepository paymentRepository;

    @Transactional(readOnly = true)
    public DashboardStats getStats() {
        return DashboardStats.builder()
                .totalCandidates(candidateRepository.count())
                .totalApplications(applicationRepository.count())
                .totalInternships(internshipRepository.count())
                .activeInternships(internshipRepository.countByStatus(InternshipStatus.ACTIVE))
                .activeAssignments(assignmentRepository.countByStatus(AssignmentStatus.ACTIVE))
                .totalSupervisors(supervisorRepository.count())
                .totalEmployees(employeeRepository.count())
                .pendingPayments(paymentRepository.countByStatus(PaymentStatus.PENDING))
                .build();
    }
}
