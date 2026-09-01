import { Component, input, output, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

export type RowAlign = 'left' | 'right' | 'center';
export type SortDirection = 'asc' | 'desc';

export interface TableColumn<T> {
  /** Property key into the row. Set to '__slot' to use the projected cell template. */
  key: string;
  label: string;
  /** Renders the projected row template for this column instead of the value. */
  slot?: boolean;
  align?: RowAlign;
  /** Marks the column as click-to-sort. Optionally overrides the sort field key used by the API. */
  sortable?: boolean;
  sortKey?: string;
}

export interface TableSortState {
  key: string;
  direction: SortDirection;
}

@Component({
  selector: 'steg-table',
  standalone: true,
  imports: [NgTemplateOutlet, IconComponent],
  template: `
    <div class="table-wrap" [class.loading]="loading()" [attr.aria-busy]="loading() || null">
      <table class="table">
        @if (caption()) {
          <caption class="sr-only">{{ caption() }}</caption>
        }
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              @if (col.sortable) {
                <th
                  class="align-{{ col.align ?? 'left' }} th-sortable"
                  [attr.aria-sort]="ariaSort(col)"
                  [attr.scope]="'col'"
                >
                  <button
                    type="button"
                    class="sort-btn"
                    (click)="toggleSort(col)"
                    [attr.aria-label]="sortLabel(col)"
                  >
                    <span>{{ col.label }}</span>
                    <span class="sort-indicator" aria-hidden="true">
                      @if (sort()?.key === (col.sortKey ?? col.key)) {
                        <steg-icon [name]="sort()!.direction === 'asc' ? 'chevron-up' : 'chevron-down'" size="sm" />
                      } @else {
                        <span class="sort-dots">↑↓</span>
                      }
                    </span>
                  </button>
                </th>
              } @else {
                <th class="align-{{ col.align ?? 'left' }}" [attr.scope]="'col'">{{ col.label }}</th>
              }
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track tracker(row); let idx = $index) {
            <tr>
              @for (col of columns(); track col.key) {
                <td class="align-{{ col.align ?? 'left' }}" [attr.scope]="col.slot ? null : undefined">
                  @if (col.slot) {
                    <ng-container
                      [ngTemplateOutlet]="rowSlot() ?? emptySlot"
                      [ngTemplateOutletContext]="{ $implicit: row, index: idx }"
                    />
                  } @else {
                    {{ cellValue(row, col.key) }}
                  }
                </td>
              }
            </tr>
          } @empty {
            @if (!loading()) {
              <tr>
                <td class="empty-cell" [attr.colspan]="columns().length">
                  <ng-container [ngTemplateOutlet]="emptySlot" />
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
      @if (loading()) {
        <div class="table-loading" role="status" aria-live="polite">
          <steg-icon name="refresh" size="md" />
          <span class="sr-only">Loading rows</span>
        </div>
      }
    </div>
    <ng-template #emptySlot>
      <span class="sr-only">empty</span>
    </ng-template>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .table-wrap {
        position: relative;
        overflow-x: auto;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-surface);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }
      caption {
        caption-side: top;
      }
      thead th {
        background: var(--color-surface-alt);
        text-align: left;
        font-weight: 600;
        color: var(--color-text-secondary);
        white-space: nowrap;
        border-bottom: 1px solid var(--color-border-strong);
      }
      th,
      td {
        padding: 0.625rem 1rem;
      }
      tbody td {
        border-bottom: 1px solid var(--color-border);
        color: var(--color-text);
        vertical-align: middle;
      }
      tbody tr:last-child td {
        border-bottom: 0;
      }
      tbody tr:hover {
        background: var(--color-surface-alt);
      }
      .align-center {
        text-align: center;
      }
      .align-right {
        text-align: right;
      }
      .th-sortable {
        padding: 0;
      }
      .sort-btn {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        width: 100%;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        font: inherit;
        font-weight: inherit;
        color: inherit;
        cursor: pointer;
        text-align: inherit;
      }
      .sort-btn:hover {
        color: var(--color-primary);
      }
      .sort-indicator {
        display: inline-flex;
        align-items: center;
        color: var(--color-text-muted);
      }
      .sort-dots {
        font-size: 0.625rem;
        letter-spacing: -2px;
        opacity: 0.5;
      }
      .empty-cell {
        padding: 0;
        border-bottom: 0;
      }
      .table-loading {
        position: absolute;
        inset: 0;
        background: color-mix(in srgb, var(--color-surface) 55%, transparent);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
        animation: steg-spin-out 0.8s ease;
      }
      .table-loading steg-icon {
        animation: steg-spin 0.7s linear infinite;
      }
      @keyframes steg-spin {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes steg-spin-out {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
    `
  ]
})
export class TableComponent<T> {
  readonly columns = input.required<TableColumn<T>[]>();
  readonly rows = input<T[]>([]);
  readonly loading = input(false);
  readonly caption = input('');
  readonly rowSlot = input<TemplateRef<unknown> | null>(null);
  readonly trackBy = input<(row: T) => unknown>();
  readonly sort = input<TableSortState | null>(null);
  readonly sortChange = output<TableSortState>();

  tracker(row: T): unknown {
    return this.trackBy() ? this.trackBy()!(row) : JSON.stringify(row);
  }

  cellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  protected ariaSort(col: TableColumn<T>): 'ascending' | 'descending' | 'none' | null {
    const s = this.sort();
    if (!s || s.key !== (col.sortKey ?? col.key)) {
      return null;
    }
    return s.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected sortLabel(col: TableColumn<T>): string {
    const active = this.ariaSort(col);
    if (active === 'ascending') {
      return `Sort by ${col.label} descending`;
    }
    if (active === 'descending') {
      return `Sort by ${col.label} ascending`;
    }
    return `Sort by ${col.label}`;
  }

  protected toggleSort(col: TableColumn<T>): void {
    const key = col.sortKey ?? col.key;
    const current = this.sort();
    let direction: SortDirection = 'asc';
    if (current?.key === key && current.direction === 'asc') {
      direction = 'desc';
    }
    this.sortChange.emit({ key, direction });
  }
}
