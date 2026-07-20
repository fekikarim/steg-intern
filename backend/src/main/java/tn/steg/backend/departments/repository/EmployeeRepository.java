package tn.steg.backend.departments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.departments.entity.Employee;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByEmployeeNumber(String employeeNumber);
    List<Employee> findByDepartmentId(UUID departmentId);
}
