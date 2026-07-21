package tn.steg.backend.workflows.service;

import tn.steg.backend.workflows.dto.*;

import java.util.UUID;

public interface WorkflowService {
    WorkflowResponse getWorkflowById(UUID id);
    WorkflowResponse createWorkflow(CreateWorkflowRequest request);
    WorkflowActionResponse executeAction(ExecuteActionRequest request, UUID userId);
}
