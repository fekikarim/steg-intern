package tn.steg.backend.departments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import tn.steg.backend.departments.entity.Supervisor;
import java.util.List;
import java.util.UUID;

public interface SupervisorRepository extends JpaRepository<Supervisor, UUID>, JpaSpecificationExecutor<Supervisor> {
    List<Supervisor> findByDepartmentId(UUID departmentId);
}
