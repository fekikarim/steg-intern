package tn.steg.backend.assignments.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateAssignmentRequest {
    @NotNull(message = "Internship ID is required")
    private UUID internshipId;

    @NotNull(message = "Department ID is required")
    private UUID departmentId;

    @NotNull(message = "Supervisor ID is required")
    private UUID supervisorId;

    private UUID assignedById;
    private LocalDate assignmentDate;
}
