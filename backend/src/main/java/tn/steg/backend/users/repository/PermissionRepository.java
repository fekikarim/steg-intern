package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.users.entity.Permission;
import java.util.Optional;
import java.util.UUID;

public interface PermissionRepository extends JpaRepository<Permission, UUID> {
    Optional<Permission> findByCode(String code);
    boolean existsByCode(String code);
}
