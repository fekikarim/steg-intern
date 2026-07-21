package tn.steg.backend.workflows.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.users.repository.UserRepository;
import tn.steg.backend.workflows.dto.*;
import tn.steg.backend.workflows.service.WorkflowService;

import java.util.UUID;

@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
@Tag(name = "Workflows", description = "Workflow engine operations")
public class WorkflowController {

    private final WorkflowService workflowService;
    private final UserRepository userRepository;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Get workflow by ID")
    public ResponseEntity<WorkflowResponse> getWorkflowById(@PathVariable UUID id) {
        return ResponseEntity.ok(workflowService.getWorkflowById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER')")
    @Operation(summary = "Create workflow")
    public ResponseEntity<WorkflowResponse> createWorkflow(@Valid @RequestBody CreateWorkflowRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workflowService.createWorkflow(request));
    }

    @PostMapping("/actions")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Execute workflow action")
    public ResponseEntity<WorkflowActionResponse> executeAction(
            @Valid @RequestBody ExecuteActionRequest request,
            Authentication authentication) {
        var user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(workflowService.executeAction(request, user.getId()));
    }
}
