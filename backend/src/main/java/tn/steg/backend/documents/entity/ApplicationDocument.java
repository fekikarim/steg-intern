package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.applications.entity.InternshipApplication;

@Entity
@Table(name = "application_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

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

    @Builder.Default
    private Boolean mandatory = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private InternshipApplication application;
}
