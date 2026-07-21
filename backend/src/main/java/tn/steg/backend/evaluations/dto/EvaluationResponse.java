package tn.steg.backend.evaluations.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.evaluations.entity.EvaluationType;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationResponse {
    private UUID id;
    private EvaluationType type;
    private LocalDate evaluationDate;
    private String feedback;
    private UUID internshipId;
    private UUID evaluatorId;
    private String evaluatorName;
    private Set<EvaluationScoreResponse> scores;
}
