import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { InternshipsService } from '../../core/services/internships.service';
import { ToastService } from '../../core/services/toast.service';
import { InternshipStats } from '../../core/models/internship.model';

interface StatCard {
  key: keyof InternshipStats;
  label: string;
  icon: string;
  accent: 'primary' | 'info' | 'warning' | 'success' | 'danger';
  hint: string;
}

@Component({
  selector: 'steg-internship-dashboard',
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
      title="Internship dashboard"
      subtitle="Pipeline overview of internships, starts and assignments"
      [crumbs]="[{ label: 'Internships', url: '/internships' }, { label: 'Dashboard' }]"
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
          title="Could not load internship dashboard"
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

      <section class="summary card">
        <div class="summary-title">Within the next 30 days</div>
        <div class="summary-row">
          <span>Internships about to start</span>
          <strong>{{ stats()!.upcomingStarts }}</strong>
        </div>
        <div class="summary-row">
          <span>Internships about to end</span>
          <strong>{{ stats()!.upcomingEndings }}</strong>
        </div>
        <div class="summary-row">
          <span>Pending assignments</span>
          <strong>{{ stats()!.pendingAssignments }}</strong>
        </div>
      </section>
    } @else {
      <div class="card panel">
        <steg-empty-state
          icon="🎓"
          title="No data yet"
          message="The internship dashboard has no statistics to display right now."
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
        margin-bottom: 1rem;
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
      .summary {
        padding: 1.25rem;
      }
      .summary-title {
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 0.375rem 0;
        font-size: 0.875rem;
        color: var(--color-text-muted);
      }
      .summary-row strong {
        color: var(--color-text);
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
export class InternshipDashboardComponent {
  private readonly internships = inject(InternshipsService);
  private readonly toast = inject(ToastService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load internship dashboard.');
  protected readonly stats = signal<InternshipStats | null>(null);
  protected readonly lastUpdated = signal('—');

  protected readonly statCards: StatCard[] = [
    { key: 'totalInternships', label: 'Total internships', icon: '🎓', accent: 'primary', hint: 'All internships' },
    { key: 'planned', label: 'Planned', icon: '🗓️', accent: 'info', hint: 'Scheduled, not started' },
    { key: 'active', label: 'Active', icon: '▶', accent: 'success', hint: 'Currently in progress' },
    { key: 'completed', label: 'Completed', icon: '✅', accent: 'success', hint: 'Finished internships' },
    { key: 'cancelled', label: 'Cancelled', icon: '⛔', accent: 'danger', hint: 'Terminated early' },
    { key: 'archived', label: 'Archived', icon: '📦', accent: 'warning', hint: 'Permanently archived' },
    { key: 'pendingAssignments', label: 'Pending assignments', icon: '🔗', accent: 'info', hint: 'Awaiting a supervisor' },
    { key: 'upcomingStarts', label: 'Upcoming starts', icon: '🚀', accent: 'warning', hint: 'Starting within 30 days' },
    { key: 'upcomingEndings', label: 'Upcoming endings', icon: '🏁', accent: 'danger', hint: 'Ending within 30 days' }
  ];

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.internships
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
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load internship dashboard.');
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
