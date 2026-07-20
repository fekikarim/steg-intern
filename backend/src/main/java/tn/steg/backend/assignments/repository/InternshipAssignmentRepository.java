package tn.steg.backend.assignments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.assignments.entity.InternshipAssignment;
import java.util.List;
import java.util.UUID;

public interface InternshipAssignmentRepository extends JpaRepository<InternshipAssignment, UUID> {
    List<InternshipAssignment> findByInternshipId(UUID internshipId);
    List<InternshipAssignment> findBySupervisorId(UUID supervisorId);
    List<InternshipAssignment> findByDepartmentId(UUID departmentId);
}
