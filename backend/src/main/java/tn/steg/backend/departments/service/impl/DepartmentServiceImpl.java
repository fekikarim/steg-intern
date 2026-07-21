package tn.steg.backend.departments.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.departments.dto.CreateDepartmentRequest;
import tn.steg.backend.departments.dto.CreateEmployeeRequest;
import tn.steg.backend.departments.dto.DepartmentResponse;
import tn.steg.backend.departments.dto.EmployeeResponse;
import tn.steg.backend.departments.entity.*;
import tn.steg.backend.departments.repository.DepartmentRepository;
import tn.steg.backend.departments.repository.EmployeeRepository;
import tn.steg.backend.departments.service.DepartmentService;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.repository.UserRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentResponse getDepartmentById(UUID id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        return toResponse(dept);
    }

    @Override
    @Transactional
    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {
        if (departmentRepository.findByCode(request.getCode()).isPresent()) {
            throw new BusinessException("Department code already exists");
        }

        Department dept = Department.builder()
                .code(request.getCode())
                .name(request.getName())
                .description(request.getDescription())
                .build();

        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent department not found"));
            dept.setParent(parent);
        }

        return toResponse(departmentRepository.save(dept));
    }

    @Override
    @Transactional
    public DepartmentResponse updateDepartment(UUID id, CreateDepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        dept.setCode(request.getCode());
        dept.setName(request.getName());
        dept.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Department parent = departmentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent department not found"));
            dept.setParent(parent);
        } else {
            dept.setParent(null);
        }

        return toResponse(departmentRepository.save(dept));
    }

    @Override
    @Transactional
    public void deleteDepartment(UUID id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found");
        }
        departmentRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmployeeResponse> getEmployeesByDepartment(UUID departmentId) {
        return employeeRepository.findByDepartmentId(departmentId).stream()
                .map(this::toEmployeeResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Department dept = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Employee employee;
        String type = request.getType() != null ? request.getType() : "EMPLOYEE";

        employee = switch (type.toUpperCase()) {
            case "SUPERVISOR" -> {
                Supervisor s = new Supervisor();
                s.setPosition(request.getPosition());
                yield s;
            }
            case "HR_MANAGER" -> new HRManager();
            case "FINANCE_MANAGER" -> new FinanceManager();
            case "DIRECTOR" -> new Director();
            case "ADMINISTRATOR" -> new Administrator();
            default -> new Employee();
        };

        employee.setUser(user);
        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setEmployeeNumber(request.getEmployeeNumber());
        employee.setHireDate(request.getHireDate() != null ? request.getHireDate() : java.time.LocalDate.now());
        employee.setDepartment(dept);

        return toEmployeeResponse(employeeRepository.save(employee));
    }

    private DepartmentResponse toResponse(Department dept) {
        return DepartmentResponse.builder()
                .id(dept.getId())
                .code(dept.getCode())
                .name(dept.getName())
                .description(dept.getDescription())
                .parentId(dept.getParent() != null ? dept.getParent().getId() : null)
                .children(dept.getChildren() != null
                        ? dept.getChildren().stream().map(this::toResponse).collect(Collectors.toSet())
                        : null)
                .build();
    }

    private EmployeeResponse toEmployeeResponse(Employee emp) {
        EmployeeResponse.EmployeeResponseBuilder builder = EmployeeResponse.builder()
                .id(emp.getId())
                .firstName(emp.getFirstName())
                .lastName(emp.getLastName())
                .phoneNumber(emp.getPhoneNumber())
                .employeeNumber(emp.getEmployeeNumber())
                .hireDate(emp.getHireDate())
                .departmentId(emp.getDepartment().getId())
                .departmentName(emp.getDepartment().getName());

        if (emp instanceof Supervisor) builder.type("SUPERVISOR");
        else if (emp instanceof HRManager) builder.type("HR_MANAGER");
        else if (emp instanceof FinanceManager) builder.type("FINANCE_MANAGER");
        else if (emp instanceof Director) builder.type("DIRECTOR");
        else if (emp instanceof Administrator) builder.type("ADMINISTRATOR");
        else builder.type("EMPLOYEE");

        return builder.build();
    }
}
