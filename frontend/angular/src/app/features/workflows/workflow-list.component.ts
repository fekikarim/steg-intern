import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { WorkflowsService } from '../../core/services/workflows.service';
import { ToastService } from '../../core/services/toast.service';
import {
  WorkflowResponse,
  WorkflowStatus,
  WorkflowActionType,
  ApprovalDecision,
  CreateWorkflowRequest,
  ExecuteActionRequest,
  WorkflowStepResponse
} from '../../core/models/workflow.model';

const ENTITY_TYPES: SelectOption[] = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'APPLICATION', label: 'Application' },
  { value: 'CANDIDATE', label: 'Candidate' },
  { value: 'ASSIGNMENT', label: 'Assignment' }
];

const STATUS_LABELS: Record<WorkflowStatus, string> = {
  CREATED: 'Created',
  RUNNING: 'Running',
  COMPLETED: 'Completed',
  ARCHIVED: 'Archived'
};

const DECISION_LABELS: Record<ApprovalDecision, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  RETURNED: 'Returned'
};

const DECISION_OPTIONS: SelectOption<ApprovalDecision>[] = [
  { value: 'APPROVED', label: 'Approve' },
  { value: 'REJECTED', label: 'Reject' },
  { value: 'RETURNED', label: 'Return' }
];

