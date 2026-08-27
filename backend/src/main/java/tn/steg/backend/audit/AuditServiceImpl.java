package tn.steg.backend.audit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import tn.steg.backend.users.entity.AuditLog;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.repository.AuditLogRepository;
import tn.steg.backend.users.repository.UserRepository;

import java.util.UUID;

/**
 * Default {@link AuditService} backed by the {@link AuditLog} entity. Runs
 * asynchronously and without an explicit outer transaction (each repository
 * save commits on its own), so audit capture is fully independent of the calling
 * operation and can never roll it back or be blocked by it.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Async("auditTaskExecutor")
    @Override
    public void record(String action, String entityName, UUID entityId, String oldValue, String newValue, String actorEmail, String ipAddress) {
        try {
            AuditLog entry = AuditLog.builder()
                    .action(action)
                    .entityName(entityName)
                    .entityId(entityId)
                    .oldValue(oldValue)
                    .newValue(newValue)
                    .ipAddress(ipAddress)
                    .user(resolveActor(actorEmail))
                    .build();
            auditLogRepository.save(entry);
        } catch (Exception ex) {
            log.warn("Failed to write audit entry action={} entity={} id={}: {}",
                    action, entityName, entityId, ex.getMessage());
        }
    }

    @Override
    public void record(String action, String entityName, String newValue, String actorEmail) {
        record(action, entityName, null, null, newValue, actorEmail, null);
    }

    /**
     * Resolves the acting user by email. Performs only a plain repository read so
     * a missing/unset actor never contaminates audit persistence.
     */
    private User resolveActor(String actorEmail) {
        if (actorEmail == null || actorEmail.isBlank() || "anonymousUser".equals(actorEmail)) {
            return null;
        }
        try {
            return userRepository.findByEmail(actorEmail).orElse(null);
        } catch (Exception ex) {
            return null;
        }
    }
}
