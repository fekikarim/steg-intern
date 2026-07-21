package tn.steg.backend.deliverables.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.deliverables.dto.CreateDeliverableRequest;
import tn.steg.backend.deliverables.dto.DeliverableResponse;
import tn.steg.backend.deliverables.entity.Deliverable;
import tn.steg.backend.deliverables.entity.DeliverableStatus;
import tn.steg.backend.deliverables.repository.DeliverableRepository;
import tn.steg.backend.deliverables.service.DeliverableService;
import tn.steg.backend.departments.repository.SupervisorRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliverableServiceImpl implements DeliverableService {

    private final DeliverableRepository deliverableRepository;
    private final InternshipRepository internshipRepository;
    private final CandidateRepository candidateRepository;
    private final SupervisorRepository supervisorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DeliverableResponse> getDeliverablesByInternship(UUID internshipId) {
        return deliverableRepository.findByInternshipId(internshipId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeliverableResponse createDeliverable(CreateDeliverableRequest request) {
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        var candidate = candidateRepository.findById(request.getSubmittedById())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        Deliverable del = Deliverable.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(DeliverableStatus.DRAFT)
                .storageKey(request.getStorageKey())
                .mimeType(request.getMimeType())
                .size(request.getSize())
                .version(1)
                .internship(internship)
                .submittedBy(candidate)
                .build();

        return toResponse(deliverableRepository.save(del));
    }

    @Override
    @Transactional
    public DeliverableResponse submitDeliverable(UUID id) {
        Deliverable del = deliverableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverable not found"));
        if (del.getStatus() != DeliverableStatus.DRAFT) {
            throw new BusinessException("Only draft deliverables can be submitted");
        }
        del.setStatus(DeliverableStatus.SUBMITTED);
        del.setSubmittedDate(LocalDate.now());
        return toResponse(deliverableRepository.save(del));
    }

    @Override
    @Transactional
    public DeliverableResponse validateDeliverable(UUID id, UUID validatedById) {
        Deliverable del = deliverableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverable not found"));
        var supervisor = supervisorRepository.findById(validatedById)
                .orElseThrow(() -> new ResourceNotFoundException("Supervisor not found"));
        del.setStatus(DeliverableStatus.VALIDATED);
        del.setValidatedAt(LocalDateTime.now());
        del.setValidatedBy(supervisor);
        return toResponse(deliverableRepository.save(del));
    }

    @Override
    @Transactional
    public DeliverableResponse rejectDeliverable(UUID id, UUID validatedById) {
        Deliverable del = deliverableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Deliverable not found"));
        var supervisor = supervisorRepository.findById(validatedById)
                .orElseThrow(() -> new ResourceNotFoundException("Supervisor not found"));
        del.setStatus(DeliverableStatus.REJECTED);
        del.setValidatedBy(supervisor);
        return toResponse(deliverableRepository.save(del));
    }

    private DeliverableResponse toResponse(Deliverable d) {
        return DeliverableResponse.builder()
                .id(d.getId())
                .title(d.getTitle())
                .description(d.getDescription())
                .status(d.getStatus())
                .storageKey(d.getStorageKey())
                .mimeType(d.getMimeType())
                .size(d.getSize())
                .version(d.getVersion())
                .submittedDate(d.getSubmittedDate())
                .validatedAt(d.getValidatedAt())
                .internshipId(d.getInternship().getId())
                .submittedById(d.getSubmittedBy() != null ? d.getSubmittedBy().getId() : null)
                .submittedByName(d.getSubmittedBy() != null ? d.getSubmittedBy().getFirstName() + " " + d.getSubmittedBy().getLastName() : null)
                .validatedById(d.getValidatedBy() != null ? d.getValidatedBy().getId() : null)
                .validatedByName(d.getValidatedBy() != null ? d.getValidatedBy().getFirstName() + " " + d.getValidatedBy().getLastName() : null)
                .build();
    }
}
