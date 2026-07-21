package tn.steg.backend.evaluations.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.evaluations.dto.CreateEvaluationRequest;
import tn.steg.backend.evaluations.dto.EvaluationResponse;
import tn.steg.backend.evaluations.service.EvaluationService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/evaluations")
@RequiredArgsConstructor
@Tag(name = "Evaluations", description = "Internship evaluation management")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'HR_MANAGER', 'SUPERVISOR', 'DIRECTOR')")
    @Operation(summary = "Get evaluations by internship")
    public ResponseEntity<List<EvaluationResponse>> getByInternship(@PathVariable UUID internshipId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByInternship(internshipId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'SUPERVISOR')")
    @Operation(summary = "Create evaluation")
    public ResponseEntity<EvaluationResponse> create(@Valid @RequestBody CreateEvaluationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(evaluationService.createEvaluation(request));
    }
}
