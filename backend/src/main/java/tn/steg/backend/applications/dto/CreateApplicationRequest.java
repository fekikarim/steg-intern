package tn.steg.backend.applications.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateApplicationRequest {
    @NotNull(message = "Candidate ID is required")
    private UUID candidateId;
}
