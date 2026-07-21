package tn.steg.backend.evaluations.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.departments.entity.Supervisor;
import tn.steg.backend.departments.repository.SupervisorRepository;
import tn.steg.backend.evaluations.dto.CreateEvaluationRequest;
import tn.steg.backend.evaluations.dto.EvaluationResponse;
import tn.steg.backend.evaluations.dto.EvaluationScoreResponse;
import tn.steg.backend.evaluations.entity.Evaluation;
import tn.steg.backend.evaluations.entity.EvaluationCriterion;
import tn.steg.backend.evaluations.entity.EvaluationScore;
import tn.steg.backend.evaluations.repository.EvaluationCriterionRepository;
import tn.steg.backend.evaluations.repository.EvaluationRepository;
import tn.steg.backend.evaluations.repository.EvaluationScoreRepository;
import tn.steg.backend.evaluations.service.EvaluationService;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final EvaluationCriterionRepository criterionRepository;
    private final EvaluationScoreRepository scoreRepository;
    private final InternshipRepository internshipRepository;
    private final SupervisorRepository supervisorRepository;

    @Override
    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEvaluationsByInternship(UUID internshipId) {
        return evaluationRepository.findByInternshipId(internshipId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EvaluationResponse createEvaluation(CreateEvaluationRequest request) {
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        Supervisor evaluator = supervisorRepository.findById(request.getEvaluatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Supervisor not found"));

        Evaluation evaluation = Evaluation.builder()
                .type(request.getType())
                .evaluationDate(request.getEvaluationDate() != null ? request.getEvaluationDate() : LocalDate.now())
                .feedback(request.getFeedback())
                .internship(internship)
                .evaluator(evaluator)
                .build();
        evaluation = evaluationRepository.save(evaluation);

        if (request.getScores() != null) {
            for (var scoreReq : request.getScores()) {
                EvaluationCriterion criterion = criterionRepository.findById(scoreReq.getCriterionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Evaluation criterion not found"));

                EvaluationScore score = EvaluationScore.builder()
                        .score(scoreReq.getScore())
                        .comment(scoreReq.getComment())
                        .evaluation(evaluation)
                        .criterion(criterion)
                        .build();
                scoreRepository.save(score);
            }
        }

        return toResponse(evaluationRepository.findById(evaluation.getId())
                .orElseThrow(() -> new RuntimeException("Evaluation not found after creation")));
    }

    private EvaluationResponse toResponse(Evaluation ev) {
        return EvaluationResponse.builder()
                .id(ev.getId())
                .type(ev.getType())
                .evaluationDate(ev.getEvaluationDate())
                .feedback(ev.getFeedback())
                .internshipId(ev.getInternship().getId())
                .evaluatorId(ev.getEvaluator().getId())
                .evaluatorName(ev.getEvaluator().getFirstName() + " " + ev.getEvaluator().getLastName())
                .scores(ev.getScores().stream().map(s -> EvaluationScoreResponse.builder()
                        .id(s.getId())
                        .score(s.getScore())
                        .comment(s.getComment())
                        .criterionId(s.getCriterion().getId())
                        .criterionName(s.getCriterion().getName())
                        .build()).collect(Collectors.toSet()))
                .build();
    }
}
