import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'steg-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  host: {
    '[class.is-invalid]': 'invalid()'
  },
  template: `
    <select
      class="form-control"
      [attr.id]="id()"
      [attr.name]="name()"
      [attr.disabled]="disabled || null"
      [attr.aria-invalid]="invalid() || null"
      [value]="value"
      (change)="onSelect($event)"
      (blur)="onTouched()"
    >
      @if (placeholder()) {
        <option value="" disabled>{{ placeholder() }}</option>
      }
      @for (opt of options(); track opt.value) {
        <option [value]="opt.value" [disabled]="opt.disabled">{{ opt.label }}</option>
      }
    </select>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `
  ]
})
export class SelectComponent<T = string> implements ControlValueAccessor {
  readonly id = input('');
  readonly name = input('');
  readonly placeholder = input('');
  readonly invalid = input(false);
  readonly options = input<SelectOption<T>[]>([]);

  value: T | '' = '';
  disabled = false;
  private onChange: (v: T | '') => void = () => {};
  private _onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (v: T | '') => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const val = select.value === '' ? '' : (select.value as T);
    this.value = val;
    this.onChange(val);
  }
  onTouched(): void {
    this._onTouched();
  }
}
