package tn.steg.backend.evaluations.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.evaluations.entity.Evaluation;
import tn.steg.backend.evaluations.entity.EvaluationType;
import java.util.List;
import java.util.UUID;

public interface EvaluationRepository extends JpaRepository<Evaluation, UUID> {
    List<Evaluation> findByInternshipId(UUID internshipId);
    List<Evaluation> findByEvaluatorId(UUID evaluatorId);
    List<Evaluation> findByType(EvaluationType type);
}
