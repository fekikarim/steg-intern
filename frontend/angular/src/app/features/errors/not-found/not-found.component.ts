import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../core/constants/route.constants';

@Component({
  selector: 'steg-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="error-page">
      <span class="code">404</span>
      <h1 class="title">Page not found</h1>
      <p class="message">The page you're looking for doesn't exist or has been moved.</p>
      <a class="btn btn-primary" [routerLink]="routes.dashboard">Back to dashboard</a>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        min-height: 100vh;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background: var(--color-bg);
      }
      .error-page {
        text-align: center;
        max-width: 26rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }
      .code {
        font-size: 4rem;
        font-weight: 800;
        color: var(--color-primary);
        line-height: 1;
      }
      .title {
        font-size: 1.25rem;
      }
      .message {
        color: var(--color-text-muted);
        margin-bottom: 1rem;
      }
    `
  ]
})
export class NotFoundComponent {
  protected readonly routes = APP_ROUTES;
}
