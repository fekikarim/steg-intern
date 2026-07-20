package tn.steg.backend.internships.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.internships.dto.CreateInternshipRequest;
import tn.steg.backend.internships.dto.InternshipResponse;
import tn.steg.backend.internships.entity.InternshipStatus;

import java.util.UUID;

public interface InternshipService {
    Page<InternshipResponse> getAllInternships(Pageable pageable);
    Page<InternshipResponse> getInternshipsByStatus(InternshipStatus status, Pageable pageable);
    InternshipResponse getInternshipById(UUID id);
    InternshipResponse createInternship(CreateInternshipRequest request);
    InternshipResponse updateStatus(UUID id, InternshipStatus status);
}
