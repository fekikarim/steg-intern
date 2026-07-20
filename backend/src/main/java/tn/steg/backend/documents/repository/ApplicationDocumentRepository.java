package tn.steg.backend.documents.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.documents.entity.ApplicationDocument;
import java.util.List;
import java.util.UUID;

public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, UUID> {
    List<ApplicationDocument> findByApplicationId(UUID applicationId);
}
