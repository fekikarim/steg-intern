package tn.steg.backend.workflows.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.workflows.entity.WorkflowAction;
import java.util.List;
import java.util.UUID;

public interface WorkflowActionRepository extends JpaRepository<WorkflowAction, UUID> {
    List<WorkflowAction> findByWorkflowStepId(UUID workflowStepId);
    List<WorkflowAction> findByPerformedById(UUID userId);
}
