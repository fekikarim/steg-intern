import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AuditService } from '../../core/services/audit.service';
import { ToastService } from '../../core/services/toast.service';
import { Page, Pageable } from '../../core/models/api.model';
import { AuditResponse } from '../../core/models/admin.model';

@Component({
  selector: 'steg-audit-viewer',
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
      title="Audit log"
      subtitle="Security and activity trail"
      [crumbs]="[{ label: 'Audit log' }]"
    />

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Actor">
        <steg-input formControlName="actor" id="audit-actor" type="search" placeholder="User email" />
      </steg-field>
      <steg-field label="Action">
        <steg-select id="audit-action" formControlName="action" [options]="actionOptions" />
      </steg-field>
      <steg-field label="Entity">
        <steg-input formControlName="entityName" id="audit-entity" type="search" placeholder="e.g. USER" />
      </steg-field>
      <steg-field label="From">
        <input class="native-input" formControlName="from" id="audit-from" type="date" />
      </steg-field>
      <steg-field label="To">
        <input class="native-input" formControlName="to" id="audit-to" type="date" />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state title="Could not load audit log" [message]="errorMessage()" (retry)="load()" />
      </div>
    } @else {
      <steg-table
        [columns]="columns"
        [rows]="page()?.content ?? []"
        [loading]="loading()"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="outline" size="sm" label="Details" (click)="openDetail(row)" />
        </ng-template>
      </steg-table>

      <steg-pagination [page]="page()" (pageChange)="onPageChange($event)" />

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state icon="audit" title="No audit entries" message="No activity matches the current filters." />
        </div>
      }
    }

    <steg-modal [open]="!!detail()" title="Audit details" (dismissed)="detail.set(null)">
      @if (detail(); as d) {
        <dl class="detail-list">
          <div><dt>Actor</dt><dd>{{ d.actorEmail ?? '—' }}</dd></div>
          <div><dt>Action</dt><dd>{{ d.action }}</dd></div>
          <div><dt>Entity</dt><dd>{{ d.entityName }} {{ d.entityId ? '(#' + shortId(d.entityId) + ')' : '' }}</dd></div>
          <div><dt>Time</dt><dd>{{ formatTime(d.createdAt) }}</dd></div>
          <div><dt>IP address</dt><dd>{{ d.ipAddress ?? '—' }}</dd></div>
        </dl>

        <div class="diff-grid">
          <div class="diff-block">
            <h4 class="diff-title">Before</h4>
            <pre class="diff-value">{{ pretty(d.oldValue) }}</pre>
          </div>
          <div class="diff-block">
            <h4 class="diff-title">After</h4>
            <pre class="diff-value">{{ pretty(d.newValue) }}</pre>
          </div>
        </div>
      }

      <div modal-footer>
        <steg-button variant="primary" label="Close" (click)="detail.set(null)" />
      </div>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
        gap: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
      }
      .native-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        font: inherit;
        color: var(--color-text);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
      }
      .panel {
        padding: 1.25rem;
      }
      .detail-list {
        margin: 0 0 1rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.5rem 1.5rem;
      }
      .detail-list dt {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-text-muted);
      }
      .detail-list dd {
        margin: 0.15rem 0 0;
        font-weight: 500;
        overflow-wrap: anywhere;
      }
      .diff-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      .diff-title {
        margin: 0 0 0.375rem;
        font-size: 0.8125rem;
        color: var(--color-text-muted);
      }
      .diff-value {
        margin: 0;
        padding: 0.75rem;
        background: var(--color-surface-alt);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        font-size: 0.75rem;
        white-space: pre-wrap;
        word-break: break-word;
        max-height: 14rem;
        overflow: auto;
        color: var(--color-text-secondary);
      }
      @media (max-width: 640px) {
        .detail-list,
        .diff-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class AuditViewerComponent {
  private readonly fb = inject(FormBuilder);
  private readonly audit = inject(AuditService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load audit log.');
  protected readonly page = signal<Page<AuditResponse> | null>(null);
  protected readonly detail = signal<AuditResponse | null>(null);

  private readonly pageable: Pageable = { page: 0, size: 15, sort: 'createdAt,desc' };

  protected readonly actionOptions: SelectOption[] = [
    { value: '', label: 'All actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'LOCK', label: 'Lock' },
    { value: 'UNLOCK', label: 'Unlock' },
    { value: 'ENABLE', label: 'Enable' },
    { value: 'DISABLE', label: 'Disable' }
  ];

  protected readonly columns: TableColumn<AuditResponse>[] = [
    { key: 'actorEmail', label: 'Actor' },
    { key: 'action', label: 'Action' },
    { key: 'entityName', label: 'Entity' },
    { key: 'createdAt', label: 'Time' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly filterForm = this.fb.nonNullable.group({
    actor: [''],
    action: [''],
    entityName: [''],
    from: [''],
    to: ['']
  });

  protected readonly trackById = (row: AuditResponse): string => row.id;

  constructor() {
    this.filterForm.valueChanges.pipe(takeUntilDestroyed(), debounceTime(400)).subscribe(() => {
      this.pageable.page = 0;
      this.load();
    });
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    const from = v.from ? `${v.from}T00:00:00` : undefined;
    const to = v.to ? `${v.to}T23:59:59` : undefined;
    this.audit
      .search(this.pageable, {
        actor: v.actor || undefined,
        action: v.action || undefined,
        entityName: v.entityName || undefined,
        from,
        to
      })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load audit log.');
          this.toast.error('Audit load failed', this.errorMessage());
        }
      });
  }

  protected onPageChange(page: number): void {
    this.pageable.page = page;
    this.load();
  }

  protected openDetail(row: AuditResponse): void {
    this.detail.set(row);
  }

  protected shortId(id: string): string {
    return id.slice(0, 8);
  }

  protected formatTime(value: string): string {
    return new Date(value).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  }

  protected pretty(value: string | undefined): string {
    if (!value) {
      return '—';
    }
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
}
