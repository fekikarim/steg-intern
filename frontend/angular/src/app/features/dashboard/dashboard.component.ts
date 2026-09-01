import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize, merge } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { IconComponent, type StegIconName } from '../../shared/components/icon/icon.component';
import { DashboardService } from '../../core/services/dashboard.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { RealtimeEvent } from '../../core/models/realtime.model';
import { ToastService } from '../../core/services/toast.service';
import { DashboardStats } from '../../core/models/dashboard.model';

interface StatCard {
  key: keyof DashboardStats;
  label: string;
  icon: StegIconName;
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
    ButtonComponent,
    IconComponent
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
          icon="refresh"
          [loading]="loading()"
          [disabled]="loading()"
          (click)="load()"
        />
        <span class="last-updated" [class.visible]="!loading() && !failed()">
          Last updated {{ lastUpdated() }}
        </span>
      </div>
    </steg-page-header>

    <section class="dashboard-brand" aria-label="STEG brand">
      <img
        src="assets/logo/logo-steg-341x308.png"
        alt="STEG - Société Tunisienne de l'Électricité et du Gaz - Logo"
        class="brand-logo"
        width="341"
        height="308"
        loading="eager"
        fetchpriority="high"
      />
      <div class="brand-copy">
        <h2 class="brand-title">STEG Back Office</h2>
        <p class="brand-sub">Internship management platform for the Tunisian Company of Electricity and Gas.</p>
      </div>
    </section>

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
            <span class="stat-icon" [class]="accentClass(card.accent)" aria-hidden="true">
              <steg-icon [name]="card.icon" size="md" />
            </span>
            <span class="stat-label">{{ card.label }}</span>
            <span class="stat-value">{{ formatNumber(stats()![card.key]) }}</span>
            <span class="stat-hint">{{ card.hint }}</span>
          </div>
        }
      </section>
    } @else {
      <div class="card panel">
        <steg-empty-state
          icon="reports"
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
      .dashboard-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.25rem;
      }
      .brand-logo {
        width: 3.5rem;
        height: auto;
        object-fit: contain;
        flex-shrink: 0;
        animation: hero-in 0.4s ease both;
      }
      .brand-copy {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
        min-width: 0;
      }
      .brand-title {
        margin: 0;
        font-size: 1.375rem;
        font-weight: 700;
        color: var(--color-text);
        line-height: 1.2;
      }
      .brand-sub {
        margin: 0;
        font-size: 0.875rem;
        color: var(--color-text-muted);
        line-height: 1.4;
      }
      @keyframes hero-in {
        from {
          opacity: 0;
          transform: translateY(-6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @media (max-width: 480px) {
        .dashboard-brand {
          align-items: flex-start;
        }
        .brand-logo {
          width: 3rem;
        }
        .brand-sub {
          display: none;
        }
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly toast = inject(ToastService);
  private readonly realtime = inject(RealtimeService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load dashboard statistics.');
  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly lastUpdated = signal('—');

  protected readonly statCards: StatCard[] = [
    { key: 'totalCandidates', label: 'Candidates', icon: 'candidates', accent: 'primary', hint: 'Registered candidates' },
    { key: 'totalApplications', label: 'Applications', icon: 'applications', accent: 'info', hint: 'Total applications received' },
    { key: 'totalInternships', label: 'Internships', icon: 'internships', accent: 'primary', hint: 'All internships' },
    { key: 'activeInternships', label: 'Active internships', icon: 'play', accent: 'success', hint: 'Currently in progress' },
    { key: 'activeAssignments', label: 'Active assignments', icon: 'assignments', accent: 'info', hint: 'Internships with a supervisor' },
    { key: 'totalSupervisors', label: 'Supervisors', icon: 'supervisors', accent: 'warning', hint: 'Registered supervisors' },
    { key: 'totalEmployees', label: 'Employees', icon: 'building', accent: 'info', hint: 'Internal staff' },
    { key: 'pendingPayments', label: 'Pending payments', icon: 'payments', accent: 'danger', hint: 'Awaiting payment' }
  ];

  constructor() {
    this.load();

    // Real-time sync — refresh when any major entity changes
    merge(
      this.realtime.of('USER'),
      this.realtime.of('CANDIDATE'),
      this.realtime.of('INTERNSHIP'),
      this.realtime.of('APPLICATION'),
      this.realtime.of('ASSIGNMENT'),
      this.realtime.of('PAYMENT')
    ).pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(500)
    ).subscribe(() => this.load());
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.dashboard
      .getStats()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
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