@Component({
  selector: 'steg-workflow-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    ModalComponent,
    FieldComponent,
    SelectComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Workflows"
      subtitle="Track validation and approval workflows across entities"
      [crumbs]="[{ label: 'Workflows' }]"
    >
      <steg-button variant="primary" label="New workflow" icon="+" (click)="openCreate()" />
    </steg-page-header>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load workflows"
          [message]="errorMessage()"
          (retry)="load()"
        />
      </div>
    } @else {
      <steg-table
        [columns]="columns"
        [rows]="workflows()"
        [loading]="loading()"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="ghost" size="sm" label="View" (click)="openDetail(row)" />
          <steg-button
            variant="primary"
            size="sm"
            label="Execute"
            [disabled]="row.status === 'COMPLETED' || row.status === 'ARCHIVED'"
            (click)="openDetail(row)"
          />
        </ng-template>
      </steg-table>

      @if (!loading() && workflows().length === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="🔄"
            title="No workflows found"
            message="Create a workflow to route validation and approvals."
          />
        </div>
      }
    }

    <steg-modal [open]="showCreate()" title="Create workflow" (dismissed)="closeCreate()">
      <form [formGroup]="createForm" (ngSubmit)="save()" novalidate>
        <div class="form-stack">
          <steg-field label="Name" [required]="true" [invalid]="createInvalid('name')" [error]="createError('name')">
            <input
              id="wf-name"
              formControlName="name"
              type="text"
              name="name"
              class="native-input"
              placeholder="e.g. Internship signing workflow"
            />
          </steg-field>

          <div class="form-grid">
            <steg-field label="Entity type" [required]="true">
              <steg-select
                formControlName="relatedEntityType"
                id="wf-entity-type"
                [options]="entityTypeOptions"
              />
            </steg-field>
            <steg-field label="Entity ID" [required]="true" [invalid]="createInvalid('relatedEntityId')" [error]="createError('relatedEntityId')">
              <input
                id="wf-entity-id"
                formControlName="relatedEntityId"
                type="text"
                name="relatedEntityId"
                class="native-input"
                placeholder="UUID of the related entity"
              />
            </steg-field>
          </div>

          <steg-field label="Steps (one per line, in order)">
            <textarea
              id="wf-steps"
              formControlName="stepsText"
              name="stepsText"
              class="native-input textarea"
              rows="4"
              placeholder="Validation&#10;Manager approval&#10;HR sign-off"
            ></textarea>
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeCreate()" />
          <steg-button type="submit" variant="primary" label="Create workflow" [loading]="submitting()" [disabled]="createForm.invalid" />
        </div>
      </form>
    </steg-modal>

    <steg-modal
      [open]="detail() !== null"
      [title]="detail() ? detail()!.name : ''"
      size="lg"
      (dismissed)="closeDetail()"
    >
      @if (detail(); as wf) {
        <form [formGroup]="executeForm" novalidate>
          <div class="detail-header">
            <span class="badge">{{ STATUS_LABELS[wf.status] }}</span>
            <span class="muted">{{ wf.relatedEntityType ?? '—' }} · {{ wf.relatedEntityId ?? '—' }}</span>
          </div>

          <div class="steps">
            @for (step of orderedSteps(wf); track step.id) {
              <div class="step" [formGroupName]="step.id">
                <div class="step-head">
                  <span class="step-seq">{{ step.sequence }}</span>
                  <strong class="step-name">{{ step.name }}</strong>
                </div>
                @if (step.actions.length) {
                  <div class="actions">
                    @for (act of step.actions; track act.id) {
                      <div class="action">
                        <span class="decision" [class.decision-bad]="act.decision === 'REJECTED'">{{ DECISION_LABELS[act.decision] }}</span>
                        <span class="type">{{ act.type === 'APPROVAL' ? 'Approval' : 'Validation' }}</span>
                        <span class="who">{{ act.performedByName ?? '—' }}</span>
                        @if (act.comment) {
                          <span class="comment">“{{ act.comment }}”</span>
                        }
                      </div>
                    }
                  </div>
                }
                @if (wf.status !== 'COMPLETED' && wf.status !== 'ARCHIVED') {
                  <div class="execute-row">
                    <steg-select
                      id="step-{{ step.id }}"
                      name="step"
                      formControlName="decision"
                      [options]="decisionOptions"
                    />
                    <input
                      class="native-input comment"
                      type="text"
                      formControlName="comment"
                      placeholder="Comment (optional)"
                    />
                    <steg-button variant="primary" size="sm" label="Submit" [loading]="stepSubmitting() === step.id" (click)="submitAction(step)" />
                  </div>
                }
              </div>
            }
          </div>
        </form>
      }
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .panel {
        padding: 1.25rem;
      }
      .form-stack,
      .form-grid {
        display: grid;
        gap: 1rem;
      }
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
      .native-input {
        width: 100%;
        padding: 0.55rem 0.75rem;
        border: 1px solid var(--color-border, #d1d5db);
        border-radius: var(--radius-md, 0.5rem);
        background: var(--color-surface, #fff);
        color: var(--color-text, #111827);
        font-size: 0.875rem;
      }
      .textarea {
        resize: vertical;
        font-family: inherit;
      }
      .detail-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }
      .badge {
        padding: 0.2rem 0.6rem;
        border-radius: 999px;
        background: var(--color-primary-soft, #eef2ff);
        color: var(--color-primary, #4f46e5);
        font-size: 0.75rem;
        font-weight: 600;
      }
      .muted {
        color: var(--color-text-muted, #6b7280);
        font-size: 0.8125rem;
      }
      .steps {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .step {
        border: 1px solid var(--color-border, #e5e7eb);
        border-radius: var(--radius-md, 0.5rem);
        padding: 0.875rem 1rem;
      }
      .step-head {
        display: flex;
        align-items: center;
        gap: 0.625rem;
      }
      .step-seq {
        width: 1.5rem;
        height: 1.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        background: var(--color-surface-alt, #f3f4f6);
        color: var(--color-text-secondary, #4b5563);
        font-size: 0.75rem;
        font-weight: 700;
      }
      .step-name {
        font-size: 0.875rem;
      }
      .actions {
        margin: 0.625rem 0 0 2.125rem;
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .action {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8125rem;
        color: var(--color-text-secondary, #4b5563);
      }
      .decision {
        padding: 0.1rem 0.5rem;
        border-radius: 999px;
        background: var(--color-success-soft, #ecfdf5);
        color: var(--color-success, #059669);
        font-weight: 600;
      }
      .decision-bad {
        background: var(--color-danger-soft, #fef2f2);
        color: var(--color-danger, #dc2626);
      }
      .type {
        font-weight: 500;
      }
      .comment {
        font-style: italic;
        color: var(--color-text-muted, #6b7280);
      }
      .execute-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.75rem 0 0 2.125rem;
        align-items: center;
      }
      .execute-row steg-select {
        min-width: 8rem;
      }
      .execute-row .comment {
        flex: 1;
        min-width: 10rem;
        font-style: normal;
      }
      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
      ::ng-deep .table-wrap .row-actions {
        display: flex;
      }
    `
  ]
})
export class WorkflowListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly workflowsSvc = inject(WorkflowsService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load workflows.');
  protected readonly workflows = signal<WorkflowResponse[]>([]);
  protected readonly showCreate = signal(false);
  protected readonly submitting = signal(false);
  protected readonly stepSubmitting = signal<string | null>(null);
  protected readonly detail = signal<WorkflowResponse | null>(null);

  protected readonly entityTypeOptions = ENTITY_TYPES;
  protected readonly decisionOptions = DECISION_OPTIONS;
  protected readonly STATUS_LABELS = STATUS_LABELS;
  protected readonly DECISION_LABELS = DECISION_LABELS;

  protected readonly createForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    relatedEntityType: ['INTERNSHIP', Validators.required],
    relatedEntityId: ['', Validators.required],
    stepsText: ['']
  });

  protected executeForm = this.fb.group({});

  protected readonly columns: TableColumn<WorkflowResponse>[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'relatedEntityType', label: 'Entity type' },
    { key: 'relatedEntityId', label: 'Entity ID' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: WorkflowResponse): string => row.id;

  protected orderedSteps(wf: WorkflowResponse): WorkflowStepResponse[] {
    return [...(wf.steps ?? [])].sort((a, b) => a.sequence - b.sequence);
  }

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.workflowsSvc
      .getAll()
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.workflows.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load workflows.');
          this.toast.error('Workflows load failed', this.errorMessage());
        }
      });
  }

  protected openCreate(): void {
    this.createForm.reset({ relatedEntityType: 'INTERNSHIP' });
    this.showCreate.set(true);
  }

  protected closeCreate(): void {
    this.showCreate.set(false);
  }

  protected async openDetail(wf: WorkflowResponse): Promise<void> {
    const target = await this.workflowsSvc.getById(wf.id).pipe(takeUntilDestroyed()).toPromise();
    if (!target) {
      return;
    }
    this.detail.set(target);
    const groups: Record<string, FormGroup> = {};
    for (const step of target.steps ?? []) {
      groups[step.id] = this.fb.nonNullable.group({
        decision: ['APPROVED' as ApprovalDecision],
        comment: ['']
      });
    }
    this.executeForm = this.fb.group(groups);
  }

  protected closeDetail(): void {
    this.detail.set(null);
    this.executeForm = this.fb.group({});
  }

  protected submitAction(step: WorkflowStepResponse): void {
    if (this.stepSubmitting()) {
      return;
    }
    const group = this.executeForm.get(step.id);
    if (!group) {
      return;
    }
    const v = group.getRawValue() as { decision: ApprovalDecision; comment: string };
    const wf = this.detail();
    if (!wf) {
      return;
    }
    const request: ExecuteActionRequest = {
      stepId: step.id,
      type: 'APPROVAL' as WorkflowActionType,
      decision: v.decision,
      comment: v.comment || undefined
    };
    this.stepSubmitting.set(step.id);
    this.workflowsSvc
      .executeAction(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.stepSubmitting.set(null)))
      .subscribe({
        next: () => {
          this.toast.success('Action recorded', `Step ${step.sequence} updated`);
          void this.refreshDetail(wf);
        },
        error: (error: { message?: string }) => {
          this.toast.error('Action failed', error.message ?? 'Could not execute action.');
        }
      });
  }

  private async refreshDetail(wf: WorkflowResponse): Promise<void> {
    try {
      const fresh = await this.workflowsSvc.getById(wf.id).pipe(takeUntilDestroyed()).toPromise();
      if (!fresh) {
        this.closeDetail();
        this.load();
        return;
      }
      this.detail.set(fresh);
    } catch {
      this.closeDetail();
      this.load();
    }
  }

  protected save(): void {
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid || this.submitting()) {
      return;
    }
    const v = this.createForm.getRawValue();
    const request: CreateWorkflowRequest = {
      name: v.name,
      relatedEntityType: v.relatedEntityType,
      relatedEntityId: v.relatedEntityId,
      stepNames: v.stepsText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    };
    this.submitting.set(true);
    this.workflowsSvc
      .create(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.showCreate.set(false);
          this.toast.success('Workflow created', v.name);
          this.load();
        },
        error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
          const msg = error.fieldErrors
            ? Object.values(error.fieldErrors).join(' ')
            : (error.message ?? 'Could not create workflow.');
          this.toast.error('Save failed', msg);
        }
      });
  }

  protected createInvalid(field: 'name' | 'relatedEntityId'): boolean {
    const control = this.createForm.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected createError(field: 'name' | 'relatedEntityId'): string | undefined {
    const control = this.createForm.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    return control.hasError('required') ? 'This field is required.' : undefined;
  }
}
