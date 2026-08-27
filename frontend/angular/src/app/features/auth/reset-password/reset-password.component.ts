import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FieldComponent } from '../../../shared/components/field/field.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { APP_ROUTES } from '../../../core/constants/route.constants';

@Component({
  selector: 'steg-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FieldComponent, InputComponent, AlertComponent, ButtonComponent],
  template: `
    <div>
      <h1 class="page-title">Set a new password</h1>
      <p class="page-sub">Choose a strong password to finish resetting your account.</p>

      @if (done()) {
        <steg-alert [variant]="'success'" title="Password updated">
          Your password has been reset. You can now sign in.
        </steg-alert>
        <div class="back">
          <a class="btn btn-primary btn-block" [routerLink]="authRoutes.login">Go to sign in</a>
        </div>
      } @else {
        @if (formError()) {
          <steg-alert [variant]="'danger'">{{ formError() }}</steg-alert>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="reset-form">
          <steg-field
            label="New password"
            [required]="true"
            [for]="'reset-password'"
            [invalid]="fieldInvalid('password')"
            [error]="fieldError('password')"
          >
            <steg-input
              formControlName="password"
              type="password"
              id="reset-password"
              name="password"
              autocomplete="new-password"
              placeholder="New password"
              [invalid]="fieldInvalid('password')"
            />
          </steg-field>

          <steg-field
            label="Confirm password"
            [required]="true"
            [for]="'reset-confirm'"
            [invalid]="fieldInvalid('confirm')"
            [error]="fieldError('confirm')"
          >
            <steg-input
              formControlName="confirm"
              type="password"
              id="reset-confirm"
              name="confirm"
              autocomplete="new-password"
              placeholder="Re-enter password"
              [invalid]="fieldInvalid('confirm')"
            />
          </steg-field>

          <steg-button class="submit" type="submit" [block]="true" [loading]="submitting()" [disabled]="form.invalid" label="Reset password" />
        </form>
      }
    </div>
  `,
  styles: [
    `
      .page-title {
        font-size: 1.375rem;
        margin-bottom: 0.25rem;
      }
      .page-sub {
        color: var(--color-text-muted);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
      .reset-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .submit {
        margin-top: 0.5rem;
      }
      .back {
        margin-top: 1rem;
      }
    `
  ]
})
export class ResetPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  /** Bound from the `?token=` query parameter via withComponentInputBinding. */
  readonly token = input('');

  protected readonly authRoutes = APP_ROUTES;
  protected readonly submitting = signal(false);
  protected readonly done = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm: ['', [Validators.required]]
    },
    {
      validators: (group) => {
        const pw = group.get('password')?.value;
        const confirm = group.get('confirm')?.value;
        return pw !== confirm ? { mismatch: true } : null;
      }
    }
  );

  protected fieldInvalid(field: 'password' | 'confirm'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'password' | 'confirm'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (field === 'password' && control.hasError('minlength')) {
      return `Password must be at least ${control.errors?.['minlength']?.requiredLength} characters.`;
    }
    if (this.form.hasError('mismatch')) {
      return 'Passwords do not match.';
    }
    return undefined;
  }

  protected onSubmit(): void {
    this.formError.set(null);
    if (!this.token()) {
      this.formError.set('The reset link is invalid or has expired.');
      return;
    }
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.auth.resetPassword(this.token(), this.form.value.password!).subscribe({
      next: () => {
        this.submitting.set(false);
        this.done.set(true);
      },
      error: (error) => {
        this.submitting.set(false);
        this.formError.set(error?.message ?? 'Unable to reset your password. The link may be invalid or expired.');
      }
    });
  }
}
