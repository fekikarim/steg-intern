import { Component, input, output } from '@angular/core';

@Component({
  selector: 'steg-modal',
  standalone: true,
  host: {
    role: 'dialog',
    'aria-modal': 'true'
  },
  template: `
    @if (open()) {
      <div class="modal-overlay" role="presentation" (click)="dismissed.emit()">
        <div class="modal" [class.modal-sm]="size() === 'sm'" [class.modal-lg]="size() === 'lg'" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h2 class="modal-title">{{ title() }}</h2>
            <button class="modal-close" type="button" (click)="dismissed.emit()" aria-label="Close">×</button>
          </header>
          <div class="modal-body"><ng-content /></div>
          <footer class="modal-footer" aria-hidden="true"><ng-content select="[modal-footer]" /></footer>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(16, 24, 40, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: var(--z-modal, 1000);
        overflow-y: auto;
      }
      .modal {
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        width: 100%;
        max-width: 36rem;
        display: flex;
        flex-direction: column;
        max-height: 90vh;
      }
      .modal-sm {
        max-width: 24rem;
      }
      .modal-lg {
        max-width: 52rem;
      }
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--color-border);
      }
      .modal-title {
        font-size: 1.0625rem;
        margin: 0;
      }
      .modal-close {
        background: none;
        border: 0;
        font-size: 1.5rem;
        line-height: 1;
        cursor: pointer;
        color: var(--color-text-muted);
      }
      .modal-body {
        padding: 1.5rem;
        overflow-y: auto;
      }
      .modal-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border);
        display: flex;
        justify-content: flex-end;
        gap: 0.625rem;
      }
    `
  ]
})
export class ModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly dismissed = output<void>();
}
