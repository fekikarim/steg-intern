import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn, TableSortState } from '../../shared/components/table/table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { InternshipsService } from '../../core/services/internships.service';
import { CandidatesService } from '../../core/services/candidates.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { Page, Pageable } from '../../core/models/api.model';
import { CreateInternshipRequest, InternshipResponse, InternshipStatus } from '../../core/models/internship.model';

type InternshipAction = 'activate' | 'complete' | 'cancel' | 'archive';

@Component({
  selector: 'steg-internship-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    PaginationComponent,
    ModalComponent,
    FieldComponent,
    SelectComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Internships"
      subtitle="Create and manage the internship lifecycle"
      [crumbs]="[{ label: 'Internships' }]"
    >
      <div class="toolbar" [formGroup]="filterForm">
        <steg-input
          class="search-input"
          type="search"
          formControlName="search"
          id="internship-search"
          placeholder="Search reference or candidate…"
        />
      </div>
      <steg-button variant="primary" label="New internship" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Status">
        <steg-select id="status-filter" formControlName="status" [options]="statusOptions" />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load internships"
          [message]="errorMessage()"
          (retry)="load()"
        />
      </div>
    } @else {
      <steg-table
        [columns]="columns"
        [rows]="page()?.content ?? []"
        [loading]="loading()"
        [sort]="sort()"
        (sortChange)="onSort($event)"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="success" size="sm" label="Start" [disabled]="row.status !== 'PLANNED'" (click)="run('activate', row)" />
          <steg-button variant="ghost" size="sm" label="Complete" [disabled]="row.status !== 'ACTIVE'" (click)="run('complete', row)" />
          <steg-button variant="ghost" size="sm" label="Archive" [disabled]="row.status !== 'COMPLETED'" (click)="run('archive', row)" />
          <steg-button variant="danger" size="sm" label="Cancel" [disabled]="row.status !== 'PLANNED' && row.status !== 'ACTIVE'" (click)="run('cancel', row)" />
        </ng-template>
      </steg-table>

      <steg-pagination [page]="page()" (pageChange)="onPageChange($event)" />

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="internships"
            title="No internships found"
            message="Try adjusting the search or filters, or create a new internship."
          />
        </div>
      }
    }

    <steg-modal [open]="showModal()" title="Create internship" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <steg-field label="Candidate" [required]="true" [invalid]="fieldInvalid('candidateId')" [error]="fieldError('candidateId')">
            <steg-select
              formControlName="candidateId"
              id="internship-candidate"
              name="candidate"
              placeholder="Select a candidate"
              [invalid]="fieldInvalid('candidateId')"
              [options]="candidateOptions()"
            />
          </steg-field>
          <steg-field label="Start date" [required]="true" [invalid]="fieldInvalid('startDate')" [error]="fieldError('startDate')">
            <input id="internship-start" formControlName="startDate" type="date" name="startDate" class="native-input" [class.invalid]="fieldInvalid('startDate')" />
          </steg-field>
          <steg-field label="End date" [required]="true" [invalid]="fieldInvalid('endDate')" [error]="fieldError('endDate')">
            <input id="internship-end" formControlName="endDate" type="date" name="endDate" class="native-input" [class.invalid]="fieldInvalid('endDate')" />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" label="Create internship" [loading]="submitting()" [disabled]="form.invalid" />
        </div>
      </form>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .toolbar {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .filters {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
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
      .native-input.invalid {
        border-color: var(--color-danger, #dc2626);
      }
      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
        .search-input {
          width: 100%;
        }
        .filters {
          flex-direction: column;
        }
        .filters steg-field {
          width: 100%;
        }
      }
      ::ng-deep .table-wrap .row-actions {
        display: flex;
      }
    `
  ]
})
export class InternshipListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly internships = inject(InternshipsService);
  private readonly candidates = inject(CandidatesService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load internships.');
  protected readonly page = signal<Page<InternshipResponse> | null>(null);
  protected readonly sort = signal<TableSortState | null>(null);
  protected readonly candidatesList = signal<Array<{ id: string; name: string }>>([]);
  protected readonly showModal = signal(false);
  protected readonly submitting = signal(false);

  private readonly pageable: Pageable = { page: 0, size: 10 };

  protected readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    status: ['' as InternshipStatus | '']
  });

  protected readonly statusOptions: SelectOption[] = [
    { value: '', label: 'All statuses' },
    { value: 'PLANNED', label: 'Planned' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
    { value: 'ARCHIVED', label: 'Archived' }
  ];

  protected readonly columns: TableColumn<InternshipResponse>[] = [
    { key: 'reference', label: 'Reference', sortable: true },
    { key: 'candidateName', label: 'Candidate', sortable: true },
    { key: 'startDate', label: 'Start', sortable: true },
    { key: 'endDate', label: 'End', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: InternshipResponse): string => row.id;

  protected readonly candidateOptions = () =>
    this.candidatesList().map<SelectOption>((c) => ({ value: c.id, label: c.name }));

  protected readonly form = this.fb.nonNullable.group({
    candidateId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required]
  });

  constructor() {
    this.loadCandidates();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => {
        this.pageable.page = 0;
        this.load();
      });
    this.load();
  }

  private loadCandidates(): void {
    this.candidates
      .getAll({ page: 0, size: 100 })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) =>
          this.candidatesList.set(
            data.content.map((c) => ({ id: c.id, name: `${c.firstName} ${c.lastName}` }))
          ),
        error: () => this.candidatesList.set([])
      });
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    const s = this.sort();
    this.pageable.sort = s ? `${s.key},${s.direction}` : undefined;
    this.internships
      .getAll(this.pageable, { search: v.search || undefined, status: v.status })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load internships.');
          this.toast.error('Internships load failed', this.errorMessage());
        }
      });
  }

  protected onPageChange(page: number): void {
    this.pageable.page = page;
    this.load();
  }

  protected onSort(sort: TableSortState): void {
    this.sort.set(sort);
    this.pageable.page = 0;
    this.load();
  }

  protected openCreate(): void {
    this.form.reset();
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected async run(action: InternshipAction, it: InternshipResponse): Promise<void> {
    try {
      if (action === 'activate') {
        const ok = await this.confirm.confirm({
          title: 'Start internship?',
          message: `${it.reference} (${it.candidateName}) will become active.`,
          confirmText: 'Start'
        });
        if (!ok) {
          return;
        }
        await this.internships.updateStatus(it.id, 'ACTIVE').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Internship started', it.reference);
        this.load();
        return;
      }
      if (action === 'complete') {
        const ok = await this.confirm.confirm({
          title: 'Complete internship?',
          message: `${it.reference} (${it.candidateName}) will be marked completed.`,
          confirmText: 'Complete'
        });
        if (!ok) {
          return;
        }
        await this.internships.updateStatus(it.id, 'COMPLETED').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Internship completed', it.reference);
        this.load();
        return;
      }
      if (action === 'archive') {
        const ok = await this.confirm.confirm({
          title: 'Archive internship?',
          message: `${it.reference} will be archived permanently.`,
          confirmText: 'Archive'
        });
        if (!ok) {
          return;
        }
        await this.internships.updateStatus(it.id, 'ARCHIVED').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Internship archived', it.reference);
        this.load();
        return;
      }
      if (action === 'cancel') {
        const ok = await this.confirm.confirm({
          title: 'Cancel internship?',
          message: `${it.reference} (${it.candidateName}) will be cancelled.`,
          danger: true,
          confirmText: 'Cancel'
        });
        if (!ok) {
          return;
        }
        await this.internships.updateStatus(it.id, 'CANCELLED').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Internship cancelled', it.reference);
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
    const v = this.form.value as { candidateId: string; startDate: string; endDate: string };
    const request: CreateInternshipRequest = {
      candidateId: v.candidateId,
      startDate: v.startDate,
      endDate: v.endDate
    };
    this.internships
      .create(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.showModal.set(false);
          this.toast.success('Internship created', v.candidateId);
          this.load();
        },
        error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
          const msg = error.fieldErrors
            ? Object.values(error.fieldErrors).join(' ')
            : (error.message ?? 'Could not create internship.');
          this.toast.error('Save failed', msg);
        }
      });
  }

  protected fieldInvalid(field: 'candidateId' | 'startDate' | 'endDate'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'candidateId' | 'startDate' | 'endDate'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    return control.hasError('required') ? 'This field is required.' : undefined;
  }
}
