package tn.steg.backend.applications.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.applications.dto.ApplicationResponse;
import tn.steg.backend.applications.dto.CreateApplicationRequest;
import tn.steg.backend.applications.entity.ApplicationStatus;
import tn.steg.backend.applications.entity.InternshipApplication;
import tn.steg.backend.applications.repository.InternshipApplicationRepository;
import tn.steg.backend.applications.service.ApplicationService;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final InternshipApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;

    @Override
    public Page<ApplicationResponse> getAllApplications(Pageable pageable) {
        return applicationRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public Page<ApplicationResponse> getApplicationsByStatus(ApplicationStatus status, Pageable pageable) {
        return applicationRepository.findByStatus(status, pageable).map(this::toResponse);
    }

    @Override
    public ApplicationResponse getApplicationById(UUID id) {
        InternshipApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        return toResponse(app);
    }

    @Override
    @Transactional
    public ApplicationResponse createApplication(CreateApplicationRequest request) {
        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        InternshipApplication application = InternshipApplication.builder()
                .reference("APP-" + System.currentTimeMillis())
                .status(ApplicationStatus.DRAFT)
                .submittedOnline(true)
                .candidate(candidate)
                .build();

        return toResponse(applicationRepository.save(application));
    }

    @Override
    @Transactional
    public ApplicationResponse submitApplication(UUID id) {
        InternshipApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (app.getStatus() != ApplicationStatus.DRAFT) {
            throw new BusinessException("Only draft applications can be submitted");
        }

        app.setStatus(ApplicationStatus.SUBMITTED);
        app.setSubmissionDate(LocalDate.now());
        return toResponse(applicationRepository.save(app));
    }

    @Override
    @Transactional
    public ApplicationResponse updateStatus(UUID id, ApplicationStatus status) {
        InternshipApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        app.setStatus(status);
        return toResponse(applicationRepository.save(app));
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
