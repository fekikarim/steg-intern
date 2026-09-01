package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID>, JpaSpecificationExecutor<User> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByRole_Id(UUID roleId);
    long countByStatus(UserStatus status);
}
