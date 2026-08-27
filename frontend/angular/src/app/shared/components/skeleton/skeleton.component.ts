import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'steg-skeleton',
  standalone: true,
  template: `
    <div class="skeleton" aria-hidden="true">
      @for (item of lineIndices(); track $index; let i = $index) {
        <span class="skeleton-line" [class.wide]="i % 3 === 0" [class.short]="i % 5 === 0"></span>
      }
    </div>
  `,
  styles: [
    `
      .skeleton {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .skeleton-line {
        height: 0.875rem;
        border-radius: var(--radius-sm);
        background: linear-gradient(90deg, var(--color-border) 25%, var(--color-surface-alt) 50%, var(--color-border) 75%);
        background-size: 200% 100%;
        animation: shimmer 1.4s ease infinite;
      }
      .skeleton-line.wide {
        width: 90%;
      }
      .skeleton-line:not(.wide) {
        width: 65%;
      }
      .skeleton-line.short {
        width: 40%;
      }
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `
  ]
})
export class SkeletonComponent {
  readonly lines = input(3);

  protected readonly lineIndices = computed(() =>
    Array.from({ length: Math.max(0, this.lines()) }, (_, i) => i)
  );
}
