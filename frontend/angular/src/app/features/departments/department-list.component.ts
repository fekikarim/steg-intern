import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DepartmentsService } from '../../core/services/departments.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { DepartmentResponse } from '../../core/models/admin.model';

interface DeptNode {
  node: DepartmentResponse;
  depth: number;
}

@Component({
  selector: 'steg-department-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    ModalComponent,
    FieldComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Departments"
      subtitle="Organisational hierarchy"
      [crumbs]="[{ label: 'Departments' }]"
    >
      <steg-button variant="primary" label="New department" icon="+" (click)="openCreate()" />
    </steg-page-header>

    <div class="toolbar">
      <steg-input
        class="search-input"
        type="search"
        formControlName="search"
        id="dept-search"
        placeholder="Filter departments…"
      />
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state title="Could not load departments" [message]="errorMessage()" (retry)="load()" />
      </div>
    } @else if (loading()) {
      <div class="card panel">Loading departments…</div>
    } @else {
      <div class="card tree">
        @for (row of filteredRows(); track row.node.id) {
          <div class="tree-row" [style.--depth]="row.depth">
            <span class="depth-indent"></span>
            <button
              class="chevron"
              type="button"
              [class.spacer]="row.node.children.length === 0"
              (click)="toggle(row.node)"
              [attr.aria-label]="expanded().has(row.node.id) ? 'Collapse' : 'Expand'"
            >
              @if (row.node.children.length > 0) {
                {{ expanded().has(row.node.id) ? '▾' : '▸' }}
              }
            </button>
            <span class="dept-code">{{ row.node.code }}</span>
            <span class="dept-name">{{ row.node.name }}</span>
            <span class="dept-desc">{{ row.node.description }}</span>
            <div class="row-actions">
              <steg-button variant="ghost" size="sm" label="Edit" (click)="openEdit(row.node)" />
              <steg-button variant="danger" size="sm" label="Delete" (click)="remove(row.node)" />
            </div>
          </div>
        } @empty {
          <div class="panel">
            <steg-empty-state
              icon="🏢"
              title="No departments"
              message="Create a department to build the organisation hierarchy."
            />
          </div>
        }
      </div>
    }

    <steg-modal [open]="showModal()" [title]="editing() ? 'Edit department' : 'Create department'" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <steg-field label="Code" [required]="true" [invalid]="fieldInvalid('code')" [error]="fieldError('code')">
            <steg-input formControlName="code" id="dept-code" name="code" placeholder="e.g. HR-DEPT" [invalid]="fieldInvalid('code')" />
          </steg-field>
          <steg-field label="Name" [required]="true" [invalid]="fieldInvalid('name')" [error]="fieldError('name')">
            <steg-input formControlName="name" id="dept-name" name="name" placeholder="Department name" [invalid]="fieldInvalid('name')" />
          </steg-field>
          <steg-field label="Description">
            <steg-input formControlName="description" id="dept-desc" name="description" placeholder="Optional" />
          </steg-field>
          <steg-field label="Parent department">
            <steg-select
              formControlName="parentId"
              id="dept-parent"
              name="parentId"
              placeholder="None (top level)"
              [options]="parentOptions()"
            />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" [label]="editing() ? 'Save changes' : 'Create department'" [loading]="submitting()" [disabled]="form.invalid" />
        </div>
      </form>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .panel {
        padding: 1.25rem;
      }
      .toolbar {
        margin-bottom: 1rem;
      }
      .search-input {
        max-width: 18rem;
      }
      .tree {
        padding: 0.5rem 0;
      }
      .tree-row {
        display: grid;
        grid-template-columns: calc(var(--depth) * 1.25rem) 1.25rem 7rem 1fr 2fr auto;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 1.25rem;
      }
      .tree-row:hover {
        background: var(--color-surface-alt);
      }
      .depth-indent {
        width: calc(var(--depth) * 1.25rem);
      }
      .chevron {
        width: 1.25rem;
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-muted);
      }
      .chevron.spacer {
        visibility: hidden;
      }
      .dept-code {
        font-weight: 600;
        color: var(--color-primary);
        font-size: 0.8125rem;
      }
      .dept-name {
        font-weight: 500;
      }
      .dept-desc {
        color: var(--color-text-muted);
        font-size: 0.8125rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .row-actions {
        display: flex;
        gap: 0.25rem;
        justify-content: flex-end;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      @media (max-width: 760px) {
        .tree-row {
          grid-template-columns: calc(var(--depth) * 1.25rem) 1.25rem 1fr auto;
        }
        .dept-code {
          display: none;
        }
        .dept-desc {
          display: none;
        }
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class DepartmentListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly departments = inject(DepartmentsService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load departments.');
  protected readonly departmentList = signal<DepartmentResponse[]>([]);
  protected readonly expanded = signal<Set<string>>(new Set());
  protected readonly showModal = signal(false);
  protected readonly editing = signal<DepartmentResponse | null>(null);
  protected readonly submitting = signal(false);

  protected readonly filterForm = this.fb.nonNullable.group({ search: [''] });

  protected readonly form = this.fb.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(40)]],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', Validators.maxLength(255)],
    parentId: ['']
  });

  constructor() {
    this.load();
  }

  protected readonly allRows = computed<DeptNode[]>(() => {
    const rows: DeptNode[] = [];
    const walk = (nodes: DepartmentResponse[], depth: number): void => {
      for (const node of nodes) {
        rows.push({ node, depth });
        if (node.children.length && this.expanded().has(node.id)) {
          walk(node.children, depth + 1);
        }
      }
    };
    walk(this.departmentList(), 0);
    return rows;
  });

  protected readonly filteredRows = computed<DeptNode[]>(() => {
    const q = (this.filterForm.get('search')?.value ?? '').trim().toLowerCase();
    if (!q) {
      return this.allRows();
    }
    return this.allRows().filter(
      (r) => r.node.name.toLowerCase().includes(q) || r.node.code.toLowerCase().includes(q)
    );
  });

  protected readonly parentOptions = computed<SelectOption[]>(() => {
    const editing = this.editing();
    const excluded = new Set<string>();
    if (editing) {
      const collect = (nodes: DepartmentResponse[]): void => {
        for (const n of nodes) {
          excluded.add(n.id);
          collect(n.children);
        }
      };
      collect(this.departmentList().filter((n) => n.id === editing.id));
    }
    const options: SelectOption[] = [{ value: '', label: 'None (top level)' }];
    const flat: DepartmentResponse[] = [];
    const push = (nodes: DepartmentResponse[]): void => {
      for (const n of nodes) {
        flat.push(n);
        push(n.children);
      }
    };
    push(this.departmentList());
    for (const d of flat) {
      if (!excluded.has(d.id)) {
        options.push({ value: d.id, label: d.name });
      }
    }
    return options;
  });

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.departments.getAll().pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false))).subscribe({
      next: (data) => {
        this.departmentList.set(data);
        this.expanded.set(new Set());
      },
      error: (error: { message?: string }) => {
        this.failed.set(true);
        this.errorMessage.set(error.message ?? 'Unable to load departments.');
        this.toast.error('Departments load failed', this.errorMessage());
      }
    });
  }

  protected toggle(node: DepartmentResponse): void {
    const next = new Set(this.expanded());
    if (next.has(node.id)) {
      next.delete(node.id);
    } else {
      next.add(node.id);
    }
    this.expanded.set(next);
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.showModal.set(true);
  }

  protected openEdit(node: DepartmentResponse): void {
    this.editing.set(node);
    this.form.reset();
    this.form.patchValue({
      code: node.code,
      name: node.name,
      description: node.description ?? '',
      parentId: node.parentId ?? ''
    });
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected async remove(node: DepartmentResponse): Promise<void> {
    const ok = await this.confirm.confirm({
      title: 'Delete department?',
      message: `${node.name} will be removed. Departments with children cannot be deleted.`,
      danger: true,
      confirmText: 'Delete'
    });
    if (!ok) {
      return;
    }
    try {
      await this.departments.delete(node.id).pipe(takeUntilDestroyed()).toPromise();
      this.toast.success('Department deleted', node.name);
      this.load();
    } catch (error) {
      this.toast.error('Delete failed', (error as { message?: string }).message ?? 'Could not delete department.');
    }
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const editing = this.editing();
    const { code, name, description, parentId } = this.form.value as {
      code: string;
      name: string;
      description: string;
      parentId: string;
    };
    const request = { code, name, description: description || undefined, parentId: parentId || null };
    const op = editing
      ? this.departments.update(editing.id, request)
      : this.departments.create(request);
    op.pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.showModal.set(false);
        this.toast.success(editing ? 'Department updated' : 'Department created', name);
        this.load();
      },
      error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
        const msg = error.fieldErrors
          ? Object.values(error.fieldErrors).join(' ')
          : (error.message ?? 'Could not save department.');
        this.toast.error('Save failed', msg);
      }
    });
  }

  protected fieldInvalid(field: 'code' | 'name'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'code' | 'name'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (control.hasError('maxlength')) {
      return 'Too long.';
    }
    return undefined;
  }
}
