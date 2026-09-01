import { Component, ElementRef, HostListener, effect, inject } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'steg-confirm-host',
  standalone: true,
  imports: [IconComponent],
  template: `
    @if (confirmService.current(); as req) {
      <div class="confirm-overlay" role="presentation" (click)="cancel()">
        <div
          class="confirm-dialog"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="confirmTitleId"
          [attr.aria-describedby]="confirmMessageId"
          (click)="$event.stopPropagation()"
        >
          <div class="confirm-head">
            <span class="confirm-icon" [class.danger]="req.options.danger" aria-hidden="true">
              <steg-icon [name]="req.options.danger ? 'warning' : 'info'" size="md" />
            </span>
            <h3 [id]="confirmTitleId" class="confirm-title">{{ req.options.title }}</h3>
          </div>
          <p [id]="confirmMessageId" class="confirm-message">{{ req.options.message }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline" type="button" (click)="cancel()">
              {{ req.options.cancelText ?? 'Cancel' }}
            </button>
            <button
              class="btn"
              [class.btn-danger]="req.options.danger"
              [class.btn-primary]="!req.options.danger"
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
        background: rgba(16, 24, 40, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: var(--z-modal, 1000);
        animation: confirm-in 0.15s ease;
      }
      .confirm-dialog {
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        width: 100%;
        max-width: 26rem;
        padding: 1.5rem;
      }
      .confirm-head {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.5rem;
      }
      .confirm-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: var(--radius-full);
        background: var(--color-info-soft);
        color: var(--color-info);
      }
      .confirm-icon.danger {
        background: var(--color-danger-soft);
        color: var(--color-danger);
      }
      .confirm-title {
        font-size: 1.0625rem;
        margin: 0;
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
      @keyframes confirm-in {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
  ]
})
export class ConfirmHostComponent {
  private readonly el = inject(ElementRef);
  protected readonly confirmService = inject(ConfirmService);
  protected readonly confirmTitleId = 'steg-confirm-title';
  protected readonly confirmMessageId = 'steg-confirm-message';

  constructor() {
    effect(() => {
      if (this.confirmService.current()) {
        requestAnimationFrame(() => {
          const btn = this.el.nativeElement.querySelector('[data-confirm-accept]') ??
            this.el.nativeElement.querySelector('.confirm-actions .btn-primary, .confirm-actions .btn-danger');
          (btn as HTMLElement | null)?.focus?.();
        });
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.confirmService.current()) {
      event.preventDefault();
      this.cancel();
    }
  }

  protected accept(): void {
    this.confirmService.accept();
  }
  protected cancel(): void {
    this.confirmService.dismiss();
  }
}
