package tn.steg.backend.audit;

import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.audit.dto.AuditResponse;
import tn.steg.backend.users.entity.AuditLog;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.repository.AuditLogRepository;
import tn.steg.backend.users.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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

    @Override
    @Transactional(readOnly = true)
    public Page<AuditResponse> search(UUID userId, String actor, String action, String entityName, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return auditLogRepository.findAll(buildSpecification(userId, actor, action, entityName, from, to), pageable)
                .map(this::toResponse);
    }

    private Specification<AuditLog> buildSpecification(UUID userId, String actor, String action, String entityName, LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class) {
                root.fetch("user", JoinType.LEFT);
            }
            List<Predicate> predicates = new ArrayList<>();
            if (userId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), userId));
            }
            if (actor != null && !actor.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("user").get("email")), "%" + actor.trim().toLowerCase() + "%"));
            }
            if (action != null && !action.isBlank()) {
                predicates.add(cb.equal(root.get("action"), action));
            }
            if (entityName != null && !entityName.isBlank()) {
                predicates.add(cb.equal(root.get("entityName"), entityName));
            }
            if (from != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), from));
            }
            if (to != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), to));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private AuditResponse toResponse(AuditLog log) {
        return AuditResponse.builder()
                .id(log.getId())
                .action(log.getAction())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .oldValue(log.getOldValue())
                .newValue(log.getNewValue())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .actorEmail(log.getUser() != null ? log.getUser().getEmail() : null)
                .build();
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
