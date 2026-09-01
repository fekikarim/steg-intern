import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AssignmentsService } from '../../core/services/assignments.service';
import { InternshipsService } from '../../core/services/internships.service';
import { DepartmentsService } from '../../core/services/departments.service';
import { SupervisorsService } from '../../core/services/supervisors.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { AssignmentResponse, AssignmentStatus, CreateAssignmentRequest } from '../../core/models/internship.model';
import { DepartmentResponse } from '../../core/models/admin.model';

type AssignmentAction = 'end' | 'reassign' | 'cancel' | 'delete';

@Component({
  selector: 'steg-assignment-list',
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
      title="Assignments"
      subtitle="Assign internships to departments and supervisors"
      [crumbs]="[{ label: 'Assignments' }]"
    >
      <steg-button variant="primary" label="New assignment" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <div class="search-wrap">
        <input
          class="search-input"
          type="search"
          id="assignment-search"
          placeholder="Search reference, supervisor or status…"
          [value]="searchQuery()"
          (input)="onSearchInput($event)"
        />
      </div>
      <steg-field label="Status">
        <steg-select id="status-filter" formControlName="status" [options]="statusOptions" />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load assignments"
          [message]="errorMessage()"
          (retry)="load()"
        />
      </div>
    } @else {
      <steg-table
        [columns]="columns"
        [rows]="filteredAssignments()"
        [loading]="loading()"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="ghost" size="sm" label="End" [disabled]="row.status !== 'ACTIVE'" (click)="run('end', row)" />
          <steg-button variant="ghost" size="sm" label="Reassign" [disabled]="row.status !== 'ACTIVE'" (click)="run('reassign', row)" />
          <steg-button variant="ghost" size="sm" label="Cancel" [disabled]="row.status !== 'ACTIVE'" (click)="run('cancel', row)" />
          <steg-button variant="danger" size="sm" label="Delete" (click)="run('delete', row)" />
        </ng-template>
      </steg-table>

      @if (!loading() && filteredAssignments().length === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="assignments"
            title="No assignments found"
            message="Create an assignment to link an internship to a supervisor."
          />
        </div>
      }
    }

    <steg-modal [open]="showModal()" title="Create assignment" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <steg-field label="Internship" [required]="true" [invalid]="fieldInvalid('internshipId')" [error]="fieldError('internshipId')">
            <steg-select
              formControlName="internshipId"
              id="assignment-internship"
              name="internship"
              placeholder="Select an internship"
              [invalid]="fieldInvalid('internshipId')"
              [options]="internshipOptions()"
            />
          </steg-field>
          <steg-field label="Department" [required]="true" [invalid]="fieldInvalid('departmentId')" [error]="fieldError('departmentId')">
            <steg-select
              formControlName="departmentId"
              id="assignment-department"
              name="department"
              placeholder="Select a department"
              [invalid]="fieldInvalid('departmentId')"
              [options]="departmentOptions()"
            />
          </steg-field>
          <steg-field label="Supervisor" [required]="true" [invalid]="fieldInvalid('supervisorId')" [error]="fieldError('supervisorId')">
            <steg-select
              formControlName="supervisorId"
              id="assignment-supervisor"
              name="supervisor"
              placeholder="Select a supervisor"
              [invalid]="fieldInvalid('supervisorId')"
              [options]="supervisorOptions()"
            />
          </steg-field>
          <steg-field label="Assignment date">
            <input id="assignment-date" formControlName="assignmentDate" type="date" name="assignmentDate" class="native-input" />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" label="Create assignment" [loading]="submitting()" [disabled]="form.invalid" />
        </div>
      </form>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .filters {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
        align-items: flex-end;
      }
      .search-wrap {
        flex: 1;
        min-width: 12rem;
      }
      .search-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        border: 1px solid var(--color-border, #d1d5db);
        border-radius: var(--radius-md, 0.5rem);
        background: var(--color-surface, #fff);
        color: var(--color-text, #111827);
        font-size: 0.875rem;
      }
      .filters steg-field {
        width: 13rem;
      }
      .panel {
        padding: 1.25rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
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
      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
        .filters {
          flex-direction: column;
        }
        .filters steg-field {
          width: 100%;
        }
        .search-wrap {
          width: 100%;
          min-width: 0;
        }
      }
      ::ng-deep .table-wrap .row-actions {
        display: flex;
      }
    `
  ]
})
export class AssignmentListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly assignmentsSvc = inject(AssignmentsService);
  private readonly internships = inject(InternshipsService);
  private readonly departments = inject(DepartmentsService);
  private readonly supervisors = inject(SupervisorsService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load assignments.');
  protected readonly assignments = signal<AssignmentResponse[]>([]);
  protected readonly searchQuery = signal('');
  protected readonly filteredAssignments = computed<AssignmentResponse[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return this.assignments();
    }
    return this.assignments().filter((a) =>
      [a.internshipReference, a.supervisorName, a.departmentName, a.status]
        .some((value) => value.toLowerCase().includes(q))
    );
  });
  protected readonly internshipsList = signal<Array<{ id: string; label: string }>>([]);
  protected readonly departmentList = signal<Array<{ id: string; label: string }>>([]);
  protected readonly supervisorList = signal<Array<{ id: string; label: string }>>([]);
  protected readonly showModal = signal(false);
  protected readonly submitting = signal(false);

  protected readonly filterForm = this.fb.nonNullable.group({
    status: ['' as AssignmentStatus | '']
  });

  protected readonly statusOptions: SelectOption[] = [
    { value: '', label: 'All statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'ENDED', label: 'Ended' },
    { value: 'REASSIGNED', label: 'Reassigned' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  protected readonly columns: TableColumn<AssignmentResponse>[] = [
    { key: 'internshipReference', label: 'Internship' },
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'departmentName', label: 'Department' },
    { key: 'assignmentDate', label: 'Assigned on' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: AssignmentResponse): string => row.id;

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected readonly internshipOptions = () =>
    this.internshipsList().map<SelectOption>((i) => ({ value: i.id, label: i.label }));

  protected readonly departmentOptions = () =>
    this.departmentList().map<SelectOption>((d) => ({ value: d.id, label: d.label }));

  protected readonly supervisorOptions = () =>
    this.supervisorList().map<SelectOption>((s) => ({ value: s.id, label: s.label }));

  protected readonly form = this.fb.nonNullable.group({
    internshipId: ['', Validators.required],
    departmentId: ['', Validators.required],
    supervisorId: ['', Validators.required],
    assignmentDate: ['']
  });

  constructor() {
    this.loadLookups();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => this.load());
    this.load();
  }

  private loadLookups(): void {
    this.internships
      .getAll({ page: 0, size: 100 })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) =>
          this.internshipsList.set(
            data.content.map((i) => ({ id: i.id, label: `${i.reference} — ${i.candidateName}` }))
          ),
        error: () => this.internshipsList.set([])
      });
    this.departments
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (depts) => this.departmentList.set(flattenDepartments(depts)),
        error: () => this.departmentList.set([])
      });
    this.supervisors
      .getAll({ page: 0, size: 100 })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) =>
          this.supervisorList.set(
            data.content.map((s) => ({ id: s.id, label: `${s.firstName} ${s.lastName}${s.departmentName ? ` (${s.departmentName})` : ''}` }))
          ),
        error: () => this.supervisorList.set([])
      });
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    this.assignmentsSvc
      .getAll(v.status)
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.assignments.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load assignments.');
          this.toast.error('Assignments load failed', this.errorMessage());
        }
      });
  }

  protected openCreate(): void {
    this.form.reset();
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected async run(action: AssignmentAction, a: AssignmentResponse): Promise<void> {
    try {
      if (action === 'end') {
        const ok = await this.confirm.confirm({
          title: 'End assignment?',
          message: `${a.internshipReference} assignment to ${a.supervisorName} will be ended.`,
          confirmText: 'End'
        });
        if (!ok) {
          return;
        }
        await this.assignmentsSvc.updateStatus(a.id, 'ENDED').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Assignment ended', a.internshipReference);
        this.load();
        return;
      }
      if (action === 'reassign') {
        const ok = await this.confirm.confirm({
          title: 'Reassign?',
          message: `${a.internshipReference} will be marked reassigned for ${a.supervisorName}.`,
          confirmText: 'Reassign'
        });
        if (!ok) {
          return;
        }
        await this.assignmentsSvc.updateStatus(a.id, 'REASSIGNED').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Assignment reassigned', a.internshipReference);
        this.load();
        return;
      }
      if (action === 'cancel') {
        const ok = await this.confirm.confirm({
          title: 'Cancel assignment?',
          message: `${a.internshipReference} assignment will be cancelled.`,
          danger: true,
          confirmText: 'Cancel'
        });
        if (!ok) {
          return;
        }
        await this.assignmentsSvc.updateStatus(a.id, 'CANCELLED').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Assignment cancelled', a.internshipReference);
        this.load();
        return;
      }
      if (action === 'delete') {
        const ok = await this.confirm.confirm({
          title: 'Delete assignment?',
          message: `${a.internshipReference} assignment will be permanently removed.`,
          danger: true,
          confirmText: 'Delete'
        });
        if (!ok) {
          return;
        }
        await this.assignmentsSvc.delete(a.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Assignment deleted', a.internshipReference);
        this.load();
      }
    } catch (error) {
      this.toast.error('Action failed', (error as { message?: string }).message ?? 'An unexpected error occurred.');
    }
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const v = this.form.value as {
      internshipId: string;
      departmentId: string;
      supervisorId: string;
      assignmentDate: string;
    };
    const request: CreateAssignmentRequest = {
      internshipId: v.internshipId,
      departmentId: v.departmentId,
      supervisorId: v.supervisorId,
      assignmentDate: v.assignmentDate || undefined
    };
    this.assignmentsSvc
      .create(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.showModal.set(false);
          this.toast.success('Assignment created', v.internshipId);
          this.load();
        },
        error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
          const msg = error.fieldErrors
            ? Object.values(error.fieldErrors).join(' ')
            : (error.message ?? 'Could not create assignment.');
          this.toast.error('Save failed', msg);
        }
      });
  }

  protected fieldInvalid(field: 'internshipId' | 'departmentId' | 'supervisorId'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'internshipId' | 'departmentId' | 'supervisorId'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    return control.hasError('required') ? 'This field is required.' : undefined;
  }
}

function flattenDepartments(depts: DepartmentResponse[], depth = 0): Array<{ id: string; label: string }> {
  const result: Array<{ id: string; label: string }> = [];
  for (const d of depts) {
    result.push({ id: d.id, label: `${'\u00A0\u00A0'.repeat(depth)}${d.name}` });
    if (d.children?.length) {
      result.push(...flattenDepartments(d.children, depth + 1));
    }
  }
  return result;
}
