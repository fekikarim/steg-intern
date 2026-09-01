/**
 * Real-time event payload received from the backend SSE stream.
 * Matches the backend RealtimeEvent DTO.
 */
export interface RealtimeEvent {
  /** Resource type affected: USER, ROLE, CANDIDATE, APPLICATION, INTERNSHIP, etc. */
  entity: string;
  /** Action performed: CREATED, UPDATED, DELETED, STATUS_CHANGED */
  action: string;
  /** ID of the affected entity (null for bulk operations). */
  entityId: string;
  /** Optional human-readable summary for toast notifications. */
  message?: string;
  /** Timestamp (epoch millis) when the event was created. */
  timestamp: number;
}
