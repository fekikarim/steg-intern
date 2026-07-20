package tn.steg.backend.applications.controller;

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
import tn.steg.backend.applications.dto.ApplicationResponse;
import tn.steg.backend.applications.dto.CreateApplicationRequest;
import tn.steg.backend.applications.entity.ApplicationStatus;
import tn.steg.backend.applications.service.ApplicationService;

import java.util.UUID;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@Tag(name = "Applications", description = "Internship application management operations")
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Get all applications")
    public ResponseEntity<Page<ApplicationResponse>> getAllApplications(Pageable pageable) {
        return ResponseEntity.ok(applicationService.getAllApplications(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Get application by ID")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable UUID id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'CANDIDATE')")
    @Operation(summary = "Create application")
    public ResponseEntity<ApplicationResponse> createApplication(@Valid @RequestBody CreateApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.createApplication(request));
    }

    @PatchMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'CANDIDATE')")
    @Operation(summary = "Submit application")
    public ResponseEntity<ApplicationResponse> submitApplication(@PathVariable UUID id) {
        return ResponseEntity.ok(applicationService.submitApplication(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Update application status")
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam ApplicationStatus status) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status));
    }
}
