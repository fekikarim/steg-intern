import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'steg-button',
  standalone: true,
  host: {
    '[class.btn-block]': 'block()',
    '[class.btn-loading]': 'loading() || null'
  },
  template: `
    <button
      class="btn btn-{{ variant() }} btn-{{ size() }}"
      [type]="type()"
      [attr.disabled]="disabled() || loading() ? true : null"
      [attr.aria-busy]="loading() || null"
      [attr.aria-disabled]="disabled() || loading() ? true : null"
      (click)="click.emit($event)"
    >
      @if (loading()) {
        <span class="btn-spinner" aria-hidden="true"></span>
      }
      @if (icon() && !loading()) {
        <span class="btn-icon" [innerHTML]="icon()" aria-hidden="true"></span>
      }
      @if (label()) {
        <span class="btn-label">{{ label() }}</span>
      }
      <ng-content />
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 100%;
      }
      :host > button {
        width: 100%;
      }
      :host.btn-loading {
        pointer-events: none;
      }
      .btn-spinner {
        width: 0.9rem;
        height: 0.9rem;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: steg-spin 0.6s linear infinite;
      }
      @keyframes steg-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `
  ]
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input(false);
  readonly loading = input(false);
  readonly block = input(false);
  readonly label = input('');
  readonly icon = input('');
  readonly click = output<Event>();
}
