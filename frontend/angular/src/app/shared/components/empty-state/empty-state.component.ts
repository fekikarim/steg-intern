import { Component, input } from '@angular/core';

@Component({
  selector: 'steg-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      @if (icon()) {
        <div class="empty-icon" [innerHTML]="icon()" aria-hidden="true"></div>
      }
      <h3 class="empty-title">{{ title() }}</h3>
      @if (message()) {
        <p class="empty-message">{{ message() }}</p>
      }
      <div class="empty-action"><ng-content /></div>
    </div>
  `,
  styles: [
    `
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 0.5rem;
        padding: 3rem 1.5rem;
      }
      .empty-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        opacity: 0.6;
      }
      .empty-title {
        font-size: 1rem;
        color: var(--color-text);
      }
      .empty-message {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        max-width: 28rem;
      }
      .empty-action {
        margin-top: 0.75rem;
      }
    `
  ]
})
export class EmptyStateComponent {
  readonly icon = input('');
  readonly title = input('Nothing here yet');
  readonly message = input('');
}
