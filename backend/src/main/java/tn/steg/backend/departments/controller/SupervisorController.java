package tn.steg.backend.departments.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.departments.dto.SupervisorInternshipResponse;
import tn.steg.backend.departments.dto.SupervisorResponse;
import tn.steg.backend.departments.service.SupervisorService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/supervisors")
@RequiredArgsConstructor
@Tag(name = "Supervisors", description = "Supervisor management")
public class SupervisorController {

    private final SupervisorService supervisorService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'DIRECTOR')")
    @Operation(summary = "Get all supervisors", description = "Optionally filter by free-text search or department")
    public ResponseEntity<Page<SupervisorResponse>> getAllSupervisors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UUID departmentId,
            Pageable pageable) {
        return ResponseEntity.ok(supervisorService.getAllSupervisors(search, departmentId, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'DIRECTOR')")
    @Operation(summary = "Get supervisor by ID")
    public ResponseEntity<SupervisorResponse> getSupervisorById(@PathVariable UUID id) {
        return ResponseEntity.ok(supervisorService.getSupervisorById(id));
    }

    @GetMapping("/{id}/assigned-interns")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Get internships assigned to a supervisor")
    public ResponseEntity<List<SupervisorInternshipResponse>> getAssignedInternships(@PathVariable UUID id) {
        return ResponseEntity.ok(supervisorService.getAssignedInternships(id));
    }
}
