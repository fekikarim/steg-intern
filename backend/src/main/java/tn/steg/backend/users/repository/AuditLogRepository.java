package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.users.entity.AuditLog;
import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByUserId(UUID userId);
    List<AuditLog> findByEntityNameAndEntityId(String entityName, UUID entityId);
}
