package tn.steg.backend.assignments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.assignments.entity.AssignmentStatus;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentResponse {
    private UUID id;
    private LocalDate assignmentDate;
    private AssignmentStatus status;
    private UUID internshipId;
    private String internshipReference;
    private UUID departmentId;
    private String departmentName;
    private UUID supervisorId;
    private String supervisorName;
    private UUID assignedById;
    private String assignedByName;
}
