package tn.steg.backend.candidates.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.audit.annotation.Audited;
import tn.steg.backend.candidates.dto.CandidateResponse;
import tn.steg.backend.candidates.dto.CreateCandidateRequest;
import tn.steg.backend.candidates.dto.UpdateCandidateRequest;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.candidates.service.CandidateService;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.security.CurrentUserService;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.repository.UserRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;

    @Override
    @Transactional(readOnly = true)
    public Page<CandidateResponse> getAllCandidates(String search, Pageable pageable) {
        return candidateRepository.findAll(buildSearchSpec(search), pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(UUID id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        return toResponse(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCurrentCandidate() {
        User user = currentUserService.currentUser();
        Candidate candidate = candidateRepository.findByUser_Id(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found"));
        return toResponse(candidate);
    }

    @Override
    @Transactional
    @Audited(action = "CREATE", entity = "CANDIDATE", entityId = "#result.id", newValue = "#result")
    public CandidateResponse createCandidate(CreateCandidateRequest request) {
        assertEmailUnique(request.getContactEmail(), null);
        assertNationalIdUnique(request.getNationalId(), null);

        Candidate candidate = Candidate.builder()
                .nationalId(request.getNationalId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .contactEmail(request.getContactEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .university(request.getUniversity())
                .speciality(request.getSpeciality())
                .diploma(request.getDiploma())
                .skills(request.getSkills())
                .languages(request.getLanguages())
                .user(resolveUser(request.getUserId()))
                .build();
        return toResponse(candidateRepository.save(candidate));
    }

    @Override
    @Transactional
    @Audited(action = "UPDATE", entity = "CANDIDATE", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public CandidateResponse updateCandidate(UUID id, UpdateCandidateRequest request) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (request.getContactEmail() != null) {
            assertEmailUnique(request.getContactEmail(), id);
            candidate.setContactEmail(request.getContactEmail());
        }
        if (request.getNationalId() != null) {
            assertNationalIdUnique(request.getNationalId(), id);
            candidate.setNationalId(request.getNationalId());
        }
        if (request.getFirstName() != null) candidate.setFirstName(request.getFirstName());
        if (request.getLastName() != null) candidate.setLastName(request.getLastName());
        if (request.getPhone() != null) candidate.setPhone(request.getPhone());
        if (request.getAddress() != null) candidate.setAddress(request.getAddress());
        if (request.getUniversity() != null) candidate.setUniversity(request.getUniversity());
        if (request.getSpeciality() != null) candidate.setSpeciality(request.getSpeciality());
        if (request.getDiploma() != null) candidate.setDiploma(request.getDiploma());
        if (request.getSkills() != null) candidate.setSkills(request.getSkills());
        if (request.getLanguages() != null) candidate.setLanguages(request.getLanguages());
        if (request.getUserId() != null) candidate.setUser(resolveUser(request.getUserId()));

        return toResponse(candidateRepository.save(candidate));
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

    private User resolveUser(UUID userId) {
        if (userId == null) return null;
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User account not found"));
    }

    private Specification<Candidate> buildSearchSpec(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) return cb.conjunction();
            String like = "%" + search.trim().toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), like),
                    cb.like(cb.lower(root.get("lastName")), like),
                    cb.like(cb.lower(root.get("contactEmail")), like),
                    cb.like(cb.lower(root.get("nationalId")), like)
            );
        };
    }

    private CandidateResponse toResponse(Candidate c) {
        return CandidateResponse.builder()
                .id(c.getId())
                .nationalId(c.getNationalId())
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .contactEmail(c.getContactEmail())
                .phone(c.getPhone())
                .address(c.getAddress())
                .university(c.getUniversity())
                .speciality(c.getSpeciality())
                .diploma(c.getDiploma())
                .skills(c.getSkills())
                .languages(c.getLanguages())
                .userId(c.getUser() != null ? c.getUser().getId() : null)
                .build();
    }
}
