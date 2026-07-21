package tn.steg.backend.workflows.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.repository.UserRepository;
import tn.steg.backend.workflows.dto.*;
import tn.steg.backend.workflows.entity.*;
import tn.steg.backend.workflows.repository.WorkflowActionRepository;
import tn.steg.backend.workflows.repository.WorkflowRepository;
import tn.steg.backend.workflows.repository.WorkflowStepRepository;
import tn.steg.backend.workflows.service.WorkflowService;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkflowServiceImpl implements WorkflowService {

    private final WorkflowRepository workflowRepository;
    private final WorkflowStepRepository workflowStepRepository;
    private final WorkflowActionRepository workflowActionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public WorkflowResponse getWorkflowById(UUID id) {
        Workflow wf = workflowRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workflow not found"));
        return toResponse(wf);
    }

    @Override
    @Transactional
    public WorkflowResponse createWorkflow(CreateWorkflowRequest request) {
        Workflow wf = Workflow.builder()
                .name(request.getName())
                .status(WorkflowStatus.CREATED)
                .relatedEntityType(request.getRelatedEntityType())
                .relatedEntityId(request.getRelatedEntityId())
                .build();

        if (request.getStepNames() != null) {
            Set<WorkflowStep> steps = new HashSet<>();
            for (int i = 0; i < request.getStepNames().size(); i++) {
                steps.add(WorkflowStep.builder()
                        .name(request.getStepNames().get(i))
                        .sequence(i + 1)
                        .workflow(wf)
                        .build());
            }
            wf.setSteps(steps);
        }

        return toResponse(workflowRepository.save(wf));
    }

    @Override
    @Transactional
    public WorkflowActionResponse executeAction(ExecuteActionRequest request, UUID userId) {
        WorkflowStep step = workflowStepRepository.findById(request.getStepId())
                .orElseThrow(() -> new ResourceNotFoundException("Workflow step not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkflowAction action = WorkflowAction.builder()
                .type(request.getType())
                .decision(request.getDecision())
                .comment(request.getComment())
                .performedAt(LocalDateTime.now())
                .workflowStep(step)
                .performedBy(user)
                .build();
        workflowActionRepository.save(action);

        Workflow workflow = step.getWorkflow();
        if (request.getDecision() == ApprovalDecision.APPROVED) {
            boolean allStepsCompleted = workflow.getSteps().stream()
                    .filter(s -> s.getSequence() < step.getSequence())
                    .allMatch(s -> s.getActions().stream()
                            .anyMatch(a -> a.getDecision() == ApprovalDecision.APPROVED));
            if (allStepsCompleted && step.getSequence() == workflow.getSteps().size()) {
                workflow.setStatus(WorkflowStatus.COMPLETED);
                workflowRepository.save(workflow);
            } else if (workflow.getStatus() == WorkflowStatus.CREATED) {
                workflow.setStatus(WorkflowStatus.RUNNING);
                workflowRepository.save(workflow);
            }
        } else if (request.getDecision() == ApprovalDecision.REJECTED) {
            workflow.setStatus(WorkflowStatus.COMPLETED);
            workflowRepository.save(workflow);
        }

        return toActionResponse(action);
    }

    private WorkflowResponse toResponse(Workflow wf) {
        return WorkflowResponse.builder()
                .id(wf.getId())
                .name(wf.getName())
                .status(wf.getStatus())
                .relatedEntityType(wf.getRelatedEntityType())
                .relatedEntityId(wf.getRelatedEntityId())
                .steps(wf.getSteps().stream().map(this::toStepResponse).collect(Collectors.toSet()))
                .build();
    }

    private WorkflowStepResponse toStepResponse(WorkflowStep step) {
        return WorkflowStepResponse.builder()
                .id(step.getId())
                .name(step.getName())
                .sequence(step.getSequence())
                .actions(step.getActions().stream().map(this::toActionResponse).collect(Collectors.toSet()))
                .build();
    }

    private WorkflowActionResponse toActionResponse(WorkflowAction action) {
        return WorkflowActionResponse.builder()
                .id(action.getId())
                .type(action.getType())
                .decision(action.getDecision())
                .comment(action.getComment())
                .remarks(action.getRemarks())
                .performedAt(action.getPerformedAt())
                .performedById(action.getPerformedBy() != null ? action.getPerformedBy().getId() : null)
                .performedByName(action.getPerformedBy() != null ? action.getPerformedBy().getEmail() : null)
                .build();
    }
}
