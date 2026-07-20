package tn.steg.backend.documents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.documents.entity.Document;
import tn.steg.backend.documents.entity.DocumentType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    Optional<Document> findByReference(String reference);
    List<Document> findByType(DocumentType type);
    List<Document> findByInternshipId(UUID internshipId);
}
