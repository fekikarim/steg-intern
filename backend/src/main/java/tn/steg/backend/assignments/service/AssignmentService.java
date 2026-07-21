package tn.steg.backend.assignments.service;

import tn.steg.backend.assignments.dto.AssignmentResponse;
import tn.steg.backend.assignments.dto.CreateAssignmentRequest;
import tn.steg.backend.assignments.entity.AssignmentStatus;

import java.util.List;
import java.util.UUID;

public interface AssignmentService {
    List<AssignmentResponse> getAssignmentsByInternship(UUID internshipId);
    List<AssignmentResponse> getAssignmentsBySupervisor(UUID supervisorId);
    List<AssignmentResponse> getAssignmentsByDepartment(UUID departmentId);
    AssignmentResponse createAssignment(CreateAssignmentRequest request);
    AssignmentResponse updateStatus(UUID id, AssignmentStatus status);
}
