import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'steg-toast-host',
  standalone: true,
  template: `
    <div class="toast-host" aria-live="polite" aria-atomic="false">
      @for (toast of toastService.items(); track toast.id) {
        <div class="toast toast-{{ toast.type }}" [class.enter]="true" role="status">
          <span class="toast-icon" aria-hidden="true">{{ icon(toast.type) }}</span>
          <div class="toast-content">
            @if (toast.title) {
              <strong class="toast-title">{{ toast.title }}</strong>
            }
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" type="button" (click)="toastService.dismiss(toast.id)" aria-label="Dismiss">
            ×
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: var(--z-toast, 1100);
      }
      .toast-host {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: min(24rem, calc(100vw - 2rem));
      }
      .toast {
        display: flex;
        align-items: flex-start;
        gap: 0.625rem;
        padding: 0.75rem 1rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border-strong);
        border-left-width: 4px;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
      }
      .toast-success {
        border-left-color: var(--color-success);
      }
      .toast-error {
        border-left-color: var(--color-danger);
      }
      .toast-warning {
        border-left-color: var(--color-warning);
      }
      .toast-info {
        border-left-color: var(--color-info);
      }
      .toast-icon {
        flex-shrink: 0;
        font-size: 1.125rem;
      }
      .toast-content {
        flex: 1;
      }
      .toast-title {
        font-size: 0.875rem;
      }
      .toast-message {
        font-size: 0.8125rem;
        color: var(--color-text-muted);
      }
      .toast-close {
        background: none;
        border: 0;
        font-size: 1.125rem;
        cursor: pointer;
        color: var(--color-text-muted);
        line-height: 1;
        padding: 0;
      }
      .enter {
        animation: toast-in 0.18s ease-out;
      }
      @keyframes toast-in {
        from {
          transform: translateX(110%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `
  ]
})
export class ToastHostComponent {
  protected readonly toastService = inject(ToastService);

  protected icon(type: ToastType): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '!';
      default:
        return 'i';
    }
  }
}
