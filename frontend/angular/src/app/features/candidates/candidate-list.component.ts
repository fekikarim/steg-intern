import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn, TableSortState } from '../../shared/components/table/table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { CandidatesService } from '../../core/services/candidates.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { RealtimeEvent } from '../../core/models/realtime.model';
import { ToastService } from '../../core/services/toast.service';
import { Page, Pageable } from '../../core/models/api.model';
import { CreateCandidateRequest } from '../../core/models/admin.model';
import { CandidateResponse, UpdateCandidateRequest } from '../../core/models/internship.model';

@Component({
  selector: 'steg-candidate-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    PaginationComponent,
    ModalComponent,
    FieldComponent,
    InputComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Candidates"
      subtitle="Manage candidate profiles and registrations"
      [crumbs]="[{ label: 'Candidates' }]"
    >
      <div class="toolbar" [formGroup]="filterForm">
        <steg-input
          class="search-input"
          type="search"
          formControlName="search"
          id="candidate-search"
          placeholder="Search name, email or CIN…"
        />
      </div>
      <steg-button variant="primary" label="New candidate" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load candidates"
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
          <steg-button variant="ghost" size="sm" label="Edit" (click)="openEdit(row)" />
        </ng-template>
      </steg-table>

      <steg-pagination [page]="page()" (pageChange)="onPageChange($event)" />

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="candidates"
            title="No candidates found"
            message="Try adjusting the search, or register a new candidate."
          />
        </div>
      }
    }

    <steg-modal [open]="showModal()" [title]="editing() ? 'Edit candidate' : 'Register candidate'" [subtitle]="editing() ? 'Update candidate information' : 'Register a new candidate profile'" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-section">
          <p class="form-section-title">Personal information</p>
          <steg-field label="First name" [required]="true" [invalid]="fieldInvalid('firstName')" [error]="fieldError('firstName')">
            <steg-input formControlName="firstName" type="text" id="candidate-firstName" name="firstName" placeholder="First name" [invalid]="fieldInvalid('firstName')" />
          </steg-field>
          <steg-field label="Last name" [required]="true" [invalid]="fieldInvalid('lastName')" [error]="fieldError('lastName')">
            <steg-input formControlName="lastName" type="text" id="candidate-lastName" name="lastName" placeholder="Last name" [invalid]="fieldInvalid('lastName')" />
          </steg-field>
          <steg-field label="Email" [required]="true" [invalid]="fieldInvalid('contactEmail')" [error]="fieldError('contactEmail')">
            <steg-input formControlName="contactEmail" type="email" id="candidate-email" name="contactEmail" autocomplete="off" placeholder="name@example.com" [invalid]="fieldInvalid('contactEmail')" />
          </steg-field>
          <steg-field label="CIN" [invalid]="fieldInvalid('nationalId')" [error]="fieldError('nationalId')">
            <steg-input formControlName="nationalId" type="text" id="candidate-nationalId" name="nationalId" placeholder="National ID" [invalid]="fieldInvalid('nationalId')" />
          </steg-field>
          <steg-field label="Phone">
            <steg-input formControlName="phone" type="tel" id="candidate-phone" name="phone" placeholder="+216 ..." />
          </steg-field>
          <steg-field label="University">
            <steg-input formControlName="university" type="text" id="candidate-university" name="university" placeholder="University" />
          </steg-field>
          <steg-field label="Speciality">
            <steg-input formControlName="speciality" type="text" id="candidate-speciality" name="speciality" placeholder="Speciality" />
          </steg-field>
          <steg-field label="Diploma">
            <steg-input formControlName="diploma" type="text" id="candidate-diploma" name="diploma" placeholder="Diploma" />
          </steg-field>
          <steg-field label="Address">
            <steg-input formControlName="address" type="text" id="candidate-address" name="address" placeholder="Address" />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" [label]="editing() ? 'Save changes' : 'Register'"
            [loading]="submitting()" [disabled]="form.invalid" />
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
      .panel {
        padding: 1.25rem;
      }
      @media (max-width: 640px) {
        .search-input {
          width: 100%;
        }
      }
      ::ng-deep .table-wrap .row-actions {
        display: flex;
      }
    `
  ]
})
export class CandidateListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly candidates = inject(CandidatesService);
  private readonly toast = inject(ToastService);
  private readonly realtime = inject(RealtimeService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load candidates.');
  protected readonly page = signal<Page<CandidateResponse> | null>(null);
  protected readonly sort = signal<TableSortState | null>(null);
  protected readonly showModal = signal(false);
  protected readonly editing = signal<CandidateResponse | null>(null);
  protected readonly submitting = signal(false);

  private readonly pageable: Pageable = { page: 0, size: 10 };

  protected readonly filterForm = this.fb.nonNullable.group({
    search: ['']
  });

  protected readonly columns: TableColumn<CandidateResponse>[] = [
    { key: 'firstName', label: 'First name', sortable: true },
    { key: 'lastName', label: 'Last name', sortable: true },
    { key: 'contactEmail', label: 'Email', sortable: true },
    { key: 'university', label: 'University' },
    { key: 'nationalId', label: 'CIN' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: CandidateResponse): string => row.id;

  protected readonly form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    contactEmail: ['', [Validators.required, Validators.email]],
    nationalId: [''],
    phone: [''],
    university: [''],
    speciality: [''],
    diploma: [''],
    address: ['']
  });

  constructor() {
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef), debounceTime(300))
      .subscribe(() => {
        this.pageable.page = 0;
        this.load();
      });
    this.load();

    // Real-time sync
    this.realtime.of('CANDIDATE').pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300)
    ).subscribe(() => this.load());
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    const s = this.sort();
    this.pageable.sort = s ? `${s.key},${s.direction}` : undefined;
    this.candidates
      .getAll(this.pageable, { search: v.search || undefined })
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load candidates.');
          this.toast.error('Candidates load failed', this.errorMessage());
        }
      });
  }

  protected onSort(sort: TableSortState): void {
    this.sort.set(sort);
    this.pageable.page = 0;
    this.load();
  }

  protected onPageChange(page: number): void {
    this.pageable.page = page;
    this.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.showModal.set(true);
  }

  protected openEdit(candidate: CandidateResponse): void {
    this.editing.set(candidate);
    this.form.reset();
    this.form.patchValue({
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      contactEmail: candidate.contactEmail,
      nationalId: candidate.nationalId ?? '',
      phone: candidate.phone ?? '',
      university: candidate.university ?? '',
      speciality: candidate.speciality ?? '',
      diploma: candidate.diploma ?? '',
      address: candidate.address ?? ''
    });
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const editing = this.editing();
    const v = this.form.value as {
      firstName: string;
      lastName: string;
      contactEmail: string;
      nationalId: string;
      phone: string;
      university: string;
      speciality: string;
      diploma: string;
      address: string;
    };
    const op = editing
      ? this.candidates.update(
          editing.id,
          {
            firstName: v.firstName,
            lastName: v.lastName,
            contactEmail: v.contactEmail,
            nationalId: v.nationalId || undefined,
            phone: v.phone || undefined,
            university: v.university || undefined,
            speciality: v.speciality || undefined,
            diploma: v.diploma || undefined,
            address: v.address || undefined
          } satisfies UpdateCandidateRequest
        )
      : this.candidates.create(
          {
            firstName: v.firstName,
            lastName: v.lastName,
            contactEmail: v.contactEmail,
            nationalId: v.nationalId || undefined,
            phone: v.phone || undefined,
            university: v.university || undefined,
            speciality: v.speciality || undefined,
            diploma: v.diploma || undefined,
            address: v.address || undefined
          } satisfies CreateCandidateRequest
        );
    op.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.showModal.set(false);
        this.toast.success(editing ? 'Candidate updated' : 'Candidate registered', `${v.firstName} ${v.lastName}`);
        this.load();
      },
      error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
        const msg = error.fieldErrors
          ? Object.values(error.fieldErrors).join(' ')
          : (error.message ?? 'Could not save candidate.');
        this.toast.error('Save failed', msg);
      }
    });
  }

  protected fieldInvalid(field: 'firstName' | 'lastName' | 'contactEmail' | 'nationalId'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'firstName' | 'lastName' | 'contactEmail' | 'nationalId'): string | undefined {
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
