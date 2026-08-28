package tn.steg.backend.applications.service.impl;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.applications.dto.ApplicationResponse;
import tn.steg.backend.applications.dto.CreateApplicationRequest;
import tn.steg.backend.applications.entity.ApplicationStatus;
import tn.steg.backend.applications.entity.InternshipApplication;
import tn.steg.backend.applications.repository.InternshipApplicationRepository;
import tn.steg.backend.applications.service.ApplicationService;
import tn.steg.backend.audit.annotation.Audited;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final InternshipApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;

    /**
     * Explicit application state machine. Each key lists the only legal target
     * states reachable from it. Illegal transitions are rejected by the backend.
     */
    private static final Map<ApplicationStatus, Set<ApplicationStatus>> TRANSITIONS = Map.of(
            ApplicationStatus.DRAFT, Set.of(ApplicationStatus.SUBMITTED, ApplicationStatus.REJECTED),
            ApplicationStatus.SUBMITTED, Set.of(ApplicationStatus.UNDER_REVIEW, ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED),
            ApplicationStatus.UNDER_REVIEW, Set.of(ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED),
            ApplicationStatus.ACCEPTED, Set.of(),
            ApplicationStatus.REJECTED, Set.of()
    );

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getAllApplications(ApplicationStatus status, String search, Pageable pageable) {
        return applicationRepository.findAll(buildSearchSpec(status, search), pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(UUID id) {
        InternshipApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return toResponse(app);
    }

    @Override
    @Transactional
    @Audited(action = "CREATE", entity = "APPLICATION", entityId = "#result.id", newValue = "#result")
    public ApplicationResponse createApplication(CreateApplicationRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        boolean submittedOnline = request.getSubmittedOnline() != null && request.getSubmittedOnline();

        InternshipApplication application = InternshipApplication.builder()
                .reference(generateReference())
                .status(ApplicationStatus.DRAFT)
                .submittedOnline(submittedOnline)
                .candidate(candidate)
                .build();

        return toResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional
    @Audited(action = "SUBMIT", entity = "APPLICATION", entityId = "#args[0]", newValue = "#result")
    public ApplicationResponse submitApplication(UUID id) {
        InternshipApplication app = findById(id);
        checkTransition(app, ApplicationStatus.SUBMITTED); // DRAFT -> SUBMITTED
        app.setStatus(ApplicationStatus.SUBMITTED);
        app.setSubmissionDate(LocalDate.now());
        return toResponse(applicationRepository.save(app));
    }

    @Override
    @Transactional
    @Audited(action = "ACCEPT", entity = "APPLICATION", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public ApplicationResponse acceptApplication(UUID id) {
        InternshipApplication app = findById(id);
        checkTransition(app, ApplicationStatus.ACCEPTED); // SUBMITTED|UNDER_REVIEW -> ACCEPTED
        app.setStatus(ApplicationStatus.ACCEPTED);
        if (app.getSubmissionDate() == null) {
            app.setSubmissionDate(LocalDate.now());
        }
        return toResponse(applicationRepository.save(app));
    }

    @Override
    @Transactional
    @Audited(action = "REJECT", entity = "APPLICATION", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public ApplicationResponse rejectApplication(UUID id) {
        InternshipApplication app = findById(id);
        checkTransition(app, ApplicationStatus.REJECTED); // DRAFT|SUBMITTED|UNDER_REVIEW -> REJECTED
        app.setStatus(ApplicationStatus.REJECTED);
        return toResponse(applicationRepository.save(app));
    }

    @Override
    @Transactional
    @Audited(action = "STATUS_CHANGE", entity = "APPLICATION", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public ApplicationResponse updateStatus(UUID id, ApplicationStatus status) {
        InternshipApplication app = findById(id);
        checkTransition(app, status);
        app.setStatus(status);
        return toResponse(applicationRepository.save(app));
    }

    private InternshipApplication findById(UUID id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    private void checkTransition(InternshipApplication app, ApplicationStatus target) {
        ApplicationStatus current = app.getStatus();
        if (current == target) {
            return;
        }
        Set<ApplicationStatus> allowed = TRANSITIONS.get(current);
        if (allowed == null || !allowed.contains(target)) {
            throw new BusinessException("Illegal application status transition: " + current + " -> " + target);
        }
    }

    private Specification<InternshipApplication> buildSearchSpec(ApplicationStatus status, String search) {
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
                        cb.like(cb.lower(root.get("candidate").get("lastName")), like),
                        cb.like(cb.lower(root.get("candidate").get("contactEmail")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String generateReference() {
        return "APP-" + System.currentTimeMillis();
    }

    private ApplicationResponse toResponse(InternshipApplication a) {
        return ApplicationResponse.builder()
                .id(a.getId())
                .reference(a.getReference())
                .status(a.getStatus())
                .submittedOnline(a.getSubmittedOnline())
                .submissionDate(a.getSubmissionDate())
                .candidateId(a.getCandidate().getId())
                .candidateName(a.getCandidate().getFirstName() + " " + a.getCandidate().getLastName())
                .build();
    }
}
