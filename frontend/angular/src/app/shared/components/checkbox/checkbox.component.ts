import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'steg-checkbox',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  host: {
    '[class]': 'disabled ? "checkbox disabled" : "checkbox"'
  },
  template: `
    <input
      class="checkbox-input"
      type="checkbox"
      [id]="id()"
      [attr.checked]="checked || null"
      [attr.disabled]="disabled || null"
      (change)="onChangeEvent($event)"
      (blur)="onTouched()"
    />
    @if (label()) {
      <label class="checkbox-label" [for]="id()">{{ label() }}</label>
    }
    <ng-content />
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
      }
      :host.disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .checkbox-input {
        width: 1rem;
        height: 1rem;
        accent-color: var(--color-primary);
        cursor: pointer;
      }
      .checkbox-label {
        font-size: 0.875rem;
        color: var(--color-text);
        cursor: pointer;
      }
    `
  ]
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly id = input(`cb-${Math.random().toString(36).slice(2, 8)}`);
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

  onChangeEvent(event: Event): void {
    const val = (event.target as HTMLInputElement).checked;
    this.checked = val;
    this.onChange(val);
    this.checkedChange.emit(val);
  }
  onTouched(): void {
    this._onTouched();
  }
}
