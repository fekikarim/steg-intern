import { Component, input } from '@angular/core';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'steg-spinner',
  standalone: true,
  host: {
    role: 'status',
    'aria-live': 'polite',
    '[class]': "`spinner spinner-${size()}`"
  },
  template: `<span class="sr-only">Loading</span>`,
  styles: [
    `
      .spinner {
        display: inline-block;
        border-radius: 50%;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        animation: steg-spin 0.7s linear infinite;
      }
      .spinner-sm {
        width: 1rem;
        height: 1rem;
        border-width: 2px;
      }
      .spinner-md {
        width: 2rem;
        height: 2rem;
      }
      .spinner-lg {
        width: 3rem;
        height: 3rem;
      }
      @keyframes steg-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ]
})
export class SpinnerComponent {
  readonly size = input<SpinnerSize>('md');
}
