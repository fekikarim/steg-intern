package tn.steg.backend.workflows.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.steg.backend.workflows.entity.ApprovalDecision;
import tn.steg.backend.workflows.entity.WorkflowActionType;

import java.util.UUID;

@Data
public class ExecuteActionRequest {
    @NotNull(message = "Step ID is required")
    private UUID stepId;

    @NotNull(message = "Action type is required")
    private WorkflowActionType type;

    @NotNull(message = "Decision is required")
    private ApprovalDecision decision;

    private String comment;
}
