package tn.steg.backend.evaluations.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.evaluations.entity.EvaluationScore;
import java.util.List;
import java.util.UUID;

public interface EvaluationScoreRepository extends JpaRepository<EvaluationScore, UUID> {
    List<EvaluationScore> findByEvaluationId(UUID evaluationId);
}
