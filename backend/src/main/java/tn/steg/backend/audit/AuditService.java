package tn.steg.backend.audit;

import java.util.UUID;

/**
 * Encapsulates writing audit log entries. Implementations are expected to persist
 * asynchronously and independently of the calling transaction so that audit
 * capture never breaks the underlying business operation.
 */
public interface AuditService {

    /**
     * Records an audit event.
     *
     * @param action     the audited action, e.g. CREATE / UPDATE / DELETE / LOGIN
     * @param entityName the logical entity name, e.g. USER, INTERNSHIP
     * @param entityId   the id of the affected entity (may be null)
     * @param oldValue   a snapshot of the previous state (may be null)
     * @param newValue   a snapshot of the new state (may be null)
     * @param actorEmail the email of the acting user, if available (may be null)
     * @param ipAddress  the client IP address (may be null)
     */
    void record(String action, String entityName, UUID entityId, String oldValue, String newValue, String actorEmail, String ipAddress);

    /**
     * Records an audit event without associating an entity.
     */
    void record(String action, String entityName, String newValue, String actorEmail);
}
