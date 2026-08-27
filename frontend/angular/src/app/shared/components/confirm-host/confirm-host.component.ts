import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'steg-confirm-host',
  standalone: true,
  template: `
    @if (confirmService.current(); as req) {
      <div class="confirm-overlay" role="presentation" (click)="cancel()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="'confirm-title'"
          (click)="$event.stopPropagation()"
        >
          <h3 id="confirm-title" class="confirm-title">{{ req.options.title }}</h3>
          <p class="confirm-message">{{ req.options.message }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" type="button" (click)="cancel()">
              {{ req.options.cancelText ?? 'Cancel' }}
            </button>
            <button
              class="btn"
              [class.btn-danger]="req.options.danger"
              type="button"
              (click)="accept()"
            >
              {{ req.options.confirmText ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .confirm-overlay {
        position: fixed;
        inset: 0;
        background: rgba(16, 24, 40, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: var(--z-modal, 1000);
      }
      .confirm-dialog {
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        width: 100%;
        max-width: 26rem;
        padding: 1.5rem;
      }
      .confirm-title {
        font-size: 1.0625rem;
        margin: 0 0 0.5rem;
        color: var(--color-text);
      }
      .confirm-message {
        font-size: 0.9375rem;
        color: var(--color-text-muted);
        margin: 0 0 1.5rem;
        line-height: 1.5;
      }
      .confirm-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.625rem;
      }
    `
  ]
})
export class ConfirmHostComponent {
  protected readonly confirmService = inject(ConfirmService);

  protected accept(): void {
    this.confirmService.accept();
  }
  protected cancel(): void {
    this.confirmService.dismiss();
  }
}
