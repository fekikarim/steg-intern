package tn.steg.backend.deliverables.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateDeliverableRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Internship ID is required")
    private UUID internshipId;

    @NotNull(message = "Submitted by ID is required")
    private UUID submittedById;

    private String storageKey;
    private String mimeType;
    private Long size;
}
