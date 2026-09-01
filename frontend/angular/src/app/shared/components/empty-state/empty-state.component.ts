import { Component, computed, input } from '@angular/core';
import { IconComponent, type StegIconName } from '../icon/icon.component';

@Component({
  selector: 'steg-empty-state',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="empty-state">
      @if (icon()) {
        <div class="empty-icon" aria-hidden="true">
          <steg-icon [name]="safeIcon()" size="xl" />
        </div>
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
        display: inline-flex;
        margin-bottom: 0.5rem;
        padding: 1rem;
        border-radius: var(--radius-full);
        background: var(--color-surface-alt);
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
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
  readonly icon = input<StegIconName | ''>('');
  readonly title = input('Nothing here yet');
  readonly message = input('');

  protected readonly safeIcon = computed<StegIconName>(() => (this.icon() || 'info') as StegIconName);
}
