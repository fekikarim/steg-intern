package tn.steg.backend.deliverables.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.deliverables.entity.DeliverableStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliverableResponse {
    private UUID id;
    private String title;
    private String description;
    private DeliverableStatus status;
    private String storageKey;
    private String mimeType;
    private Long size;
    private Integer version;
    private LocalDate submittedDate;
    private LocalDateTime validatedAt;
    private UUID internshipId;
    private UUID submittedById;
    private String submittedByName;
    private UUID validatedById;
    private String validatedByName;
}
