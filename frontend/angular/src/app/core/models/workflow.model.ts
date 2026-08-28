export type WorkflowStatus = 'CREATED' | 'RUNNING' | 'COMPLETED' | 'ARCHIVED';
export type WorkflowActionType = 'APPROVAL' | 'VALIDATION';
export type ApprovalDecision = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED';

export interface WorkflowActionResponse {
  id: string;
  type: WorkflowActionType;
  decision: ApprovalDecision;
  comment?: string;
  remarks?: string;
  performedAt?: string;
  performedById?: string | null;
  performedByName?: string;
}

export interface WorkflowStepResponse {
  id: string;
  name: string;
  sequence: number;
  actions: WorkflowActionResponse[];
}

export interface WorkflowResponse {
  id: string;
  name: string;
  status: WorkflowStatus;
  relatedEntityType?: string;
  relatedEntityId?: string;
  steps: WorkflowStepResponse[];
}

export interface CreateWorkflowRequest {
  name: string;
  relatedEntityType: string;
  relatedEntityId: string;
  stepNames: string[];
}

export interface ExecuteActionRequest {
  stepId: string;
  type: WorkflowActionType;
  decision: ApprovalDecision;
  comment?: string;
}
