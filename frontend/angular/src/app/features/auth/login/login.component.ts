import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { API_ERROR_CODES } from '../../../core/constants/api-error.constants';
import { APP_ROUTES } from '../../../core/constants/route.constants';
import { FieldComponent } from '../../../shared/components/field/field.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CheckboxComponent } from '../../../shared/components/checkbox/checkbox.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'steg-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FieldComponent,
    InputComponent,
    CheckboxComponent,
    AlertComponent,
    ButtonComponent
  ],
  template: `
    <div>
      <div class="login-brand">
        <img
          src="assets/logo/logo-steg-1200x327.png"
          alt="STEG - Société Tunisienne de l'Électricité et du Gaz - Logo"
          class="login-logo"
          width="1200"
          height="327"
        />
      </div>
      <h1 class="login-title">Welcome back</h1>
      <p class="login-sub">Sign in to continue to the Back Office.</p>

      @if (formError()) {
        <steg-alert [variant]="formError()!.severity" [title]="formError()!.title" [dismissible]="true" (dismissed)="formError.set(null)">
          {{ formError()!.message }}
        </steg-alert>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="login-form">
        <steg-field label="Email" [required]="true" [for]="id.email" [invalid]="fieldInvalid('email')" [error]="emailError()">
          <steg-input
            formControlName="email"
            type="email"
            id="login-email"
            name="email"
            autocomplete="email"
            placeholder="you@steg.tn"
            [autofocus]="true"
            [invalid]="fieldInvalid('email')"
          />
        </steg-field>

        <steg-field label="Password" [required]="true" [for]="id.password" [invalid]="fieldInvalid('password')" [error]="passwordError()">
          <div class="password-wrap">
            <steg-input
              formControlName="password"
              [type]="showPassword() ? 'text' : 'password'"
              id="login-password"
              name="password"
              autocomplete="current-password"
              placeholder="Your password"
              [invalid]="fieldInvalid('password')"
            />
            <button
              type="button"
              class="password-toggle"
              [attr.aria-label]="showPassword() ? 'Hide password' : 'Show password'"
              (click)="showPassword.set(!showPassword())"
            >
              {{ showPassword() ? 'Hide' : 'Show' }}
            </button>
          </div>
        </steg-field>

        <div class="login-options">
          <steg-checkbox id="remember-me" label="Remember me" formControlName="rememberMe" />
          <a class="forgot-link" [routerLink]="['/', 'auth', 'forgot-password']">Forgot password?</a>
        </div>

        <steg-button
          class="login-submit"
          type="submit"
          [block]="true"
          [loading]="submitting()"
          [disabled]="form.invalid"
          label="Sign in"
        />
      </form>
    </div>
  `,
  styles: [
    `
      .login-title {
        font-size: 1.375rem;
        margin-bottom: 0.25rem;
      }
      .login-brand {
        display: flex;
        justify-content: center;
        margin-bottom: 1.25rem;
      }
      .login-logo {
        display: block;
        width: 100%;
        max-width: 15rem;
        height: auto;
        object-fit: contain;
      }
      .login-sub {
        color: var(--color-text-muted);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
      steg-alert {
        margin-bottom: 1rem;
      }
      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .password-wrap {
        position: relative;
      }
      .password-toggle {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-primary);
        font-size: 0.8125rem;
        cursor: pointer;
        padding: 0.25rem 0.5rem;
      }
      .login-options {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .forgot-link {
        font-size: 0.8125rem;
      }
      .login-submit {
        margin-top: 0.5rem;
      }
    `
  ]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly showPassword = signal(false);
  protected readonly submitting = signal(false);
  protected readonly formError = signal<{ severity: 'danger' | 'warning'; title?: string; message: string } | null>(null);

  protected readonly id = { email: 'login-email', password: 'login-password' };

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    rememberMe: [false]
  });

  protected fieldInvalid(field: 'email' | 'password'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected emailError(): string | undefined {
    const control = this.form.get('email');
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'Email is required.';
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    return undefined;
  }

  protected passwordError(): string | undefined {
    const control = this.form.get('password');
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'Password is required.';
    }
    if (control.hasError('minlength')) {
      return `Password must be at least ${control.errors?.['minlength']?.requiredLength} characters.`;
    }
    return undefined;
  }

  protected onSubmit(): void {
    this.formError.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }

    this.submitting.set(true);
    const { email, password, rememberMe } = this.form.value;
    this.auth.login({ email: email!, password: password! }, rememberMe ?? false).subscribe({
      next: () => {
        this.submitting.set(false);
        void this.router.navigate([APP_ROUTES.dashboard]);
      },
      error: (error) => {
        this.submitting.set(false);
        this.mapError(error);
      }
    });
  }

  private mapError(error: { code?: string; message?: string; status?: number }): void {
    const code = error.code;
    if (code === API_ERROR_CODES.ACCOUNT_LOCKED) {
      this.formError.set({
        severity: 'warning',
        title: 'Account locked',
        message: 'Too many failed attempts. Try again later or reset your password.'
      });
      return;
    }
    if (code === API_ERROR_CODES.UNAUTHORIZED || error.status === 401) {
      this.formError.set({
        severity: 'danger',
        title: 'Sign in failed',
        message: 'Incorrect email or password.'
      });
      return;
    }
    this.formError.set({
      severity: 'danger',
      title: 'Sign in failed',
      message: error.message ?? 'An unexpected error occurred. Please try again.'
    });
  }
}
