import { Component, input, output } from '@angular/core';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'steg-alert',
  standalone: true,
  host: {
    role: 'alert',
    '[class]': "`alert alert-${variant()}`"
  },
  template: `
    <div class="alert-body">
      @if (title()) {
        <strong class="alert-title">{{ title() }}</strong>
      }
      <div class="alert-message"><ng-content /></div>
    </div>
    @if (dismissible()) {
      <button class="alert-close" type="button" (click)="dismissed.emit()" aria-label="Dismiss">×</button>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-radius: var(--radius-md);
        border: 1px solid transparent;
        font-size: 0.875rem;
      }
      .alert-body {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .alert-title {
        font-weight: 600;
      }
      .alert-message {
        color: inherit;
      }
      .alert-close {
        background: transparent;
        border: 0;
        font-size: 1.25rem;
        line-height: 1;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        padding: 0 0.25rem;
      }
      .alert-close:hover {
        opacity: 1;
      }
      .alert-info {
        background: var(--color-info-soft);
        border-color: color-mix(in srgb, var(--color-info) 25%, transparent);
        color: var(--color-info);
      }
      .alert-success {
        background: var(--color-success-soft);
        border-color: color-mix(in srgb, var(--color-success) 25%, transparent);
        color: var(--color-success);
      }
      .alert-warning {
        background: var(--color-warning-soft);
        border-color: color-mix(in srgb, var(--color-warning) 25%, transparent);
        color: var(--color-warning);
      }
      .alert-danger {
        background: var(--color-danger-soft);
        border-color: color-mix(in srgb, var(--color-danger) 25%, transparent);
        color: var(--color-danger);
      }
    `
  ]
})
export class AlertComponent {
  readonly variant = input<AlertVariant>('info');
  readonly title = input<string | undefined>(undefined);
  readonly dismissible = input(false);
  readonly dismissed = output<void>();
}
