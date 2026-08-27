import { Component, forwardRef, input, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'steg-input',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  host: {
    '[class.is-invalid]': 'invalid()',
    '(keyup.enter)': 'enter.emit($event)'
  },
  template: `
    <input
      class="form-control"
      [type]="type()"
      [placeholder]="placeholder()"
      [autocomplete]="autocomplete()"
      [attr.aria-invalid]="invalid() || null"
      [attr.id]="id()"
      [attr.name]="name()"
      [attr.disabled]="disabled || null"
      [value]="value"
      (input)="onInput($event)"
      (blur)="onBlur()"
    />
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
export class InputComponent implements ControlValueAccessor {
  readonly type = input<'text' | 'email' | 'password' | 'number' | 'tel' | 'search'>('text');
  readonly placeholder = input('');
  readonly autocomplete = input('');
  readonly id = input('');
  readonly name = input('');
  readonly invalid = input(false);
  readonly enter = output<Event>();

  value: string = '';
  disabled = false;
  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }
  registerOnChange(fn: (v: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value = val;
    this.onChange(val);
  }
  onBlur(): void {
    this.onTouched();
  }
}
