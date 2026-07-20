package tn.steg.backend.departments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.departments.entity.Department;
import java.util.Optional;
import java.util.UUID;

public interface DepartmentRepository extends JpaRepository<Department, UUID> {
    Optional<Department> findByCode(String code);
    Optional<Department> findByName(String name);
}
