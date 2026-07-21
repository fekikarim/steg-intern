package tn.steg.backend.documents.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.steg.backend.documents.entity.DocumentType;

import java.util.UUID;

@Data
public class UploadDocumentRequest {
    @NotNull(message = "Document type is required")
    private DocumentType type;

    @NotNull(message = "Internship ID is required")
    private UUID internshipId;

    @NotNull(message = "Storage key is required")
    private String storageKey;

    private String mimeType;
    private Long size;
}
