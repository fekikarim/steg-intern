import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { RolesService } from '../../core/services/roles.service';
import { PermissionsService } from '../../core/services/permissions.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { RealtimeEvent } from '../../core/models/realtime.model';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { RoleResponse } from '../../core/models/user.model';
import { Permission } from '../../core/models/admin.model';

interface PermissionGroup {
  label: string;
  permissions: Permission[];
}

@Component({
  selector: 'steg-role-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    ModalComponent,
    FieldComponent,
    InputComponent,
    CheckboxComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Roles"
      subtitle="Define roles and their permissions"
      [crumbs]="[{ label: 'Roles' }]"
    >
      <steg-button variant="primary" label="New role" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state title="Could not load roles" [message]="errorMessage()" (retry)="load()" />
      </div>
    } @else {
      <div class="toolbar">
        <div class="toolbar-search">
          <input
            class="search-input"
            type="search"
            placeholder="Search roles by name or description"
            [value]="searchQuery()"
            (input)="onSearchInput($event)"
            aria-label="Search roles"
          />
        </div>
        <span class="toolbar-count">{{ filteredRoles().length }} role(s)</span>
      </div>

      <steg-table
        [columns]="columns"
        [rows]="filteredRoles()"
        [loading]="loading()"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="ghost" size="sm" label="Edit" (click)="openEdit(row)" />
          <steg-button variant="danger" size="sm" label="Delete" (click)="delete(row)" />
        </ng-template>
      </steg-table>

      @if (!loading() && filteredRoles().length === 0) {
        <div class="card panel">
          <steg-empty-state icon="roles" title="No roles yet" message="Create a role to get started." />
        </div>
      }
    }

    <steg-modal [open]="showModal()" [title]="editing() ? 'Edit role' : 'Create role'" [subtitle]="editing() ? 'Update role details' : 'Define a new role and permissions'" size="lg" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-section">
          <p class="form-section-title">Role definition</p>
          <steg-field label="Name" [required]="true" [invalid]="fieldInvalid('name')" [error]="fieldError('name')">
            <steg-input
              formControlName="name"
              id="role-name"
              name="name"
              placeholder="e.g. HR_MANAGER"
              [invalid]="fieldInvalid('name')"
            />
          </steg-field>
          <steg-field label="Description">
            <textarea
              class="form-control"
              formControlName="description"
              id="role-desc"
              name="description"
              rows="2"
              placeholder="What can this role do?"
            ></textarea>
          </steg-field>
        </div>

        <div class="perms-head">
          <span class="perms-title">Permissions</span>
          <div class="perms-actions">
            <steg-button variant="ghost" size="sm" label="Select all" (click)="setAll(true)" />
            <steg-button variant="ghost" size="sm" label="Clear ({{ selectedCount() }}/{{ permissions().length }})" (click)="setAll(false)" />
          </div>
        </div>

        <div class="perms-grid" formArrayName="permControls">
          @for (group of grouped(); track group.label) {
            <div class="perm-group">
              <h4 class="perm-group-title">{{ group.label }}</h4>
              @for (perm of group.permissions; track perm.id) {
                <steg-checkbox
                  [attr.formControlName]="controlName(perm)"
                  [id]="'perm-' + perm.id"
                  [label]="perm.code"
                />
              }
            </div>
          }
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" [label]="editing() ? 'Save changes' : 'Create role'" [loading]="submitting()" [disabled]="form.invalid" />
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
      .perms-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 1rem 0 0.5rem;
      }
      .perms-title {
        font-weight: 600;
      }
      .perms-actions {
        display: flex;
        gap: 0.25rem;
      }
      .perms-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
        gap: 1rem 1.5rem;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: 1rem;
        max-height: 20rem;
        overflow-y: auto;
      }
      .perm-group-title {
        margin: 0 0 0.5rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: var(--color-text-muted);
      }
      .perm-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      @media (max-width: 640px) {
        .perms-grid {
          grid-template-columns: 1fr;
        }
      }
    `
  ]
})
export class RoleListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly roles = inject(RolesService);
  private readonly perms = inject(PermissionsService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly realtime = inject(RealtimeService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load roles.');
  protected readonly roleList = signal<RoleResponse[]>([]);
  protected readonly permissions = signal<Permission[]>([]);
  protected readonly showModal = signal(false);
  protected readonly editing = signal<RoleResponse | null>(null);
  protected readonly submitting = signal(false);
  protected readonly searchQuery = signal('');

  protected readonly filteredRoles = computed<RoleResponse[]>(() => {
    const q = this.searchQuery().trim().toLowerCase();
    if (!q) {
      return this.roleList();
    }
    return this.roleList().filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description ?? '').toLowerCase().includes(q)
    );
  });

  protected readonly columns: TableColumn<RoleResponse>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    description: ['', Validators.maxLength(255)],
    permControls: this.fb.array<boolean>([])
  });

  protected readonly trackById = (row: RoleResponse): string => row.id;

  protected onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected readonly grouped = computed<PermissionGroup[]>(() => {
    const groups = new Map<string, Permission[]>();
    for (const p of this.permissions()) {
      const label = p.code.split('_')[0] || 'OTHER';
      const list = groups.get(label) ?? [];
      list.push(p);
      groups.set(label, list);
    }
    return Array.from(groups.entries()).map(([label, perms]) => ({ label, permissions: perms }));
  });

  constructor() {
    this.loadPermissions();
    this.load();

    // Real-time sync
    this.realtime.of('ROLE').pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300)
    ).subscribe(() => this.load());
  }

  get permControls(): FormArray {
    return this.form.get('permControls') as FormArray<import('@angular/forms').FormControl<boolean>>;
  }

  protected selectedCount(): number {
    return this.permControls.controls.filter((c) => c.value).length;
  }

  protected controlName(perm: Permission): string {
    const index = this.permissions().findIndex((p) => p.id === perm.id);
    return String(index);
  }

  private loadPermissions(): void {
    this.perms.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (list) => {
        this.permissions.set(list);
        this.buildPermControls(new Set());
      },
      error: () => {
        this.toast.error('Permissions load failed', 'Could not load the permission catalog.');
      }
    });
  }

  private buildPermControls(selected: Set<string>): void {
    const array = this.fb.array<boolean>(this.permissions().map((p) => selected.has(p.id)));
    this.form.setControl('permControls', array);
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    this.roles.getAll().pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))).subscribe({
      next: (data) => this.roleList.set(data),
      error: (error: { message?: string }) => {
        this.failed.set(true);
        this.errorMessage.set(error.message ?? 'Unable to load roles.');
        this.toast.error('Roles load failed', this.errorMessage());
      }
    });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.buildPermControls(new Set());
    this.showModal.set(true);
  }

  protected openEdit(role: RoleResponse): void {
    this.editing.set(role);
    this.form.reset();
    this.form.patchValue({ name: role.name, description: role.description ?? '' });
    const codeToId = new Map<string, string>();
    for (const p of this.permissions()) {
      codeToId.set(p.code, p.id);
    }
    const selected = new Set<string>();
    for (const code of role.permissions) {
      const id = codeToId.get(code);
      if (id) {
        selected.add(id);
      }
    }
    this.buildPermControls(selected);
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected async delete(role: RoleResponse): Promise<void> {
    const ok = await this.confirm.confirm({
      title: 'Delete role?',
      message: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      danger: true
    });
    if (!ok) {
      return;
    }
    this.roles.delete(role.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.toast.success('Role deleted', role.name);
        this.load();
      },
      error: (error: { message?: string }) => {
        this.toast.error('Delete failed', error.message ?? 'Could not delete role.');
      }
    });
  }

  protected setAll(value: boolean): void {
    for (const control of this.permControls.controls) {
      control.setValue(value, { emitEvent: false });
    }
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const editing = this.editing();
    const name = this.form.get('name')?.value ?? '';
    const description = this.form.get('description')?.value || undefined;
    const permissionIds = this.permissions()
      .filter((_, i) => this.permControls.at(i)?.value)
      .map((p) => p.id);
    const request = { name, description, permissionIds };
    const op = editing ? this.roles.update(editing.id, request) : this.roles.create(request);
    op.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.showModal.set(false);
        this.toast.success(editing ? 'Role updated' : 'Role created', name);
        this.load();
      },
      error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
        const msg = error.fieldErrors
          ? Object.values(error.fieldErrors).join(' ')
          : (error.message ?? 'Could not save role.');
        this.toast.error('Save failed', msg);
      }
    });
  }

  protected fieldInvalid(field: 'name' | 'description'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'name'): string | undefined {
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
