package tn.steg.backend.workflows.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.workflows.entity.Workflow;
import tn.steg.backend.workflows.entity.WorkflowStatus;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkflowRepository extends JpaRepository<Workflow, UUID> {
    List<Workflow> findByStatus(WorkflowStatus status);
    Optional<Workflow> findByRelatedEntityTypeAndRelatedEntityId(String entityType, UUID entityId);
}
