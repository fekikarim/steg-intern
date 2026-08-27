import { Component, input } from '@angular/core';

@Component({
  selector: 'steg-field',
  standalone: true,
  host: { '[class]': 'invalid() ? "form-field is-invalid" : "form-field"' },
  template: `
    @if (label()) {
      <label class="form-label" [class.required]="required()" [for]="for()">
        {{ label() }}@if (required()) {
          <span class="required-asterisk" aria-hidden="true"> *</span>
        }
      </label>
    }
    <ng-content />
    @if (hint()) {
      <span class="form-hint" [attr.id]="hintId()">{{ hint() }}</span>
    }
    @if (invalid() && error()) {
      <span class="form-error" role="alert">{{ error() }}</span>
    }
  `,
  styles: [
    `
      .required-asterisk {
        color: var(--color-danger);
      }
      :host.is-invalid .form-label {
        color: var(--color-danger);
      }
    `
  ]
})
export class FieldComponent {
  readonly label = input<string | undefined>(undefined);
  readonly for = input<string | undefined>(undefined);
  readonly hint = input<string | undefined>(undefined);
  readonly hintId = input<string | undefined>(undefined);
  readonly error = input<string | undefined>(undefined);
  readonly required = input(false);
  readonly invalid = input(false);
}
