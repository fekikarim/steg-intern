import { Component, input } from '@angular/core';
import { BreadcrumbComponent, Crumb } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'steg-page-header',
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-subtitle">{{ subtitle() }}</p>
        }
      </div>
      @if (crumbs().length) {
        <steg-breadcrumb [crumbs]="crumbs()" />
      }
      <div class="page-actions"><ng-content /></div>
    </div>
  `,
  styles: [
    `
      .page-header {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem 1rem;
        margin-bottom: 1.5rem;
      }
      .page-header-left {
        flex: 1 1 auto;
      }
      .page-title {
        font-size: 1.375rem;
        font-weight: 600;
        margin: 0;
        color: var(--color-text);
      }
      .page-subtitle {
        margin: 0.25rem 0 0;
        color: var(--color-text-muted);
        font-size: 0.875rem;
      }
      .page-actions {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
    `
  ]
})
export class PageHeaderComponent {
  readonly title = input('');
  readonly subtitle = input('');
  readonly crumbs = input<Crumb[]>([]);
}
