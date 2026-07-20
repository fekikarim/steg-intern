package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.users.entity.Role;
import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(String name);
    boolean existsByName(String name);
}
