package tn.steg.backend.workflows.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowStepResponse {
    private UUID id;
    private String name;
    private Integer sequence;
    private Set<WorkflowActionResponse> actions;
}
