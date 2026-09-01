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
import { ApplicationsService } from '../../core/services/applications.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { Page, Pageable } from '../../core/models/api.model';
import { ApplicationResponse, ApplicationStatus, CreateApplicationRequest } from '../../core/models/internship.model';

type ApplicationAction = 'submit' | 'review' | 'accept' | 'reject' | 'delete';

@Component({
  selector: 'steg-application-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    PaginationComponent,
    ModalComponent,
    FieldComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Applications"
      subtitle="Review, accept and reject internship applications"
      [crumbs]="[{ label: 'Applications' }]"
    >
      <div class="toolbar" [formGroup]="filterForm">
        <steg-input
          class="search-input"
          type="search"
          formControlName="search"
          id="application-search"
          placeholder="Search reference or candidate…"
        />
      </div>
      <steg-button variant="primary" label="New application" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Status">
        <steg-select id="status-filter" formControlName="status" [options]="statusOptions" />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load applications"
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
          <steg-button variant="ghost" size="sm" label="Submit" [disabled]="row.status !== 'DRAFT'" (click)="run('submit', row)" />
          <steg-button variant="ghost" size="sm" label="Review" [disabled]="row.status !== 'SUBMITTED'" (click)="run('review', row)" />
          <steg-button variant="success" size="sm" label="Accept" [disabled]="!canAccept(row.status)" (click)="run('accept', row)" />
          <steg-button variant="danger" size="sm" label="Reject" [disabled]="!canReject(row.status)" (click)="run('reject', row)" />
        </ng-template>
      </steg-table>

      <steg-pagination [page]="page()" (pageChange)="onPageChange($event)" />

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="applications"
            title="No applications found"
            message="Try adjusting the search or filters, or register a new application."
          />
        </div>
      }
    }

    <steg-modal [open]="showModal()" title="New application (manual entry)" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <p class="modal-hint">
          Register an application received directly (physical submission). Candidate details are
          created inline and converge into the same workflow as online applications.
        </p>
        <div class="form-grid">
          <steg-field label="First name" [required]="true" [invalid]="fieldInvalid('firstName')" [error]="fieldError('firstName')">
            <steg-input formControlName="firstName" type="text" id="app-firstName" name="firstName" placeholder="First name" [invalid]="fieldInvalid('firstName')" />
          </steg-field>
          <steg-field label="Last name" [required]="true" [invalid]="fieldInvalid('lastName')" [error]="fieldError('lastName')">
            <steg-input formControlName="lastName" type="text" id="app-lastName" name="lastName" placeholder="Last name" [invalid]="fieldInvalid('lastName')" />
          </steg-field>
          <steg-field label="Email" [required]="true" [invalid]="fieldInvalid('contactEmail')" [error]="fieldError('contactEmail')">
            <steg-input formControlName="contactEmail" type="email" id="app-email" name="contactEmail" autocomplete="off" placeholder="name@example.com" [invalid]="fieldInvalid('contactEmail')" />
          </steg-field>
          <steg-field label="CIN">
            <steg-input formControlName="nationalId" type="text" id="app-nationalId" name="nationalId" placeholder="National ID" />
          </steg-field>
          <steg-field label="Phone">
            <steg-input formControlName="phone" type="tel" id="app-phone" name="phone" placeholder="+216 ..." />
          </steg-field>
          <steg-field label="University">
            <steg-input formControlName="university" type="text" id="app-university" name="university" placeholder="University" />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" label="Create application" [loading]="submitting()" [disabled]="form.invalid" />
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
      .modal-hint {
        font-size: 0.8125rem;
        color: var(--color-text-muted);
        margin: 0 0 1rem;
      }
      .panel {
        padding: 1.25rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
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
export class ApplicationListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly applications = inject(ApplicationsService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load applications.');
  protected readonly page = signal<Page<ApplicationResponse> | null>(null);
  protected readonly sort = signal<TableSortState | null>(null);
  protected readonly showModal = signal(false);
  protected readonly submitting = signal(false);

  private readonly pageable: Pageable = { page: 0, size: 10 };

  protected readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    status: ['' as ApplicationStatus | '']
  });

  protected readonly statusOptions: SelectOption[] = [
    { value: '', label: 'All statuses' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under review' },
    { value: 'ACCEPTED', label: 'Accepted' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  protected readonly columns: TableColumn<ApplicationResponse>[] = [
    { key: 'reference', label: 'Reference', sortable: true },
    { key: 'candidateName', label: 'Candidate', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'submittedOnline', label: 'Source' },
    { key: 'submissionDate', label: 'Submission date', sortable: true },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: ApplicationResponse): string => row.id;

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    nationalId: [''],
    phone: [''],
    university: ['']
  });

  constructor() {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => {
        this.pageable.page = 0;
        this.load();
      });
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    const s = this.sort();
    this.pageable.sort = s ? `${s.key},${s.direction}` : undefined;
    this.applications
      .getAll(this.pageable, { search: v.search || undefined, status: v.status })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load applications.');
          this.toast.error('Applications load failed', this.errorMessage());
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

  protected canAccept(status: ApplicationStatus): boolean {
    return status === 'SUBMITTED' || status === 'UNDER_REVIEW';
  }

  protected canReject(status: ApplicationStatus): boolean {
    return status === 'DRAFT' || status === 'SUBMITTED' || status === 'UNDER_REVIEW';
  }

  protected async run(action: ApplicationAction, app: ApplicationResponse): Promise<void> {
    try {
      if (action === 'submit') {
        await this.applications.submit(app.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Application submitted', app.reference);
        this.load();
        return;
      }
      if (action === 'review') {
        await this.applications.updateStatus(app.id, 'UNDER_REVIEW').pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Application under review', app.reference);
        this.load();
        return;
      }
      if (action === 'accept') {
        const ok = await this.confirm.confirm({
          title: 'Accept application?',
          message: `${app.candidateName} will be accepted for ${app.reference}.`,
          confirmText: 'Accept'
        });
        if (!ok) {
          return;
        }
        await this.applications.accept(app.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Application accepted', app.reference);
        this.load();
        return;
      }
      if (action === 'reject') {
        const ok = await this.confirm.confirm({
          title: 'Reject application?',
          message: `${app.candidateName} will be rejected for ${app.reference}.`,
          danger: true,
          confirmText: 'Reject'
        });
        if (!ok) {
          return;
        }
        await this.applications.reject(app.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Application rejected', app.reference);
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
      firstName: string;
      lastName: string;
      contactEmail: string;
      nationalId: string;
      phone: string;
      university: string;
    };
    const request: CreateApplicationRequest = {
      submittedOnline: false,
      candidate: {
        firstName: v.firstName,
        lastName: v.lastName,
        contactEmail: v.contactEmail,
        nationalId: v.nationalId || undefined,
        phone: v.phone || undefined,
        university: v.university || undefined
      }
    };
    this.applications
      .create(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.showModal.set(false);
          this.toast.success('Application created', `${v.firstName} ${v.lastName}`);
          this.load();
        },
        error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
          const msg = error.fieldErrors
            ? Object.values(error.fieldErrors).join(' ')
            : (error.message ?? 'Could not create application.');
          this.toast.error('Save failed', msg);
        }
      });
  }

  protected fieldInvalid(field: 'firstName' | 'lastName' | 'contactEmail'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'firstName' | 'lastName' | 'contactEmail'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (field === 'contactEmail' && control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    return undefined;
  }
}
