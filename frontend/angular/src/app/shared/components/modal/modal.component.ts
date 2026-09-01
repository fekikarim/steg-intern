import {
  Component,
  ElementRef,
  HostListener,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

@Component({
  selector: 'steg-modal',
  standalone: true,
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    '[attr.aria-labelledby]': 'labelledBy()',
    '[attr.aria-describedby]': 'describedBy()'
  },
  template: `
    @if (open()) {
      <div class="modal-overlay" role="presentation" (click)="onOverlayClick()">
        <div class="modal" #dialog [class.modal-sm]="size() === 'sm'" [class.modal-lg]="size() === 'lg'" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h2 class="modal-title" id="steg-modal-title">{{ title() }}</h2>
            <button class="modal-close" type="button" (click)="dismissed.emit()" aria-label="Close">
              <svg class="modal-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18"/>
              </svg>
            </button>
          </header>
          <div class="modal-body" id="steg-modal-body"><ng-content /></div>
          <footer class="modal-footer"><ng-content select="[modal-footer]" /></footer>
        </div>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(16, 24, 40, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: var(--z-modal, 1000);
        overflow-y: auto;
        animation: overlay-in 0.15s ease;
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
        animation: modal-in 0.18s ease;
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
        width: 2rem;
        height: 2rem;
        border-radius: var(--radius-sm);
        cursor: pointer;
        color: var(--color-text-muted);
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .modal-close:hover {
        background: var(--color-surface-alt);
        color: var(--color-text);
      }
      .modal-close-icon {
        width: 1.125rem;
        height: 1.125rem;
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
        flex-wrap: wrap;
      }
      @keyframes overlay-in {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes modal-in {
        from {
          opacity: 0;
          transform: translateY(8px) scale(0.99);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
    `
  ]
})
export class ModalComponent {
  private readonly el = inject(ElementRef);

  readonly open = input(false);
  readonly title = input('');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly dismissed = output<void>();

  protected readonly labelledBy = signal('steg-modal-title');
  protected readonly describedBy = signal('steg-modal-body');

  private lastFocused: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.onOpen();
      } else {
        this.onClose();
      }
    });
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.open()) {
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.dismissed.emit();
      return;
    }
    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  protected onOverlayClick(): void {
    this.dismissed.emit();
  }
  private focusable(): HTMLElement[] {
    const dialog = this.el.nativeElement.querySelector('.modal') as HTMLElement;
    if (!dialog) {
      return [];
    }
    const list = Array.from(dialog.querySelectorAll(FOCUSABLE)) as HTMLElement[];
    return list.filter((el) => el.offsetParent !== null || el === document.activeElement);
  }

  private trapFocus(event: KeyboardEvent): void {
    const items = this.focusable();
    if (items.length === 0) {
      event.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement as HTMLElement | null;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  protected focusDialog(): void {
    const dialog = this.el.nativeElement.querySelector('.modal') as HTMLElement;
    dialog?.setAttribute('tabindex', '-1');
    dialog?.focus();
  }

  protected onOpen(): void {
    this.lastFocused = document.activeElement as HTMLElement | null;
    // Let the DOM render, then move focus into the dialog.
    requestAnimationFrame(() => this.focusDialog());
  }

  protected onClose(): void {
    this.lastFocused?.focus?.();
    this.lastFocused = null;
  }
}
