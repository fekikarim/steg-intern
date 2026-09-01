package tn.steg.backend.realtime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event payload broadcast via SSE to all connected back-office clients.
 *
 * <p>The {@code entity} field identifies the resource type (e.g. "USER",
 * "CANDIDATE", "INTERNSHIP") and the {@code action} field describes what
 * happened (CREATED, UPDATED, DELETED, STATUS_CHANGED). Clients use these
 * two fields to decide which data to invalidate / reload.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RealtimeEvent {

    /** Resource type affected, e.g. USER, CANDIDATE, ROLE, INTERNSHIP. */
    private String entity;

    /** Action performed: CREATED, UPDATED, DELETED, STATUS_CHANGED. */
    private String action;

    /** ID of the affected entity (null for bulk operations). */
    private String entityId;

    /** Optional human-readable summary for toast notifications. */
    private String message;

    /** Timestamp (epoch millis) when the event was created. */
    private long timestamp;

    public enum Entity {
        USER, ROLE, CANDIDATE, APPLICATION, INTERNSHIP,
        ASSIGNMENT, DEPARTMENT, DOCUMENT, PAYMENT, WORKFLOW, DASHBOARD
    }

    public enum Action {
        CREATED, UPDATED, DELETED, STATUS_CHANGED
    }

    public static RealtimeEvent of(Entity entity, Action action, String entityId) {
        return RealtimeEvent.builder()
                .entity(entity.name())
                .action(action.name())
                .entityId(entityId)
                .timestamp(System.currentTimeMillis())
                .build();
    }

    public static RealtimeEvent of(Entity entity, Action action, String entityId, String message) {
        return RealtimeEvent.builder()
                .entity(entity.name())
                .action(action.name())
                .entityId(entityId)
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build();
    }
}
