import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { ToastService } from '../../core/services/toast.service';
import { DashboardStats } from '../../core/models/dashboard.model';

interface StatCard {
  key: keyof DashboardStats;
  label: string;
  icon: string;
  accent: 'primary' | 'info' | 'warning' | 'success' | 'danger';
  hint: string;
}

@Component({
  selector: 'steg-dashboard',
  standalone: true,
  imports: [
    PageHeaderComponent,
    SkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent,
    ButtonComponent
  ],
  template: `
    <steg-page-header
      title="Dashboard"
      subtitle="Live overview of the internship management platform"
      [crumbs]="[{ label: 'Dashboard' }]"
    >
      <div class="header-actions">
        <steg-button
          variant="outline"
          size="sm"
          label="Refresh"
          icon="↻"
          [loading]="loading()"
          [disabled]="loading()"
          (click)="load()"
        />
        <span class="last-updated" [class.visible]="!loading() && !failed()">
          Last updated {{ lastUpdated() }}
        </span>
      </div>
    </steg-page-header>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load dashboard"
          [message]="errorMessage()"
          (retry)="load()"
        />
      </div>
    } @else if (loading()) {
      <div class="stats">
        @for (card of statCards; track card.key) {
          <div class="stat card">
            <steg-skeleton [lines]="2" />
          </div>
        }
      </div>
    } @else if (stats()) {
      <section class="stats">
        @for (card of statCards; track card.key) {
          <div class="stat card" [class.flat]="true">
            <span class="stat-icon" [class]="accentClass(card.accent)" aria-hidden="true">{{ card.icon }}</span>
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-value">{{ formatNumber(stats()![card.key]) }}</span>
            <span class="stat-hint">{{ card.hint }}</span>
          </div>
        }
      </section>
    } @else {
      <div class="card panel">
        <steg-empty-state
          icon="📊"
          title="No data yet"
          message="The dashboard has no statistics to display right now."
        />
      </div>
    }
  `,
  styles: [
    `
      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .last-updated {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        opacity: 0;
        transition: opacity var(--transition-fast);
      }
      .last-updated.visible {
        opacity: 1;
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
        gap: 1rem;
      }
      .stat {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
        padding: 1.25rem;
        min-height: 9rem;
      }
      .stat-icon {
        align-self: flex-start;
        font-size: 1.25rem;
        line-height: 1;
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
        font-size: 2rem;
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
        .stats {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DashboardComponent {
  private readonly dashboard = inject(DashboardService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load dashboard statistics.');
  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly lastUpdated = signal('—');

  protected readonly statCards: StatCard[] = [
    { key: 'totalCandidates', label: 'Candidates', icon: '👤', accent: 'primary', hint: 'Registered candidates' },
    { key: 'totalApplications', label: 'Applications', icon: '📨', accent: 'info', hint: 'Total applications received' },
    { key: 'totalInternships', label: 'Internships', icon: '🎓', accent: 'primary', hint: 'All internships' },
    { key: 'activeInternships', label: 'Active internships', icon: '▶', accent: 'success', hint: 'Currently in progress' },
    { key: 'activeAssignments', label: 'Active assignments', icon: '🔗', accent: 'info', hint: 'Internships with a supervisor' },
    { key: 'totalSupervisors', label: 'Supervisors', icon: '🧑‍🏫', accent: 'warning', hint: 'Registered supervisors' },
    { key: 'totalEmployees', label: 'Employees', icon: '🏢', accent: 'info', hint: 'Internal staff' },
    { key: 'pendingPayments', label: 'Pending payments', icon: '💶', accent: 'danger', hint: 'Awaiting payment' }
  ];

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.dashboard
      .getStats()
      .pipe(
        takeUntilDestroyed(),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (data) => {
          this.stats.set(data);
          this.lastUpdated.set(formatTime(new Date()));
        },
        error: (error: { message?: string; status?: number }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load dashboard statistics.');
          this.toast.error('Dashboard load failed', this.errorMessage());
        }
      });
  }

  protected formatNumber(value: number | undefined): string {
    return (value ?? 0).toLocaleString('en-US');
  }

  protected accentClass(accent: StatCard['accent']): string {
    return `stat-icon accent-${accent}`;
  }
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
