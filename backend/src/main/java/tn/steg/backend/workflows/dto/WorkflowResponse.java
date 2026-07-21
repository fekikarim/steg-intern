package tn.steg.backend.workflows.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.workflows.entity.WorkflowStatus;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowResponse {
    private UUID id;
    private String name;
    private WorkflowStatus status;
    private String relatedEntityType;
    private UUID relatedEntityId;
    private Set<WorkflowStepResponse> steps;
}
