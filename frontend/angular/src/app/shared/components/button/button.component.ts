import { Component, computed, input, output } from '@angular/core';
import { IconComponent, type StegIconName } from '../icon/icon.component';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'steg-button',
  standalone: true,
  imports: [IconComponent],
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
        <span class="btn-icon" aria-hidden="true">
          <steg-icon [name]="safeIcon()" size="sm" />
        </span>
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
        width: auto;
        vertical-align: middle;
      }
      :host.btn-block {
        display: flex;
        width: 100%;
      }
      :host.btn-block > button {
        width: 100%;
      }
      :host.btn-loading {
        pointer-events: none;
      }
      .btn-icon {
        display: inline-flex;
        align-items: center;
      }
      .btn-icon steg-icon {
        display: inline-flex;
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
  readonly icon = input<StegIconName | ''>('');
  readonly click = output<Event>();

  protected readonly safeIcon = computed<StegIconName>(() => (this.icon() || 'info') as StegIconName);
}
