import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn, TableSortState } from '../../shared/components/table/table.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { InputComponent } from '../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { SwitchComponent } from '../../shared/components/switch/switch.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { UsersService } from '../../core/services/users.service';
import { RolesService } from '../../core/services/roles.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { Page, Pageable } from '../../core/models/api.model';
import { UserResponse, UserStatus, RoleResponse } from '../../core/models/user.model';
import { CreateUserRequest, UpdateUserRequest } from '../../core/models/admin.model';

type UserAction = 'edit' | 'toggleEnable' | 'toggleLock' | 'delete';

@Component({
  selector: 'steg-user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    PaginationComponent,
    ModalComponent,
    FieldComponent,
    InputComponent,
    SelectComponent,
    SwitchComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Users"
      subtitle="Manage accounts, roles and access"
      [crumbs]="[{ label: 'Users' }]"
    >
      <div class="toolbar">
        <steg-input
          class="search-input"
          type="search"
          formControlName="search"
          id="user-search"
          placeholder="Search email or role…"
        />
      </div>
      <steg-button variant="primary" label="New user" icon="plus" (click)="openCreate()" />
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Role">
        <steg-select
          id="role-filter"
          formControlName="role"
          [options]="roleFilterOptions()"
        />
      </steg-field>
      <steg-field label="Status">
        <steg-select
          id="status-filter"
          formControlName="status"
          [options]="statusOptions"
        />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load users"
          [message]="errorMessage()"
          (retry)="load()"
        />
      </div>
    } @else {
      <steg-table
        [columns]="columns"
        [rows]="page()?.content ?? []"
        [loading]="loading()"
        [sort]="sort()"
        (sortChange)="onSort($event)"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="ghost" size="sm" label="Edit" (click)="openEdit(row)" />
          <steg-button variant="ghost" size="sm" [label]="row.enabled ? 'Disable' : 'Enable'" (click)="run('toggleEnable', row)" />
          <steg-button
            variant="ghost"
            size="sm"
            [label]="row.status === 'LOCKED' ? 'Unlock' : 'Lock'"
            (click)="run('toggleLock', row)"
          />
          <steg-button variant="danger" size="sm" label="Delete" (click)="run('delete', row)" />
        </ng-template>
      </steg-table>

      <steg-pagination [page]="page()" (pageChange)="onPageChange($event)" />

      @if (!loading() && (page()?.content?.length ?? 0) === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="users"
            title="No users found"
            message="Try adjusting the search or filters, or create a new user."
          />
        </div>
      }
    }

    <steg-modal [open]="showModal()" [title]="editing() ? 'Edit user' : 'Create user'" (dismissed)="closeModal()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-grid">
          <steg-field label="Email" [required]="true" [invalid]="fieldInvalid('email')" [error]="fieldError('email')">
            <steg-input
              formControlName="email"
              type="email"
              id="user-email"
              name="email"
              autocomplete="off"
              placeholder="name@steg.tn"
              [invalid]="fieldInvalid('email')"
            />
          </steg-field>

          @if (!editing()) {
            <steg-field label="Password" [required]="true" [invalid]="fieldInvalid('password')" [error]="passwordError()">
              <steg-input
                formControlName="password"
                type="password"
                id="user-password"
                name="password"
                autocomplete="new-password"
                placeholder="Min. 12 characters"
                [invalid]="fieldInvalid('password')"
              />
            </steg-field>
          }

          <steg-field label="Role" [required]="true" [invalid]="fieldInvalid('roleId')" [error]="fieldError('roleId')">
            <steg-select
              formControlName="roleId"
              id="user-role"
              name="role"
              placeholder="Select a role"
              [invalid]="fieldInvalid('roleId')"
              [options]="roleFormOptions()"
            />
          </steg-field>

          <steg-field label="Account enabled">
            <steg-switch id="user-enabled" formControlName="enabled" label="Allow sign in" />
          </steg-field>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeModal()" />
          <steg-button type="submit" variant="primary" [label]="editing() ? 'Save changes' : 'Create user'" [loading]="submitting()" [disabled]="form.invalid" />
        </div>
      </form>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .toolbar {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .filters {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
      }
      .filters steg-field {
        width: 13rem;
      }
      .row-actions {
        display: flex;
        gap: 0.25rem;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      .panel {
        padding: 1.25rem;
      }
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }
      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
        .search-input {
          width: 100%;
        }
        .filters {
          flex-direction: column;
        }
        .filters steg-field {
          width: 100%;
        }
      }
      ::ng-deep .table-wrap .row-actions {
        display: flex;
      }
    `
  ]
})
export class UserListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly users = inject(UsersService);
  private readonly roles = inject(RolesService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load users.');
  protected readonly page = signal<Page<UserResponse> | null>(null);
  protected readonly sort = signal<TableSortState | null>(null);
  protected readonly rolesList = signal<RoleResponse[]>([]);
  protected readonly showModal = signal(false);
  protected readonly editing = signal<UserResponse | null>(null);
  protected readonly submitting = signal(false);
  protected readonly UserStatus = UserStatus;

  private readonly pageable: Pageable = { page: 0, size: 10 };

  protected readonly filterForm = this.fb.nonNullable.group({
    search: [''],
    role: [''],
    status: ['']
  });

  protected readonly statusOptions: SelectOption[] = [
    { value: '', label: 'All statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'LOCKED', label: 'Locked' }
  ];

  protected readonly columns: TableColumn<UserResponse>[] = [
    { key: 'email', label: 'Email', sortable: true },
    { key: 'roleName', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'enabled', label: 'Enabled' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly roleFilterOptions = () =>
    [{ value: '', label: 'All roles' }].concat(
      this.rolesList().map<SelectOption>((r) => ({ value: r.name, label: r.name }))
    );

  protected readonly roleFormOptions = () =>
    this.rolesList().map<SelectOption>((r) => ({ value: r.id, label: r.name }));

  protected readonly trackById = (row: UserResponse): string => row.id;

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(12)]],
    roleId: ['', Validators.required],
    enabled: [true]
  });

  constructor() {
    this.loadRoles();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => {
        const v = this.filterForm.getRawValue();
        this.pageable.page = 0;
        this.load();
      });
    this.load();
  }

  private loadRoles(): void {
    this.roles.getAll().pipe(takeUntilDestroyed()).subscribe({
      next: (roles) => this.rolesList.set(roles),
      error: () => this.rolesList.set([])
    });
  }

  protected load(): void {
    this.loading.set(true);
    this.failed.set(false);
    const v = this.filterForm.getRawValue();
    const s = this.sort();
    this.pageable.sort = s ? `${s.key},${s.direction}` : undefined;
    this.users
      .getAll(this.pageable, {
        search: v.search || undefined,
        roleName: v.role || undefined,
        status: v.status || undefined
      })
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.page.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load users.');
          this.toast.error('Users load failed', this.errorMessage());
        }
      });
  }

  protected onPageChange(page: number): void {
    this.pageable.page = page;
    this.load();
  }

  protected onSort(sort: TableSortState): void {
    this.sort.set(sort);
    this.pageable.page = 0;
    this.load();
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset();
    this.form.patchValue({ enabled: true });
    this.form.get('password')?.setValidators([Validators.required, Validators.minLength(12)]);
    this.form.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  protected openEdit(user: UserResponse): void {
    this.editing.set(user);
    this.form.reset();
    this.form.patchValue({
      email: user.email,
      roleId: this.rolesList().find((r) => r.name === user.roleName)?.id ?? '',
      enabled: user.enabled
    });
    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
    this.showModal.set(true);
  }

  protected closeModal(): void {
    this.showModal.set(false);
  }

  protected async run(action: UserAction, user: UserResponse): Promise<void> {
    try {
      if (action === 'edit') {
        this.openEdit(user);
        return;
      }
      if (action === 'toggleEnable') {
        const ok = await this.confirm.confirm({
          title: user.enabled ? 'Disable user?' : 'Enable user?',
          message: user.enabled
            ? `${user.email} will be blocked from signing in.`
            : `${user.email} will be allowed to sign in again.`,
          danger: user.enabled
        });
        if (!ok) {
          return;
        }
        if (user.enabled) {
          await this.users.disable(user.id).pipe(takeUntilDestroyed()).toPromise();
          this.toast.success('User disabled', `${user.email} can no longer sign in.`);
        } else {
          await this.users.enable(user.id).pipe(takeUntilDestroyed()).toPromise();
          this.toast.success('User enabled', `${user.email} can now sign in.`);
        }
        this.load();
        return;
      }
      if (action === 'toggleLock') {
        const locked = user.status === UserStatus.LOCKED;
        const ok = await this.confirm.confirm({
          title: locked ? 'Unlock user?' : 'Lock user?',
          message: locked
            ? `${user.email} will be unlocked.`
            : `${user.email} will be locked and active sessions revoked.`,
          danger: !locked
        });
        if (!ok) {
          return;
        }
        if (locked) {
          await this.users.unlock(user.id).pipe(takeUntilDestroyed()).toPromise();
          this.toast.success('User unlocked', `${user.email} can sign in again.`);
        } else {
          await this.users.lock(user.id).pipe(takeUntilDestroyed()).toPromise();
          this.toast.success('User locked', `${user.email} is locked.`);
        }
        this.load();
        return;
      }
      if (action === 'delete') {
        const ok = await this.confirm.confirm({
          title: 'Delete user?',
          message: `${user.email} and its data will be permanently removed.`,
          danger: true,
          confirmText: 'Delete'
        });
        if (!ok) {
          return;
        }
        await this.users.delete(user.id).pipe(takeUntilDestroyed()).toPromise();
        this.toast.success('User deleted', `${user.email} was removed.`);
        this.load();
      }
    } catch (error) {
      this.toast.error('Action failed', (error as { message?: string }).message ?? 'An unexpected error occurred.');
    }
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    this.submitting.set(true);
    const editing = this.editing();
    const { email, password, roleId, enabled } = this.form.value as {
      email: string;
      password: string;
      roleId: string;
      enabled: boolean;
    };
    const op = editing
      ? this.users.update(editing.id, { email, roleId, enabled } satisfies UpdateUserRequest)
      : this.users.create({ email, password, roleId, enabled } satisfies CreateUserRequest);
    op.pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false))).subscribe({
      next: () => {
        this.showModal.set(false);
        this.toast.success(editing ? 'User updated' : 'User created', email);
        this.load();
      },
      error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
        const msg = error.fieldErrors
          ? Object.values(error.fieldErrors).join(' ')
          : (error.message ?? 'Could not save user.');
        this.toast.error('Save failed', msg);
      }
    });
  }

  protected fieldInvalid(field: 'email' | 'password' | 'roleId'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'email' | 'roleId'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'This field is required.';
    }
    if (field === 'email' && control.hasError('email')) {
      return 'Enter a valid email address.';
    }
    return undefined;
  }

  protected passwordError(): string | undefined {
    const control = this.form.get('password');
    if (!control || !control.touched) {
      return undefined;
    }
    if (control.hasError('required')) {
      return 'Password is required.';
    }
    if (control.hasError('minlength')) {
      return `At least ${control.errors?.['minlength']?.requiredLength} characters.`;
    }
    return undefined;
  }
}
