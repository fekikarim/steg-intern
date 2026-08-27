import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APP_INFO } from '../../core/constants/app.constants';

@Component({
  selector: 'steg-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="auth-shell">
      <div class="auth-brand">
        <div class="brand-mark" aria-hidden="true">S</div>
        <div class="brand-text">
          <strong>{{ APP_INFO.title }}</strong>
          <span>Internship Management Platform</span>
        </div>
      </div>
      <main class="auth-card">
        <router-outlet />
      </main>
      <footer class="auth-footer">
        &copy; {{ year }} Société Tunisienne de l'Électricité et du Gaz
      </footer>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem 1rem;
        background: radial-gradient(circle at 20% 0%, var(--color-primary-soft), transparent 45%),
          var(--color-bg);
      }
      .auth-shell {
        width: 100%;
        max-width: 26rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .auth-brand {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
      }
      .brand-mark {
        width: 2.75rem;
        height: 2.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary);
        color: #fff;
        font-weight: 700;
        font-size: 1.375rem;
        border-radius: var(--radius-md);
      }
      .brand-text {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }
      .brand-text strong {
        font-size: 1.125rem;
        color: var(--color-text);
      }
      .brand-text span {
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      .auth-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-md);
        padding: 2rem;
      }
      .auth-footer {
        text-align: center;
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      @media (max-width: 480px) {
        .auth-card {
          padding: 1.5rem;
        }
      }
    `
  ]
})
export class AuthLayoutComponent {
  protected readonly APP_INFO = APP_INFO;
  protected readonly year = new Date().getFullYear();
}
