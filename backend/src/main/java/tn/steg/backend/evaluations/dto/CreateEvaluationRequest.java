package tn.steg.backend.evaluations.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.steg.backend.evaluations.entity.EvaluationType;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class CreateEvaluationRequest {
    @NotNull(message = "Evaluation type is required")
    private EvaluationType type;

    @NotNull(message = "Internship ID is required")
    private UUID internshipId;

    @NotNull(message = "Evaluator ID is required")
    private UUID evaluatorId;

    private String feedback;
    private LocalDate evaluationDate;
    private List<CreateScoreRequest> scores;
}
