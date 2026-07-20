package tn.steg.backend.evaluations.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.evaluations.entity.EvaluationCriterion;
import java.util.UUID;

public interface EvaluationCriterionRepository extends JpaRepository<EvaluationCriterion, UUID> {
}
