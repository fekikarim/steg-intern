import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn, TableSortState } from '../../shared/components/table/table.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SupervisorsService } from '../../core/services/supervisors.service';
import { DepartmentsService } from '../../core/services/departments.service';
import { ToastService } from '../../core/services/toast.service';
import { Page, Pageable } from '../../core/models/api.model';
import { SupervisorInternshipResponse, SupervisorResponse } from '../../core/models/internship.model';
import { DepartmentResponse } from '../../core/models/admin.model';

@Component({
  selector: 'steg-supervisor-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    FieldComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    ModalComponent
  ],
  template: `
    <steg-page-header
      title="Supervisors"
      subtitle="Department supervisors and their assigned internships"
      [crumbs]="[{ label: 'Supervisors' }]"
    >
      <div class="toolbar" [formGroup]="filterForm">
        <steg-input
          class="search-input"
          type="search"
          formControlName="search"
          id="supervisor-search"
          placeholder="Search name or employee number…"
        />
      </div>
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Department">
        <steg-select id="department-filter" formControlName="departmentId" [options]="departmentOptions()" />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load supervisors"
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
          <steg-button variant="ghost" size="sm" label="Internships" (click)="showInternships(row)" />
        </ng-template>
      </steg-table>
      <nav class="pages">
        <button class="page-btn" [disabled]="loading() || !hasPrev()" (click)="prevPage()">Prev</button>
        <span class="page-info">Page {{ page()?.number !== undefined ? page()!.number + 1 : 1 }} of {{ totalPages() }}</span>
        <button class="page-btn" [disabled]="loading() || !hasNext()" (click)="nextPage()">Next</button>
      </nav>

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="supervisors"
            title="No supervisors found"
            message="Try adjusting the search or filters."
          />
        </div>
      }
    }

    <steg-modal [open]="detailOpen()" [title]="detailTitle()" (dismissed)="closeDetail()">
      @if (detailLoading()) {
        <div class="panel muted">Loading assignments…</div>
      } @else if (assignedInterns()) {
        <div class="list">
          @for (it of assignedInterns(); track it.assignmentId) {
            <div class="assign-item">
              <div class="assign-main">
                <span class="assign-ref">{{ it.internshipReference }}</span>
                <span class="assign-candidate">{{ it.candidateName ?? '—' }}</span>
              </div>
              <div class="assign-meta">{{ it.internshipStatus }} · {{ it.startDate }} → {{ it.endDate }}</div>
            </div>
          } @empty {
            <div class="panel muted">No assigned internships for this supervisor.</div>
          }
        </div>
      }
      <div modal-footer>
        <steg-button variant="ghost" label="Close" (click)="closeDetail()" />
      </div>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .search-input {
        width: 15rem;
      }
      .filters {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
      }
      .filters steg-field {
        width: 16rem;
      }
      .panel {
        padding: 1.25rem;
      }
      .muted {
        color: var(--color-text-muted, #6b7280);
      }
      .pages {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        justify-content: flex-end;
        margin-top: 1rem;
      }
      .page-btn {
        padding: 0.4rem 0.9rem;
        border: 1px solid var(--color-border, #d1d5db);
        border-radius: var(--radius-md, 0.5rem);
        background: var(--color-surface, #fff);
        color: var(--color-text, #111827);
        cursor: pointer;
      }
      .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .page-info {
        font-size: 0.875rem;
        color: var(--color-text-muted, #6b7280);
      }
      .list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .assign-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        border: 1px solid var(--color-border, #e5e7eb);
        border-radius: var(--radius-md, 0.5rem);
      }
      .assign-main {
        display: flex;
        flex-direction: column;
      }
      .assign-ref {
        font-weight: 600;
      }
      .assign-candidate,
      .assign-meta {
        font-size: 0.8125rem;
        color: var(--color-text-muted, #6b7280);
      }
      @media (max-width: 640px) {
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
export class SupervisorListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly supervisors = inject(SupervisorsService);
  private readonly departments = inject(DepartmentsService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load supervisors.');
  protected readonly page = signal<Page<SupervisorResponse> | null>(null);
  protected readonly sort = signal<TableSortState | null>(null);
  protected readonly departmentOptions = signal<SelectOption[]>([]);
  protected readonly detailOpen = signal(false);
  protected readonly detailTitle = signal('Assigned internships');
  protected readonly detailLoading = signal(false);
  protected readonly assignedInterns = signal<SupervisorInternshipResponse[] | null>(null);

  private readonly pageable: Pageable = { page: 0, size: 10 };

  protected readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    departmentId: ['']
  });

  protected readonly columns: TableColumn<SupervisorResponse>[] = [
    { key: 'firstName', label: 'First name', sortable: true },
    { key: 'lastName', label: 'Last name', sortable: true },
    { key: 'employeeNumber', label: 'Emp. no.' },
    { key: 'position', label: 'Position', sortable: true },
    { key: 'departmentName', label: 'Department' },
    { key: 'totalAssignments', label: 'Total' },
    { key: 'activeAssignments', label: 'Active' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: SupervisorResponse): string => row.id;

  constructor() {
    this.loadDepartments();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => {
        this.pageable.page = 0;
        this.load();
      });
    this.load();
  }

  private loadDepartments(): void {
    this.departments
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (depts) =>
          this.departmentOptions.set([
            { value: '', label: 'All departments' },
            ...flattenDepartmentOptions(depts)
          ]),
        error: () => this.departmentOptions.set([{ value: '', label: 'All departments' }])
      });
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    const s = this.sort();
    this.pageable.sort = s ? `${s.key},${s.direction}` : undefined;
    this.supervisors
      .getAll(this.pageable, {
        search: v.search || undefined,
        departmentId: v.departmentId || undefined
      })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load supervisors.');
          this.toast.error('Supervisors load failed', this.errorMessage());
        }
      });
  }

  protected totalPages(): number {
    return this.page()?.totalPages ?? 0;
  }

  protected onSort(sort: TableSortState): void {
    this.sort.set(sort);
    this.pageable.page = 0;
    this.load();
  }

  protected hasPrev(): boolean {
    return !this.page()?.first;
  }

  protected hasNext(): boolean {
    return !this.page()?.last;
  }

  protected prevPage(): void {
    const p = this.page();
    if (p && !p.first) {
      this.pageable.page = p.number - 1;
      this.load();
    }
  }

  protected nextPage(): void {
    const p = this.page();
    if (p && !p.last) {
      this.pageable.page = p.number + 1;
      this.load();
    }
  }

  protected showInternships(s: SupervisorResponse): void {
    this.detailTitle.set(`${s.firstName} ${s.lastName} — internships`);
    this.detailOpen.set(true);
    this.detailLoading.set(true);
    this.assignedInterns.set(null);
    this.supervisors
      .getAssignedInternships(s.id)
      .pipe(takeUntilDestroyed(), finalize(() => this.detailLoading.set(false)))
      .subscribe({
        next: (data) => this.assignedInterns.set(data),
        error: (error: { message?: string }) => {
          this.toast.error('Could not load internships', error.message ?? 'Unexpected error.');
          this.assignedInterns.set([]);
        }
      });
  }

  protected closeDetail(): void {
    this.detailOpen.set(false);
    this.assignedInterns.set(null);
  }
}

function flattenDepartmentOptions(depts: DepartmentResponse[], depth = 0): SelectOption[] {
  const result: SelectOption[] = [];
  for (const d of depts) {
    result.push({ value: d.id, label: `${'\u00A0\u00A0'.repeat(depth)}${d.name}` });
    if (d.children?.length) {
      result.push(...flattenDepartmentOptions(d.children, depth + 1));
    }
  }
  return result;
}
