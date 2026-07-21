package tn.steg.backend.assignments.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.assignments.dto.AssignmentResponse;
import tn.steg.backend.assignments.dto.CreateAssignmentRequest;
import tn.steg.backend.assignments.entity.AssignmentStatus;
import tn.steg.backend.assignments.service.AssignmentService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/assignments")
@RequiredArgsConstructor
@Tag(name = "Assignments", description = "Internship assignment management")
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Get assignments by internship")
    public ResponseEntity<List<AssignmentResponse>> getByInternship(@PathVariable UUID internshipId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByInternship(internshipId));
    }

    @GetMapping("/supervisor/{supervisorId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Get assignments by supervisor")
    public ResponseEntity<List<AssignmentResponse>> getBySupervisor(@PathVariable UUID supervisorId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsBySupervisor(supervisorId));
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Get assignments by department")
    public ResponseEntity<List<AssignmentResponse>> getByDepartment(@PathVariable UUID departmentId) {
        return ResponseEntity.ok(assignmentService.getAssignmentsByDepartment(departmentId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Create assignment")
    public ResponseEntity<AssignmentResponse> create(@Valid @RequestBody CreateAssignmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assignmentService.createAssignment(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Update assignment status")
    public ResponseEntity<AssignmentResponse> updateStatus(@PathVariable UUID id, @RequestParam AssignmentStatus status) {
        return ResponseEntity.ok(assignmentService.updateStatus(id, status));
    }
}
