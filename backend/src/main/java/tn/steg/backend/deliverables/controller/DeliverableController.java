package tn.steg.backend.deliverables.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.deliverables.dto.CreateDeliverableRequest;
import tn.steg.backend.deliverables.dto.DeliverableResponse;
import tn.steg.backend.deliverables.service.DeliverableService;
import tn.steg.backend.users.repository.UserRepository;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/deliverables")
@RequiredArgsConstructor
@Tag(name = "Deliverables", description = "Internship deliverable management")
public class DeliverableController {

    private final DeliverableService deliverableService;
    private final UserRepository userRepository;

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'CANDIDATE')")
    @Operation(summary = "Get deliverables by internship")
    public ResponseEntity<List<DeliverableResponse>> getByInternship(@PathVariable UUID internshipId) {
        return ResponseEntity.ok(deliverableService.getDeliverablesByInternship(internshipId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'CANDIDATE')")
    @Operation(summary = "Create deliverable")
    public ResponseEntity<DeliverableResponse> create(@Valid @RequestBody CreateDeliverableRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deliverableService.createDeliverable(request));
    }

    @PatchMapping("/{id}/submit")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'CANDIDATE')")
    @Operation(summary = "Submit deliverable")
    public ResponseEntity<DeliverableResponse> submit(@PathVariable UUID id) {
        return ResponseEntity.ok(deliverableService.submitDeliverable(id));
    }

    @PatchMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR')")
    @Operation(summary = "Validate deliverable")
    public ResponseEntity<DeliverableResponse> validate(
            @PathVariable UUID id, Authentication auth) {
        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(deliverableService.validateDeliverable(id, user.getId()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR')")
    @Operation(summary = "Reject deliverable")
    public ResponseEntity<DeliverableResponse> reject(
            @PathVariable UUID id, Authentication auth) {
        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(deliverableService.rejectDeliverable(id, user.getId()));
    }
}
