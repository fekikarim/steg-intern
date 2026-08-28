package tn.steg.backend.departments.service.impl;

import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.assignments.entity.AssignmentStatus;
import tn.steg.backend.assignments.entity.InternshipAssignment;
import tn.steg.backend.assignments.repository.InternshipAssignmentRepository;
import tn.steg.backend.departments.dto.SupervisorInternshipResponse;
import tn.steg.backend.departments.dto.SupervisorResponse;
import tn.steg.backend.departments.entity.Supervisor;
import tn.steg.backend.departments.repository.SupervisorRepository;
import tn.steg.backend.departments.service.SupervisorService;
import tn.steg.backend.exception.ResourceNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupervisorServiceImpl implements SupervisorService {

    private final SupervisorRepository supervisorRepository;
    private final InternshipAssignmentRepository assignmentRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<SupervisorResponse> getAllSupervisors(String search, UUID departmentId, Pageable pageable) {
        return supervisorRepository.findAll(buildSearchSpec(search, departmentId), pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public SupervisorResponse getSupervisorById(UUID id) {
        Supervisor s = supervisorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supervisor not found"));
        return toResponse(s);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SupervisorInternshipResponse> getAssignedInternships(UUID supervisorId) {
        return assignmentRepository.findBySupervisorId(supervisorId).stream()
                .filter(a -> a.getInternship() != null)
                .map(this::toInternshipResponse)
                .collect(Collectors.toList());
    }

    private Specification<Supervisor> buildSearchSpec(String search, UUID departmentId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (departmentId != null) {
                predicates.add(cb.equal(root.get("department").get("id"), departmentId));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("firstName")), like),
                        cb.like(cb.lower(root.get("lastName")), like),
                        cb.like(cb.lower(root.get("employeeNumber")), like)
                ));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private SupervisorResponse toResponse(Supervisor s) {
        List<InternshipAssignment> assignments = assignmentRepository.findBySupervisorId(s.getId());
        long active = assignments.stream()
                .filter(a -> a.getStatus() == AssignmentStatus.ACTIVE)
                .count();
        return SupervisorResponse.builder()
                .id(s.getId())
                .firstName(s.getFirstName())
                .lastName(s.getLastName())
                .employeeNumber(s.getEmployeeNumber())
                .phoneNumber(s.getPhoneNumber())
                .position(s.getPosition())
                .hireDate(s.getHireDate())
                .departmentId(s.getDepartment() != null ? s.getDepartment().getId() : null)
                .departmentName(s.getDepartment() != null ? s.getDepartment().getName() : null)
                .totalAssignments(assignments.size())
                .activeAssignments((int) active)
                .hasActiveInternship(active > 0)
                .build();
    }

    private SupervisorInternshipResponse toInternshipResponse(InternshipAssignment a) {
        var i = a.getInternship();
        var c = i.getCandidate();
        return SupervisorInternshipResponse.builder()
                .assignmentId(a.getId())
                .internshipId(i.getId())
                .internshipReference(i.getReference())
                .candidateId(c != null ? c.getId() : null)
                .candidateName(c != null ? c.getFirstName() + " " + c.getLastName() : null)
                .internshipStatus(i.getStatus())
                .startDate(i.getStartDate())
                .endDate(i.getEndDate())
                .assignmentDate(a.getAssignmentDate())
                .departmentName(a.getDepartment() != null ? a.getDepartment().getName() : null)
                .build();
    }
}
