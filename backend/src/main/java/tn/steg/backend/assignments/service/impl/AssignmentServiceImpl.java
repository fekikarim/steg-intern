package tn.steg.backend.assignments.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.assignments.dto.AssignmentResponse;
import tn.steg.backend.assignments.dto.CreateAssignmentRequest;
import tn.steg.backend.assignments.entity.AssignmentStatus;
import tn.steg.backend.assignments.entity.InternshipAssignment;
import tn.steg.backend.assignments.repository.InternshipAssignmentRepository;
import tn.steg.backend.assignments.service.AssignmentService;
import tn.steg.backend.audit.annotation.Audited;
import tn.steg.backend.departments.entity.Department;
import tn.steg.backend.departments.entity.Employee;
import tn.steg.backend.departments.entity.Supervisor;
import tn.steg.backend.departments.repository.DepartmentRepository;
import tn.steg.backend.departments.repository.EmployeeRepository;
import tn.steg.backend.departments.repository.SupervisorRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.entity.InternshipStatus;
import tn.steg.backend.internships.repository.InternshipRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final InternshipAssignmentRepository assignmentRepository;
    private final InternshipRepository internshipRepository;
    private final DepartmentRepository departmentRepository;
    private final SupervisorRepository supervisorRepository;
    private final EmployeeRepository employeeRepository;

    /**
     * Explicit assignment state machine. Illegal transitions are rejected.
     */
    private static final Map<AssignmentStatus, Set<AssignmentStatus>> TRANSITIONS = Map.of(
            AssignmentStatus.ACTIVE, Set.of(AssignmentStatus.ENDED, AssignmentStatus.REASSIGNED, AssignmentStatus.CANCELLED),
            AssignmentStatus.ENDED, Set.of(),
            AssignmentStatus.REASSIGNED, Set.of(),
            AssignmentStatus.CANCELLED, Set.of()
    );

    private static final Set<InternshipStatus> ASSIGNABLE_STATUSES =
            Set.of(InternshipStatus.PLANNED, InternshipStatus.ACTIVE);

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments(AssignmentStatus status) {
        return assignmentRepository.findAll().stream()
                .filter(a -> status == null || a.getStatus() == status)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(UUID id) {
        return toResponse(assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found")));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByInternship(UUID internshipId) {
        return assignmentRepository.findByInternshipId(internshipId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsBySupervisor(UUID supervisorId) {
        return assignmentRepository.findBySupervisorId(supervisorId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAssignmentsByDepartment(UUID departmentId) {
        return assignmentRepository.findByDepartmentId(departmentId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    @Audited(action = "CREATE", entity = "ASSIGNMENT", entityId = "#result.id", newValue = "#result")
    public AssignmentResponse createAssignment(CreateAssignmentRequest request) {
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        if (!ASSIGNABLE_STATUSES.contains(internship.getStatus())) {
            throw new BusinessException("Internship is not assignable in its current state: " + internship.getStatus());
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Supervisor supervisor = supervisorRepository.findById(request.getSupervisorId())
                .orElseThrow(() -> new ResourceNotFoundException("Supervisor not found"));

        if (supervisor.getDepartment() == null || !request.getDepartmentId().equals(supervisor.getDepartment().getId())) {
            throw new BusinessException("Supervisor does not belong to the assigned department");
        }

        boolean hasActive = assignmentRepository.findByInternshipId(internship.getId()).stream()
                .anyMatch(a -> a.getStatus() == AssignmentStatus.ACTIVE);
        if (hasActive) {
            throw new BusinessException("An internship can only have one active assignment at a time");
        }

        Employee assignedBy = null;
        if (request.getAssignedById() != null) {
            assignedBy = employeeRepository.findById(request.getAssignedById())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));
        }

        InternshipAssignment assignment = InternshipAssignment.builder()
                .assignmentDate(request.getAssignmentDate() != null ? request.getAssignmentDate() : LocalDate.now())
                .status(AssignmentStatus.ACTIVE)
                .internship(internship)
                .department(department)
                .supervisor(supervisor)
                .assignedBy(assignedBy)
                .build();

        return toResponse(assignmentRepository.save(assignment));
    }

    @Override
    @Transactional
    @Audited(action = "STATUS_CHANGE", entity = "ASSIGNMENT", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
    public AssignmentResponse updateStatus(UUID id, AssignmentStatus status) {
        InternshipAssignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));
        AssignmentStatus current = assignment.getStatus();
        if (current != status) {
            Set<AssignmentStatus> allowed = TRANSITIONS.get(current);
            if (allowed == null || !allowed.contains(status)) {
                throw new BusinessException("Illegal assignment status transition: " + current + " -> " + status);
            }
        }
        assignment.setStatus(status);
        return toResponse(assignmentRepository.save(assignment));
    }

    @Override
    @Transactional
    @Audited(action = "DELETE", entity = "ASSIGNMENT", entityId = "#args[0]")
    public void deleteAssignment(UUID id) {
        if (!assignmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Assignment not found");
        }
        assignmentRepository.deleteById(id);
    }

    private AssignmentResponse toResponse(InternshipAssignment a) {
        return AssignmentResponse.builder()
                .id(a.getId())
                .assignmentDate(a.getAssignmentDate())
                .status(a.getStatus())
                .internshipId(a.getInternship().getId())
                .internshipReference(a.getInternship().getReference())
                .departmentId(a.getDepartment().getId())
                .departmentName(a.getDepartment().getName())
                .supervisorId(a.getSupervisor().getId())
                .supervisorName(a.getSupervisor().getFirstName() + " " + a.getSupervisor().getLastName())
                .assignedById(a.getAssignedBy() != null ? a.getAssignedBy().getId() : null)
                .assignedByName(a.getAssignedBy() != null ? a.getAssignedBy().getFirstName() + " " + a.getAssignedBy().getLastName() : null)
                .build();
    }
}
