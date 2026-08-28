package tn.steg.backend.internships.service.impl;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.applications.entity.InternshipApplication;
import tn.steg.backend.applications.entity.ApplicationStatus;
import tn.steg.backend.applications.repository.InternshipApplicationRepository;
import tn.steg.backend.audit.annotation.Audited;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.dto.CreateInternshipRequest;
import tn.steg.backend.internships.dto.InternshipResponse;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.entity.InternshipStatus;
import tn.steg.backend.internships.repository.InternshipRepository;
import tn.steg.backend.internships.service.InternshipService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InternshipServiceImpl implements InternshipService {

    private final InternshipRepository internshipRepository;
    private final CandidateRepository candidateRepository;
    private final InternshipApplicationRepository applicationRepository;

    /**
     * Explicit internship state machine. Illegal transitions are rejected.
     */
    private static final Map<InternshipStatus, Set<InternshipStatus>> TRANSITIONS = Map.of(
            InternshipStatus.PLANNED, Set.of(InternshipStatus.ACTIVE, InternshipStatus.CANCELLED),
            InternshipStatus.ACTIVE, Set.of(InternshipStatus.COMPLETED, InternshipStatus.CANCELLED),
            InternshipStatus.COMPLETED, Set.of(InternshipStatus.ARCHIVED),
            InternshipStatus.CANCELLED, Set.of(),
            InternshipStatus.ARCHIVED, Set.of()
    );

    /** Statuses that occupy the candidate's internship calendar for overlap checks. */
    private static final Set<InternshipStatus> ACTIVE_CALENDAR_STATUSES =
            Set.of(InternshipStatus.PLANNED, InternshipStatus.ACTIVE);

    @Override
    @Transactional(readOnly = true)
    public Page<InternshipResponse> getAllInternships(InternshipStatus status, String search, Pageable pageable) {
        return internshipRepository.findAll(buildSearchSpec(status, search), pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public InternshipResponse getInternshipById(UUID id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        return toResponse(internship);
    }

    @Override
    @Transactional
    @Audited(action = "CREATE", entity = "INTERNSHIP", entityId = "#result.id", newValue = "#result")
    public InternshipResponse createInternship(CreateInternshipRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("End date must be after start date");
        }

        if (request.getApplicationId() != null) {
            InternshipApplication application = applicationRepository.findById(request.getApplicationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
            if (application.getStatus() != ApplicationStatus.ACCEPTED) {
                throw new BusinessException("An internship can only be created from an ACCEPTED application");
            }
        }

        assertNoCalendarConflict(candidate, request.getStartDate(), request.getEndDate());

        Internship internship = Internship.builder()
                .reference(generateReference())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(InternshipStatus.PLANNED)
                .candidate(candidate)
                .build();

        if (request.getApplicationId() != null) {
            InternshipApplication application = applicationRepository.findById(request.getApplicationId()).orElseThrow();
            internship.setApplication(application);
            application.setStatus(ApplicationStatus.ACCEPTED);
            applicationRepository.save(application);
        }

        return toResponse(internshipRepository.save(internship));
    }

    @Override
    @Transactional
    @Audited(action = "STATUS_CHANGE", entity = "INTERNSHIP", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public InternshipResponse updateStatus(UUID id, InternshipStatus status) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        checkTransition(internship, status);
        internship.setStatus(status);
        return toResponse(internshipRepository.save(internship));
    }

    private void assertNoCalendarConflict(Candidate candidate, LocalDate start, LocalDate end) {
        List<Internship> existing = internshipRepository
                .findByCandidateIdAndStatusIn(candidate.getId(), ACTIVE_CALENDAR_STATUSES);
        for (Internship internship : existing) {
            if (!start.isAfter(internship.getEndDate()) && !end.isBefore(internship.getStartDate())) {
                throw new BusinessException("Candidate already has an active/planned internship overlapping this period");
            }
        }
    }

    private void checkTransition(Internship internship, InternshipStatus target) {
        InternshipStatus current = internship.getStatus();
        if (current == target) {
            return;
        }
        Set<InternshipStatus> allowed = TRANSITIONS.get(current);
        if (allowed == null || !allowed.contains(target)) {
            throw new BusinessException("Illegal internship status transition: " + current + " -> " + target);
        }
    }

    private Specification<Internship> buildSearchSpec(InternshipStatus status, String search) {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class) {
                root.fetch("candidate", JoinType.INNER);
            }
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("reference")), like),
                        cb.like(cb.lower(root.get("candidate").get("firstName")), like),
                        cb.like(cb.lower(root.get("candidate").get("lastName")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String generateReference() {
        return "INT-" + System.currentTimeMillis();
    }

    private InternshipResponse toResponse(Internship i) {
        return InternshipResponse.builder()
                .id(i.getId())
                .reference(i.getReference())
                .startDate(i.getStartDate())
                .endDate(i.getEndDate())
                .status(i.getStatus())
                .candidateId(i.getCandidate().getId())
                .candidateName(i.getCandidate().getFirstName() + " " + i.getCandidate().getLastName())
                .build();
    }
}
