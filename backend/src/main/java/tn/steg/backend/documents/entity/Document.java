package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.internships.entity.Internship;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private DocumentType type;

    @Column(name = "storage_key")
    private String storageKey;

    private String bucket;

    @Column(name = "object_id")
    private String objectId;

    private String checksum;

    @Column(name = "mime_type")
    private String mimeType;

    private Long size;

    @Column(name = "version")
    private Integer version = 1;

    @Column(name = "generated_automatically")
    private Boolean generatedAutomatically = false;

    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate = LocalDate.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;
}
