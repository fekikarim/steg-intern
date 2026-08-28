package tn.steg.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;
import tn.steg.backend.users.entity.User;

import java.util.Optional;
import java.util.UUID;

/**
 * Resolves the authenticated candidate and enforces internship ownership for the
 * self-service (mobile / front-office) intern flows. For any non-candidate caller
 * (HR/admin/supervisor back-office flow) ownership is not enforced.
 */
@Service
@RequiredArgsConstructor
public class InternOwnershipService {

    private final CurrentUserService currentUserService;
    private final CandidateRepository candidateRepository;
    private final InternshipRepository internshipRepository;

    /**
     * Returns the current applicant's candidate profile when the authenticated user
     * holds the CANDIDATE role, otherwise empty (back-office flow).
     */
    public Optional<Candidate> currentCandidateIfSelf() {
        if (!currentUserService.isAuthenticated()) {
            return Optional.empty();
        }
        User user = currentUserService.currentUser();
        if (user.getRole() == null || !"CANDIDATE".equals(user.getRole().getName())) {
            return Optional.empty();
        }
        return candidateRepository.findByUser_Id(user.getId());
    }

    /**
     * Ensures a candidate may only act on their own internships. No-op for back-office
     * callers (non-candidate roles).
     */
    public void assertInternshipOwnership(UUID internshipId) {
        Optional<Candidate> self = currentCandidateIfSelf();
        if (self.isEmpty()) {
            return;
        }
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        if (!self.get().getId().equals(internship.getCandidate().getId())) {
            throw new BusinessException("You can only access your own internships");
        }
    }
}
