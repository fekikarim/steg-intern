package tn.steg.backend.departments.service;

import tn.steg.backend.departments.dto.CreateDepartmentRequest;
import tn.steg.backend.departments.dto.DepartmentResponse;
import tn.steg.backend.departments.dto.CreateEmployeeRequest;
import tn.steg.backend.departments.dto.EmployeeResponse;

import java.util.List;
import java.util.UUID;

public interface DepartmentService {
    List<DepartmentResponse> getAllDepartments();
    DepartmentResponse getDepartmentById(UUID id);
    DepartmentResponse createDepartment(CreateDepartmentRequest request);
    DepartmentResponse updateDepartment(UUID id, CreateDepartmentRequest request);
    void deleteDepartment(UUID id);
    List<EmployeeResponse> getEmployeesByDepartment(UUID departmentId);
    EmployeeResponse createEmployee(CreateEmployeeRequest request);
}
