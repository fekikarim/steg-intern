import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { PaymentsService } from '../../core/services/payments.service';
import { InternshipsService } from '../../core/services/internships.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { Page, Pageable } from '../../core/models/api.model';
import { PaymentResponse, PaymentStatus, CreatePaymentRequest, CurrencyCode } from '../../core/models/payment.model';

type PaymentAction = 'validate' | 'pay';

const STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: 'Pending',
  VALIDATED: 'Validated',
  PAID: 'Paid',
  ARCHIVED: 'Archived'
};

const CURRENCY_OPTIONS: SelectOption<CurrencyCode>[] = [
  { value: 'TND', label: 'TND' },
  { value: 'EUR', label: 'EUR' },
  { value: 'USD', label: 'USD' }
];

@Component({
  selector: 'steg-payment-list',
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
      title="Payments"
      subtitle="Track indemnity and payment processing"
      [crumbs]="[{ label: 'Payments' }]"
    >
      <steg-button variant="primary" label="New payment" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Status">
        <steg-select id="status-filter" formControlName="status" [options]="statusOptions" />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load payments"
          [message]="errorMessage()"
          (retry)="load()"
        />
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
          <steg-button variant="success" size="sm" label="Validate" [disabled]="row.status !== 'PENDING'" (click)="run('validate', row)" />
          <steg-button variant="primary" size="sm" label="Mark paid" [disabled]="row.status !== 'VALIDATED'" (click)="run('pay', row)" />
        </ng-template>
      </steg-table>

      <steg-pagination [page]="page()" (pageChange)="onPageChange($event)" />

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="payments"
            title="No payments found"
            message="Create a payment to start tracking indemnity processing."
          />
        </div>
      }
    }

    <steg-modal [open]="showModal()" title="Create payment" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <steg-field label="Internship" [required]="true" [invalid]="fieldInvalid('internshipId')" [error]="fieldError('internshipId')">
            <steg-select
              formControlName="internshipId"
              id="payment-internship"
              name="internship"
              placeholder="Select an internship"
              [invalid]="fieldInvalid('internshipId')"
              [options]="internshipOptions()"
            />
          </steg-field>
          <steg-field label="Amount" [required]="true" [invalid]="fieldInvalid('amount')" [error]="fieldError('amount')">
            <input
              id="payment-amount"
              formControlName="amount"
              type="number"
              name="amount"
              min="0.01"
              step="0.01"
              class="native-input"
            />
          </steg-field>
          <steg-field label="Currency">
            <steg-select
              formControlName="currency"
              id="payment-currency"
              name="currency"
              [options]="currencyOptions"
            />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" label="Create payment" [loading]="submitting()" [disabled]="form.invalid" />
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
      }
      ::ng-deep .table-wrap .row-actions {
        display: flex;
      }
    `
  ]
})
export class PaymentListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly payments = inject(PaymentsService);
  private readonly internships = inject(InternshipsService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load payments.');
  protected readonly page = signal<Page<PaymentResponse> | null>(null);
  protected readonly internshipsList = signal<Array<{ id: string; label: string }>>([]);
  protected readonly showModal = signal(false);
  protected readonly submitting = signal(false);

  private readonly pageable: Pageable = { page: 0, size: 10 };

  protected readonly currencyOptions = CURRENCY_OPTIONS;

  protected readonly filterForm = this.fb.nonNullable.group({
    status: ['' as PaymentStatus | '']
  });

  protected readonly statusOptions: SelectOption<PaymentStatus | ''>[] = [
    { value: '', label: 'All statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'VALIDATED', label: 'Validated' },
    { value: 'PAID', label: 'Paid' },
    { value: 'ARCHIVED', label: 'Archived' }
  ];

  protected readonly columns: TableColumn<PaymentResponse>[] = [
    { key: 'reference', label: 'Reference' },
    { key: 'amount', label: 'Amount', align: 'right' },
    { key: 'currency', label: 'Currency' },
    { key: 'status', label: 'Status' },
    { key: 'approvedByName', label: 'Approved by' },
    { key: 'paymentDate', label: 'Paid on' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: PaymentResponse): string => row.id;

  protected readonly internshipOptions = () =>
    this.internshipsList().map<SelectOption>((i) => ({ value: i.id, label: i.label }));

  protected readonly form = this.fb.nonNullable.group({
    internshipId: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currency: ['TND' as CurrencyCode]
  });

  constructor() {
    this.loadInternships();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => {
        this.pageable.page = 0;
        this.load();
      });
    this.load();
  }

  private loadInternships(): void {
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
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const status = this.filterForm.getRawValue().status;
    this.payments
      .getAll(this.pageable.page, this.pageable.size, status)
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load payments.');
          this.toast.error('Payments load failed', this.errorMessage());
        }
      });
  }

  protected onPageChange(page: number): void {
    this.pageable.page = page;
    this.load();
  }

  protected openCreate(): void {
    this.form.reset({ currency: 'TND' });
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected async run(action: PaymentAction, p: PaymentResponse): Promise<void> {
    try {
      if (action === 'validate') {
        const ok = await this.confirm.confirm({
          title: 'Validate payment?',
          message: `${p.reference} (${p.amount} ${p.currency}) will be marked validated.`,
          confirmText: 'Validate'
        });
        if (!ok) {
          return;
        }
        await this.payments.validate(p.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Payment validated', p.reference);
        this.load();
        return;
      }
      if (action === 'pay') {
        const ok = await this.confirm.confirm({
          title: 'Mark payment as paid?',
          message: `${p.reference} (${p.amount} ${p.currency}) will be marked paid.`,
          confirmText: 'Mark paid'
        });
        if (!ok) {
          return;
        }
        await this.payments.markAsPaid(p.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('Payment paid', p.reference);
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
    const v = this.form.getRawValue();
    const request: CreatePaymentRequest = {
      internshipId: v.internshipId,
      amount: v.amount as number,
      currency: v.currency
    };
    this.payments
      .create(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.showModal.set(false);
          this.toast.success('Payment created', v.internshipId);
          this.load();
        },
        error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
          const msg = error.fieldErrors
            ? Object.values(error.fieldErrors).join(' ')
            : (error.message ?? 'Could not create payment.');
          this.toast.error('Save failed', msg);
        }
      });
  }

  protected fieldInvalid(field: 'internshipId' | 'amount'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'internshipId' | 'amount'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (control.hasError('min')) {
      return 'Amount must be greater than zero.';
    }
    return undefined;
  }

  protected statusLabel(status: PaymentStatus): string {
    return STATUS_LABELS[status];
  }
}
