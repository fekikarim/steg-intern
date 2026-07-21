package tn.steg.backend.internships.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.applications.entity.InternshipApplication;
import tn.steg.backend.applications.entity.ApplicationStatus;
import tn.steg.backend.applications.repository.InternshipApplicationRepository;
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

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InternshipServiceImpl implements InternshipService {

    private final InternshipRepository internshipRepository;
    private final CandidateRepository candidateRepository;
    private final InternshipApplicationRepository applicationRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<InternshipResponse> getAllInternships(Pageable pageable) {
        return internshipRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InternshipResponse> getInternshipsByStatus(InternshipStatus status, Pageable pageable) {
        return internshipRepository.findByStatus(status, pageable).map(this::toResponse);
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
    public InternshipResponse createInternship(CreateInternshipRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BusinessException("End date must be after start date");
        }

        Internship internship = Internship.builder()
                .reference(generateReference())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(InternshipStatus.PLANNED)
                .candidate(candidate)
                .build();

        if (request.getApplicationId() != null) {
            InternshipApplication application = applicationRepository.findById(request.getApplicationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
            internship.setApplication(application);
            application.setStatus(ApplicationStatus.ACCEPTED);
            applicationRepository.save(application);
        }

        return toResponse(internshipRepository.save(internship));
    }

    @Override
    @Transactional
    public InternshipResponse updateStatus(UUID id, InternshipStatus status) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));
        internship.setStatus(status);
        return toResponse(internshipRepository.save(internship));
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
