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
import tn.steg.backend.candidates.dto.CreateCandidateRequest;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.realtime.RealtimeEvent;
import tn.steg.backend.realtime.RealtimeService;
import tn.steg.backend.security.CurrentUserService;
import tn.steg.backend.users.entity.User;

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
    private final CurrentUserService currentUserService;
    private final RealtimeService realtimeService;

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
        assertCandidateOwnership(id);
        InternshipApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return toResponse(app);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications() {
        Candidate self = currentCandidateIfSelf();
        if (self == null) {
            throw new BusinessException("Only candidates can list their own applications");
        }
        return applicationRepository.findByCandidateId(self.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    @Audited(action = "CREATE", entity = "APPLICATION", entityId = "#result.id", newValue = "#result")
    public ApplicationResponse createApplication(CreateApplicationRequest request) {
        Candidate candidate = resolveCandidateForCurrentUser(request);

        boolean submittedOnline = request.getSubmittedOnline() != null && request.getSubmittedOnline();

        InternshipApplication application = InternshipApplication.builder()
                .reference(generateReference())
                .status(ApplicationStatus.DRAFT)
                .submittedOnline(submittedOnline)
                .candidate(candidate)
                .build();

        InternshipApplication saved = applicationRepository.save(application);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.APPLICATION, RealtimeEvent.Action.CREATED, saved.getId().toString()));
        return toResponse(saved);
    }

    /**
     * Resolves the candidate for an application. When the caller is an authenticated
     * candidate, ownership is enforced: the application is always bound to their own
     * profile, regardless of any candidateId/inline payload supplied.
     */
    private Candidate resolveCandidateForCurrentUser(CreateApplicationRequest request) {
        Candidate self = currentCandidateIfSelf();
        if (self != null) {
            return self;
        }
        if (request.getCandidateId() != null) {
            return candidateRepository.findById(request.getCandidateId())
                    .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        }
        CreateCandidateRequest inline = request.getCandidate();
        if (inline == null || inline.getFirstName() == null || inline.getLastName() == null || inline.getContactEmail() == null) {
            throw new BusinessException("Either candidateId or inline candidate details are required");
        }
        assertEmailUnique(inline.getContactEmail(), null);
        assertNationalIdUnique(inline.getNationalId(), null);

        Candidate candidate = Candidate.builder()
                .nationalId(inline.getNationalId())
                .firstName(inline.getFirstName())
                .lastName(inline.getLastName())
                .contactEmail(inline.getContactEmail())
                .phone(inline.getPhone())
                .address(inline.getAddress())
                .university(inline.getUniversity())
                .speciality(inline.getSpeciality())
                .diploma(inline.getDiploma())
                .skills(inline.getSkills())
                .languages(inline.getLanguages())
                .build();
        return candidateRepository.save(candidate);
    }

    /**
     * Returns the current applicant's candidate profile when the authenticated user
     * holds the CANDIDATE role, otherwise {@code null} (HR/admin back-office flow).
     */
    private Candidate currentCandidateIfSelf() {
        if (!currentUserService.isAuthenticated()) {
            return null;
        }
        User user = currentUserService.currentUser();
        if (user.getRole() == null || !"CANDIDATE".equals(user.getRole().getName())) {
            return null;
        }
        return candidateRepository.findByUser_Id(user.getId()).orElse(null);
    }

    /**
     * Ensures a candidate may only act on their own applications.
     */
    private void assertCandidateOwnership(UUID id) {
        Candidate self = currentCandidateIfSelf();
        if (self == null) {
            return;
        }
        InternshipApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!self.getId().equals(app.getCandidate().getId())) {
            throw new BusinessException("You can only access your own applications");
        }
    }

    private void assertEmailUnique(String email, UUID currentId) {
        if (email == null || email.isBlank()) return;
        candidateRepository.findByContactEmail(email.trim()).ifPresent(existing -> {
            if (currentId == null || !existing.getId().equals(currentId)) {
                throw new BusinessException("A candidate with this email already exists");
            }
        });
    }

    private void assertNationalIdUnique(String nationalId, UUID currentId) {
        if (nationalId == null || nationalId.isBlank()) return;
        candidateRepository.findByNationalId(nationalId.trim()).ifPresent(existing -> {
            if (currentId == null || !existing.getId().equals(currentId)) {
                throw new BusinessException("A candidate with this national ID already exists");
            }
        });
    }

    @Override
    @Transactional
    @Audited(action = "SUBMIT", entity = "APPLICATION", entityId = "#args[0]", newValue = "#result")
    public ApplicationResponse submitApplication(UUID id) {
        assertCandidateOwnership(id);
        InternshipApplication app = findById(id);
        checkTransition(app, ApplicationStatus.SUBMITTED); // DRAFT -> SUBMITTED
        app.setStatus(ApplicationStatus.SUBMITTED);
        app.setSubmissionDate(LocalDate.now());
        InternshipApplication saved = applicationRepository.save(app);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.APPLICATION, RealtimeEvent.Action.STATUS_CHANGED, saved.getId().toString()));
        return toResponse(saved);
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
        InternshipApplication saved = applicationRepository.save(app);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.APPLICATION, RealtimeEvent.Action.STATUS_CHANGED, saved.getId().toString()));
        return toResponse(saved);
    }

    @Override
    @Transactional
    @Audited(action = "REJECT", entity = "APPLICATION", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public ApplicationResponse rejectApplication(UUID id) {
        InternshipApplication app = findById(id);
        checkTransition(app, ApplicationStatus.REJECTED); // DRAFT|SUBMITTED|UNDER_REVIEW -> REJECTED
        app.setStatus(ApplicationStatus.REJECTED);
        InternshipApplication saved = applicationRepository.save(app);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.APPLICATION, RealtimeEvent.Action.STATUS_CHANGED, saved.getId().toString()));
        return toResponse(saved);
    }

    @Override
    @Transactional
    @Audited(action = "STATUS_CHANGE", entity = "APPLICATION", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public ApplicationResponse updateStatus(UUID id, ApplicationStatus status) {
        InternshipApplication app = findById(id);
        checkTransition(app, status);
        app.setStatus(status);
        InternshipApplication saved = applicationRepository.save(app);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.APPLICATION, RealtimeEvent.Action.STATUS_CHANGED, saved.getId().toString()));
        return toResponse(saved);
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
