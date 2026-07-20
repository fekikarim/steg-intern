package tn.steg.backend.notifications.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.notifications.entity.NotificationRecipient;
import java.util.List;
import java.util.UUID;

public interface NotificationRecipientRepository extends JpaRepository<NotificationRecipient, UUID> {
    Page<NotificationRecipient> findByRecipientId(UUID recipientId, Pageable pageable);
    List<NotificationRecipient> findByRecipientIdAndReadFalse(UUID recipientId);
    long countByRecipientIdAndReadFalse(UUID recipientId);
}
