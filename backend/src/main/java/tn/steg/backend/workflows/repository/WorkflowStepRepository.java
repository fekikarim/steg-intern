package tn.steg.backend.workflows.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.workflows.entity.WorkflowStep;
import java.util.List;
import java.util.UUID;

public interface WorkflowStepRepository extends JpaRepository<WorkflowStep, UUID> {
    List<WorkflowStep> findByWorkflowIdOrderBySequenceAsc(UUID workflowId);
}
