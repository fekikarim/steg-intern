package tn.steg.backend.documents.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.documents.entity.DocumentType;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentResponse {
    private UUID id;
    private String reference;
    private DocumentType type;
    private String storageKey;
    private String mimeType;
    private Long size;
    private Integer version;
    private Boolean generatedAutomatically;
    private LocalDate createdDate;
    private UUID internshipId;
}
