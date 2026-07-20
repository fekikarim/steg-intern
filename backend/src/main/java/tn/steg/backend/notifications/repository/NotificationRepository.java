package tn.steg.backend.notifications.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.notifications.entity.Notification;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
}
