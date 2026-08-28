package tn.steg.backend.applications.dto;

import jakarta.validation.Valid;
import lombok.Data;
import tn.steg.backend.candidates.dto.CreateCandidateRequest;

import java.util.UUID;

@Data
public class CreateApplicationRequest {
    private UUID candidateId;

    @Valid
    private CreateCandidateRequest candidate;

    private Boolean submittedOnline;
}
