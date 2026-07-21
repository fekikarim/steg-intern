package tn.steg.backend.evaluations.service;

import tn.steg.backend.evaluations.dto.CreateEvaluationRequest;
import tn.steg.backend.evaluations.dto.EvaluationResponse;

import java.util.List;
import java.util.UUID;

public interface EvaluationService {
    List<EvaluationResponse> getEvaluationsByInternship(UUID internshipId);
    EvaluationResponse createEvaluation(CreateEvaluationRequest request);
}
