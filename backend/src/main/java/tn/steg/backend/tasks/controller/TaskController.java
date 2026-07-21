package tn.steg.backend.tasks.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.tasks.dto.CreateTaskRequest;
import tn.steg.backend.tasks.dto.TaskResponse;
import tn.steg.backend.tasks.entity.TaskStatus;
import tn.steg.backend.tasks.service.TaskService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Tag(name = "Tasks", description = "Internship task management")
public class TaskController {

    private final TaskService taskService;

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'CANDIDATE')")
    @Operation(summary = "Get tasks by internship")
    public ResponseEntity<List<TaskResponse>> getTasksByInternship(@PathVariable UUID internshipId) {
        return ResponseEntity.ok(taskService.getTasksByInternship(internshipId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR')")
    @Operation(summary = "Create task")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'CANDIDATE')")
    @Operation(summary = "Update task status")
    public ResponseEntity<TaskResponse> updateStatus(@PathVariable UUID id, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateStatus(id, status));
    }
}
