package tn.steg.backend.notifications.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.notifications.dto.CreateNotificationRequest;
import tn.steg.backend.notifications.dto.NotificationResponse;

import java.util.UUID;

public interface NotificationService {
    Page<NotificationResponse> getUserNotifications(UUID userId, Pageable pageable);
    long getUnreadCount(UUID userId);
    void markAsRead(UUID notificationId, UUID recipientId);
    NotificationResponse createNotification(CreateNotificationRequest request);
}
