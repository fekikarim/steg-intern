import { Component, input } from '@angular/core';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'steg-badge',
  standalone: true,
  host: {
    '[class]': "`badge badge-${variant()}`"
  },
  template: `<ng-content />`,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.125rem 0.625rem;
        border-radius: var(--radius-full);
        font-size: 0.75rem;
        font-weight: 500;
        line-height: 1.4;
        white-space: nowrap;
      }
      .badge-neutral {
        background: var(--color-surface-alt);
        border: 1px solid var(--color-border-strong);
        color: var(--color-text-secondary);
      }
      .badge-success {
        background: var(--color-success-soft);
        color: var(--color-success);
      }
      .badge-warning {
        background: var(--color-warning-soft);
        color: var(--color-warning);
      }
      .badge-danger {
        background: var(--color-danger-soft);
        color: var(--color-danger);
      }
      .badge-info {
        background: var(--color-info-soft);
        color: var(--color-info);
      }
    `
  ]
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('neutral');
}
