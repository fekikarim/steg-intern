package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByStatus(UserStatus status);
}
