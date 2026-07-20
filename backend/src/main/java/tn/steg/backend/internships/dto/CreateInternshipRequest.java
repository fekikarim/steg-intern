package tn.steg.backend.internships.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateInternshipRequest {
    @NotNull(message = "Candidate ID is required")
    private UUID candidateId;

    private UUID applicationId;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;
}
