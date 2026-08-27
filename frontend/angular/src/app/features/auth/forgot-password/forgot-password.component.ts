import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FieldComponent } from '../../../shared/components/field/field.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { APP_ROUTES } from '../../../core/constants/route.constants';

@Component({
  selector: 'steg-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FieldComponent, InputComponent, AlertComponent, ButtonComponent],
  template: `
    <div>
      <h1 class="page-title">Reset your password</h1>
      <p class="page-sub">Enter your email and we'll send you a reset link.</p>

      @if (sent()) {
        <steg-alert [variant]="'success'" title="Check your inbox">
          If an account exists for <strong>{{ form.value.email }}</strong>, a password reset link is on its way.
        </steg-alert>
        <div class="back">
          <a class="btn btn-outline" [routerLink]="authRoutes.login">Back to sign in</a>
        </div>
      } @else {
        @if (formError()) {
          <steg-alert [variant]="'danger'">{{ formError() }}</steg-alert>
        }
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate class="forgot-form">
          <steg-field
            label="Email"
            [required]="true"
            [for]="'forgot-email'"
            [invalid]="fieldInvalid()"
            [error]="fieldInvalid() ? 'Enter a valid email address.' : undefined"
          >
            <steg-input
              formControlName="email"
              type="email"
              id="forgot-email"
              name="email"
              autocomplete="email"
              placeholder="you@steg.tn"
              [autofocus]="true"
              [invalid]="fieldInvalid()"
            />
          </steg-field>

          <steg-button class="submit" type="submit" [block]="true" [loading]="submitting()" [disabled]="form.invalid" label="Send reset link" />
        </form>
        <div class="back">
          <a class="btn btn-ghost btn-block" [routerLink]="authRoutes.login">Back to sign in</a>
        </div>
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
      steg-alert {
        margin-bottom: 1rem;
      }
      .forgot-form {
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
export class ForgotPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly APP_ROUTES = APP_ROUTES;
  protected readonly authRoutes = APP_ROUTES;
  protected readonly submitting = signal(false);
  protected readonly sent = signal(false);
  protected readonly formError = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  protected fieldInvalid(): boolean {
    const control = this.form.get('email');
    return !!control && control.invalid && control.touched;
  }

  protected onSubmit(): void {
    this.formError.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        this.submitting.set(false);
        this.sent.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.sent.set(true);
      }
    });
  }
}
