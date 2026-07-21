package tn.steg.backend.notifications.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tn.steg.backend.notifications.entity.NotificationPriority;
import tn.steg.backend.notifications.entity.NotificationType;

import java.util.List;
import java.util.UUID;

@Data
public class CreateNotificationRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotNull(message = "Type is required")
    private NotificationType type;

    private NotificationPriority priority;

    private String relatedEntityType;
    private UUID relatedEntityId;

    @NotNull(message = "Recipient IDs are required")
    private List<UUID> recipientIds;
}
