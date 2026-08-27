import { Component, input, output } from '@angular/core';

@Component({
  selector: 'steg-error-state',
  standalone: true,
  template: `
    <div class="error-state" role="alert">
      <div class="error-icon" aria-hidden="true">⚠</div>
      <h3 class="error-title">{{ title() }}</h3>
      @if (message()) {
        <p class="error-message">{{ message() }}</p>
      }
      @if (retryable()) {
        <button class="btn btn-outline btn-sm" type="button" (click)="retry.emit()">
          Retry
        </button>
      }
    </div>
  `,
  styles: [
    `
      .error-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.5rem;
        padding: 3rem 1.5rem;
      }
      .error-icon {
        font-size: 1.75rem;
        color: var(--color-danger);
        margin-bottom: 0.25rem;
      }
      .error-title {
        font-size: 1rem;
        color: var(--color-text);
      }
      .error-message {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        max-width: 28rem;
      }
    `
  ]
})
export class ErrorStateComponent {
  readonly title = input('Unable to load data');
  readonly message = input('');
  readonly retryable = input(true);
  readonly retry = output<void>();
}
