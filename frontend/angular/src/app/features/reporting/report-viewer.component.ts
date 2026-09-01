import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent, type StegIconName } from '../../shared/components/icon/icon.component';
import { ReportingService } from '../../core/services/reporting.service';
import { ToastService } from '../../core/services/toast.service';
import { InternshipReportResponse, PaymentReportResponse } from '../../core/models/report.model';

interface Card {
  label: string;
  value: string;
  icon: StegIconName;
  accent: 'primary' | 'info' | 'warning' | 'success' | 'danger';
  hint: string;
}

@Component({
  selector: 'steg-report-viewer',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SkeletonComponent,
    ErrorStateComponent,
    ButtonComponent,
    IconComponent
  ],
  template: `
    <steg-page-header
      title="Reporting"
      subtitle="Decision-support statistics across internships and payments"
      [crumbs]="[{ label: 'Reporting' }]"
    >
      <div class="header-actions">
        <steg-button
          variant="outline"
          size="sm"
          label="Refresh"
          icon="refresh"
          [loading]="loading()"
          [disabled]="loading()"
          (click)="load()"
        />
      </div>
    </steg-page-header>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state title="Could not load reports" [message]="errorMessage()" (retry)="load()" />
      </div>
    } @else if (loading()) {
      <div class="cards">
        @for (_ of [1, 2, 3, 4, 5, 6]; track $index) {
          <div class="stat card"><steg-skeleton [lines]="2" /></div>
        }
      </div>
    } @else {
      <section>
        <h2 class="section-title">Internships</h2>
        <div class="cards">
          @for (card of internshipCards(); track card.label) {
            <div class="stat card">
              <span class="stat-icon" [class]="accentClass(card.accent)" aria-hidden="true">
                <steg-icon [name]="card.icon" size="md" />
              </span>
              <span class="stat-label">{{ card.label }}</span>
              <span class="stat-value">{{ card.value }}</span>
              <span class="stat-hint">{{ card.hint }}</span>
            </div>
          }
        </div>
      </section>

      <section>
        <h2 class="section-title">Payments</h2>
        <div class="cards">
          @for (card of paymentCards(); track card.label) {
            <div class="stat card">
              <span class="stat-icon" [class]="accentClass(card.accent)" aria-hidden="true">
                <steg-icon [name]="card.icon" size="md" />
              </span>
              <span class="stat-label">{{ card.label }}</span>
              <span class="stat-value">{{ card.value }}</span>
              <span class="stat-hint">{{ card.hint }}</span>
            </div>
          }
        </div>
      </section>
    }
  `,
  styles: [
    `
      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .section-title {
        font-size: 1rem;
        font-weight: 600;
        margin: 1.25rem 0 0.75rem;
        color: var(--color-text);
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
        gap: 1rem;
      }
      .stat {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        padding: 1.25rem;
        min-height: 8.5rem;
      }
      .stat-icon {
        align-self: flex-start;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        border-radius: var(--radius-md);
        background: var(--color-surface-alt);
      }
      .stat-icon.accent-primary { color: var(--color-primary); }
      .stat-icon.accent-info { color: var(--color-info, #2563eb); }
      .stat-icon.accent-warning { color: var(--color-warning, #d97706); }
      .stat-icon.accent-success { color: var(--color-success, #16a34a); }
      .stat-icon.accent-danger { color: var(--color-danger); }
      .stat-label {
        font-size: 0.8125rem;
        color: var(--color-text-muted);
        margin-top: 0.25rem;
      }
      .stat-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text);
        line-height: 1.1;
      }
      .stat-hint {
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      .panel {
        padding: 1.25rem;
      }
      @media (max-width: 560px) {
        .cards {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class ReportViewerComponent {
  private readonly reporting = inject(ReportingService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load reports.');
  protected readonly internships = signal<InternshipReportResponse | null>(null);
  protected readonly payments = signal<PaymentReportResponse | null>(null);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const internships$ = this.reporting.getInternshipReport();
    const payments$ = this.reporting.getPaymentReport();
    internships$.pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false))).subscribe({
      next: (data) => this.internships.set(data),
      error: (error: { message?: string }) => {
        this.failed.set(true);
        this.errorMessage.set(error.message ?? 'Unable to load reports.');
        this.toast.error('Reports load failed', this.errorMessage());
      }
    });
    payments$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this.payments.set(data),
      error: (error: { message?: string }) => {
        this.failed.set(true);
        this.errorMessage.set(error.message ?? 'Unable to load reports.');
        this.toast.error('Reports load failed', this.errorMessage());
      }
    });
  }

  protected internshipCards(): Card[] {
    const r = this.internships();
    if (!r) {
      return [];
    }
    return [
      { label: 'Total internships', value: fmt(r.total), icon: 'internships', accent: 'primary', hint: 'All internships' },
      { label: 'Planned', value: fmt(r.planned), icon: 'calendar', accent: 'info', hint: 'Not yet started' },
      { label: 'Active', value: fmt(r.active), icon: 'play', accent: 'success', hint: 'In progress' },
      { label: 'Completed', value: fmt(r.completed), icon: 'check-circle', accent: 'success', hint: 'Finished' },
      { label: 'Cancelled', value: fmt(r.cancelled), icon: 'x-circle', accent: 'danger', hint: 'Aborted' },
      { label: 'Archived', value: fmt(r.archived), icon: 'archive', accent: 'warning', hint: 'Archived' }
    ];
  }

  protected paymentCards(): Card[] {
    const r = this.payments();
    if (!r) {
      return [];
    }
    return [
      { label: 'Total payments', value: fmt(r.total), icon: 'payments', accent: 'primary', hint: 'All payments' },
      { label: 'Pending', value: fmt(r.pending), icon: 'pending', accent: 'warning', hint: money(r.totalPendingAmount) },
      { label: 'Validated', value: fmt(r.validated), icon: 'check-circle', accent: 'info', hint: money(r.totalValidatedAmount) },
      { label: 'Paid', value: fmt(r.paid), icon: 'currency', accent: 'success', hint: money(r.totalPaidAmount) },
      { label: 'Archived', value: fmt(r.archived), icon: 'archive', accent: 'warning', hint: 'Archived' }
    ];
  }

  protected accentClass(accent: Card['accent']): string {
    return `stat-icon accent-${accent}`;
  }
}

function fmt(value: number | undefined): string {
  return (value ?? 0).toLocaleString('en-US');
}

function money(value: number | undefined): string {
  return `${(value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })} TND`;
}
