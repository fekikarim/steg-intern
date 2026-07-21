package tn.steg.backend.evaluations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationScoreResponse {
    private UUID id;
    private Double score;
    private String comment;
    private UUID criterionId;
    private String criterionName;
}
