package tn.steg.backend.workflows.service;

import tn.steg.backend.workflows.dto.*;

import java.util.List;
import java.util.UUID;

public interface WorkflowService {
    List<WorkflowResponse> getAllWorkflows();
    WorkflowResponse getWorkflowById(UUID id);
    WorkflowResponse createWorkflow(CreateWorkflowRequest request);
    WorkflowActionResponse executeAction(ExecuteActionRequest request, UUID userId);
}
