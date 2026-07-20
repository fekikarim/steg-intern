package tn.steg.backend.deliverables.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.departments.entity.Supervisor;
import tn.steg.backend.internships.entity.Internship;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliverables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deliverable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private DeliverableStatus status = DeliverableStatus.DRAFT;

    @Column(name = "storage_key")
    private String storageKey;

    private String bucket;

    @Column(name = "object_id")
    private String objectId;

    private String checksum;

    @Column(name = "mime_type")
    private String mimeType;

    private Long size;

    @Builder.Default
    private Integer version = 1;

    @Column(name = "submitted_date")
    private LocalDate submittedDate;

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by_id")
    private Candidate submittedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "validated_by_id")
    private Supervisor validatedBy;
}
