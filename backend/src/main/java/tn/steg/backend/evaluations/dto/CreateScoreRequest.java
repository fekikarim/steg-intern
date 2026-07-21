package tn.steg.backend.evaluations.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateScoreRequest {
    @NotNull
    private UUID criterionId;
    @NotNull
    private Double score;
    private String comment;
}
