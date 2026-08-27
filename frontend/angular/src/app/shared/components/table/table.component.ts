import { Component, input, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Page } from '../../../core/models/api.model';

export type RowAlign = 'left' | 'right' | 'center';

export interface TableColumn<T> {
  /** Property key into the row. Set to '__slot' to use the projected cell template. */
  key: string;
  label: string;
  /** Renders the projected row template for this column instead of the value. */
  slot?: boolean;
  align?: RowAlign;
}

@Component({
  selector: 'steg-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `
    <div class="table-wrap" [class.loading]="loading()">
      <table class="table">
        <thead>
          <tr>
            @for (col of columns(); track col.key) {
              <th class="align-{{ col.align ?? 'left' }}">{{ col.label }}</th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of rows(); track tracker(row); let idx = $index) {
            <tr>
              @for (col of columns(); track col.key) {
                <td class="align-{{ col.align ?? 'left' }}">
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
        <div class="table-loading" aria-live="polite"><span class="sr-only">Loading rows</span></div>
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
      }
    `
  ]
})
export class TableComponent<T> {
  readonly columns = input.required<TableColumn<T>[]>();
  readonly rows = input<T[]>([]);
  readonly loading = input(false);
  readonly rowSlot = input<TemplateRef<unknown> | null>(null);
  readonly trackBy = input<(row: T) => unknown>();

  tracker(row: T): unknown {
    return this.trackBy() ? this.trackBy()!(row) : JSON.stringify(row);
  }

  cellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }
}
