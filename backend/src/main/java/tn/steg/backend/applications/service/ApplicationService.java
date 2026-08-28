package tn.steg.backend.applications.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.applications.dto.ApplicationResponse;
import tn.steg.backend.applications.dto.CreateApplicationRequest;
import tn.steg.backend.applications.entity.ApplicationStatus;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {
    Page<ApplicationResponse> getAllApplications(ApplicationStatus status, String search, Pageable pageable);
    ApplicationResponse getApplicationById(UUID id);
    List<ApplicationResponse> getMyApplications();
    ApplicationResponse createApplication(CreateApplicationRequest request);
    ApplicationResponse submitApplication(UUID id);
    ApplicationResponse acceptApplication(UUID id);
    ApplicationResponse rejectApplication(UUID id);
    ApplicationResponse updateStatus(UUID id, ApplicationStatus status);
}
