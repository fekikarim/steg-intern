import { Component, computed, input, output } from '@angular/core';
import { Page } from '../../../core/models/api.model';

@Component({
  selector: 'steg-pagination',
  standalone: true,
  template: `
    @if (page(); as pg) {
      @if (pg.totalPages > 1) {
        <nav class="pagination" aria-label="Pagination">
          <span class="pagination-info">
            {{ pg.first ? 1 : pg.number * pg.size + 1 }}–{{ pg.last ? pg.totalElements : (pg.number + 1) * pg.size }}
            of {{ pg.totalElements }}
          </span>
          <div class="pagination-controls">
            <button
              class="btn btn-outline btn-sm"
              type="button"
              [disabled]="pg.first"
              (click)="pageChange.emit(pg.number - 1)"
            >
              Prev
            </button>
            @for (p of pageNumbers(); track p) {
              <button
                class="btn btn-sm"
                [class.btn-outline]="p !== pg.number"
                [class.btn-primary]="p === pg.number"
                type="button"
                [attr.aria-current]="p === pg.number ? 'page' : null"
                (click)="pageChange.emit(p)"
              >
                {{ p + 1 }}
              </button>
            }
            <button
              class="btn btn-outline btn-sm"
              type="button"
              [disabled]="pg.last"
              (click)="pageChange.emit(pg.number + 1)"
            >
              Next
            </button>
          </div>
        </nav>
      }
    }
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.75rem;
        padding-top: 0.875rem;
      }
      .pagination-info {
        font-size: 0.8125rem;
        color: var(--color-text-muted);
      }
      .pagination-controls {
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
      }
    `
  ]
})
export class PaginationComponent<T> {
  readonly page = input<Page<T> | null>();
  readonly pageChange = output<number>();

  protected readonly pageNumbers = computed<number[]>(() => {
    const p = this.page();
    if (!p) {
      return [];
    }
    const current = p.number;
    const total = p.totalPages;
    return this.pagesAround(current, total);
  });

  private pagesAround(current: number, total: number): number[] {
    const window = 2;
    const start = Math.max(0, current - window);
    const end = Math.min(total - 1, current + window);
    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
