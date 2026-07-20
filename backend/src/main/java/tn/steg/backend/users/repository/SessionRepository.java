package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.users.entity.Session;
import java.util.List;
import java.util.UUID;

public interface SessionRepository extends JpaRepository<Session, UUID> {
    List<Session> findByUserId(UUID userId);
}
