package tn.steg.backend.applications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.applications.entity.ApplicationStatus;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {
    private UUID id;
    private String reference;
    private ApplicationStatus status;
    private Boolean submittedOnline;
    private LocalDate submissionDate;
    private UUID candidateId;
    private String candidateName;
}
