import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'steg-switch',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ],
  host: {
    '[class]': 'disabled ? "switch disabled" : "switch"'
  },
  template: `
    <button
      class="switch-track"
      type="button"
      role="switch"
      [id]="id()"
      [attr.aria-checked]="checked"
      [attr.disabled]="disabled || null"
      (click)="toggle()"
    >
      <span class="switch-thumb" [class.on]="checked"></span>
    </button>
    @if (label()) {
      <label class="switch-label" [for]="id()">{{ label() }}</label>
    }
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      :host.disabled {
        opacity: 0.6;
      }
      .switch-track {
        width: 2.5rem;
        height: 1.375rem;
        border-radius: var(--radius-full);
        border: 1px solid var(--color-border-strong);
        background: var(--color-border);
        position: relative;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .switch-thumb {
        position: absolute;
        top: 0.125rem;
        left: 0.125rem;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.15s ease;
        box-shadow: var(--shadow-sm);
      }
      .switch-track:has(.switch-thumb.on) {
        background: var(--color-primary);
        border-color: var(--color-primary);
      }
      .switch-thumb.on {
        transform: translateX(1.125rem);
      }
      .switch-label {
        font-size: 0.875rem;
        color: var(--color-text);
      }
      .switch-track:disabled {
        cursor: not-allowed;
      }
    `
  ]
})
export class SwitchComponent implements ControlValueAccessor {
  readonly id = input(`sw-${Math.random().toString(36).slice(2, 8)}`);
  readonly label = input('');
  readonly checkedChange = output<boolean>();

  checked = false;
  disabled = false;
  private onChange: (v: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.checked = value ?? false;
  }
  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.onChange(this.checked);
    this.checkedChange.emit(this.checked);
    this._onTouched();
  }
}
