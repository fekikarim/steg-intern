import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface Crumb {
  label: string;
  url?: string;
}

@Component({
  selector: 'steg-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <ol>
        @for (crumb of crumbs(); track $index; let last = $last) {
          <li class="crumb">
            @if (crumb.url && !last) {
              <a [routerLink]="crumb.url" class="crumb-link">{{ crumb.label }}</a>
            } @else {
              <span class="crumb-current" aria-current="page">{{ crumb.label }}</span>
            }
            @if (!last) {
              <span class="crumb-sep" aria-hidden="true">/</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumb {
        font-size: 0.8125rem;
      }
      ol {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .crumb {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
      }
      .crumb-link {
        color: var(--color-primary);
        text-decoration: none;
      }
      .crumb-link:hover {
        text-decoration: underline;
      }
      .crumb-current {
        color: var(--color-text-muted);
        font-weight: 500;
      }
      .crumb-sep {
        color: var(--color-border-strong);
      }
    `
  ]
})
export class BreadcrumbComponent {
  readonly crumbs = input<Crumb[]>([]);
}
