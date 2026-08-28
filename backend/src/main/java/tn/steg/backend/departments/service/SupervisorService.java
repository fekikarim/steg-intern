package tn.steg.backend.departments.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.departments.dto.SupervisorInternshipResponse;
import tn.steg.backend.departments.dto.SupervisorResponse;

import java.util.List;
import java.util.UUID;

public interface SupervisorService {
    Page<SupervisorResponse> getAllSupervisors(String search, UUID departmentId, Pageable pageable);
    SupervisorResponse getSupervisorById(UUID id);
    List<SupervisorInternshipResponse> getAssignedInternships(UUID supervisorId);
}
