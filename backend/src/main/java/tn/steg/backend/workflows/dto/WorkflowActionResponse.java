package tn.steg.backend.workflows.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.workflows.entity.ApprovalDecision;
import tn.steg.backend.workflows.entity.WorkflowActionType;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowActionResponse {
    private UUID id;
    private WorkflowActionType type;
    private ApprovalDecision decision;
    private String comment;
    private String remarks;
    private LocalDateTime performedAt;
    private UUID performedById;
    private String performedByName;
}
