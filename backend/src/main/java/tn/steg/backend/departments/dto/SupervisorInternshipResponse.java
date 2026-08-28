package tn.steg.backend.departments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.internships.entity.InternshipStatus;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupervisorInternshipResponse {
    private UUID assignmentId;
    private UUID internshipId;
    private String internshipReference;
    private UUID candidateId;
    private String candidateName;
    private InternshipStatus internshipStatus;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate assignmentDate;
    private String departmentName;
}
