package tn.steg.backend.notifications.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.notifications.dto.CreateNotificationRequest;
import tn.steg.backend.notifications.dto.NotificationResponse;
import tn.steg.backend.notifications.entity.Notification;
import tn.steg.backend.notifications.entity.NotificationPriority;
import tn.steg.backend.notifications.entity.NotificationRecipient;
import tn.steg.backend.notifications.entity.RecipientType;
import tn.steg.backend.notifications.repository.NotificationRecipientRepository;
import tn.steg.backend.notifications.repository.NotificationRepository;
import tn.steg.backend.notifications.service.NotificationService;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationRecipientRepository recipientRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(UUID userId, Pageable pageable) {
        return recipientRepository.findByRecipientId(userId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return recipientRepository.countByRecipientIdAndReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId, UUID recipientId) {
        NotificationRecipient recipient = recipientRepository.findById(recipientId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification recipient not found"));
        recipient.setRead(true);
        recipient.setReadAt(LocalDateTime.now());
        recipientRepository.save(recipient);
    }

    @Override
    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        Notification notification = Notification.builder()
                .title(request.getTitle())
                .message(request.getMessage())
                .type(request.getType())
                .priority(request.getPriority() != null ? request.getPriority() : NotificationPriority.NORMAL)
                .relatedEntityType(request.getRelatedEntityType())
                .relatedEntityId(request.getRelatedEntityId())
                .sentAt(LocalDateTime.now())
                .build();
        notification = notificationRepository.save(notification);

        for (UUID recipientId : request.getRecipientIds()) {
            NotificationRecipient recipient = NotificationRecipient.builder()
                    .recipientType(RecipientType.USER)
                    .recipientId(recipientId)
                    .read(false)
                    .notification(notification)
                    .build();
            recipientRepository.save(recipient);
        }

        UUID firstRecipientId = request.getRecipientIds().iterator().next();
        return toResponse(recipientRepository.findByRecipientId(firstRecipientId, Pageable.ofSize(1))
                .getContent().get(0));
    }

    private NotificationResponse toResponse(NotificationRecipient nr) {
        Notification n = nr.getNotification();
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .priority(n.getPriority())
                .relatedEntityType(n.getRelatedEntityType())
                .relatedEntityId(n.getRelatedEntityId())
                .sentAt(n.getSentAt())
                .read(nr.getRead())
                .readAt(nr.getReadAt())
                .build();
    }
}
