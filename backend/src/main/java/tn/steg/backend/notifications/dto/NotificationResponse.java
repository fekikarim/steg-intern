package tn.steg.backend.notifications.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.notifications.entity.NotificationPriority;
import tn.steg.backend.notifications.entity.NotificationType;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private UUID id;
    private String title;
    private String message;
    private NotificationType type;
    private NotificationPriority priority;
    private String relatedEntityType;
    private UUID relatedEntityId;
    private LocalDateTime sentAt;
    private Boolean read;
    private LocalDateTime readAt;
}
