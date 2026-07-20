package tn.steg.backend.internships.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.internships.dto.CreateInternshipRequest;
import tn.steg.backend.internships.dto.InternshipResponse;
import tn.steg.backend.internships.entity.InternshipStatus;
import tn.steg.backend.internships.service.InternshipService;

import java.util.UUID;

@RestController
@RequestMapping("/internships")
@RequiredArgsConstructor
@Tag(name = "Internships", description = "Internship management operations")
public class InternshipController {

    private final InternshipService internshipService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'DIRECTOR')")
    @Operation(summary = "Get all internships")
    public ResponseEntity<Page<InternshipResponse>> getAllInternships(Pageable pageable) {
        return ResponseEntity.ok(internshipService.getAllInternships(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'DIRECTOR')")
    @Operation(summary = "Get internship by ID")
    public ResponseEntity<InternshipResponse> getInternshipById(@PathVariable UUID id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Create internship")
    public ResponseEntity<InternshipResponse> createInternship(@Valid @RequestBody CreateInternshipRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(internshipService.createInternship(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Update internship status")
    public ResponseEntity<InternshipResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam InternshipStatus status) {
        return ResponseEntity.ok(internshipService.updateStatus(id, status));
    }
}
