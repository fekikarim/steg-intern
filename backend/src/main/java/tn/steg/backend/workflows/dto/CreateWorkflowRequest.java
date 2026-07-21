package tn.steg.backend.workflows.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateWorkflowRequest {
    @NotBlank(message = "Workflow name is required")
    private String name;

    @NotNull(message = "Entity type is required")
    private String relatedEntityType;

    @NotNull(message = "Entity ID is required")
    private UUID relatedEntityId;

    private List<String> stepNames;
}
