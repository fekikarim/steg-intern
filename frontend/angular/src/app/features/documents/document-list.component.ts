import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, finalize } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FieldComponent } from '../../shared/components/field/field.component';
import { SelectComponent, SelectOption } from '../../shared/components/select/select.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DocumentsService } from '../../core/services/documents.service';
import { InternshipsService } from '../../core/services/internships.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { DocumentResponse, DocumentType, UploadDocumentRequest } from '../../core/models/document.model';

const DOCUMENT_TYPES: SelectOption<DocumentType>[] = [
  { value: 'INTERNSHIP_CONVENTION', label: 'Internship convention' },
  { value: 'ASSIGNMENT_LETTER', label: 'Assignment letter' },
  { value: 'INTERNSHIP_CERTIFICATE', label: 'Internship certificate' },
  { value: 'CV', label: 'CV' },
  { value: 'MOTIVATION_LETTER', label: 'Motivation letter' },
  { value: 'UNIVERSITY_CONVENTION', label: 'University convention' },
  { value: 'TRANSCRIPT', label: 'Transcript' },
  { value: 'NATIONAL_ID', label: 'National ID' }
];

function formatSize(size?: number): string {
  if (size == null) {
    return '—';
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

@Component({
  selector: 'steg-document-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    TableComponent,
    ModalComponent,
    FieldComponent,
    SelectComponent,
    ButtonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ],
  template: `
    <steg-page-header
      title="Documents"
      subtitle="Manage documents attached to internships"
      [crumbs]="[{ label: 'Documents' }]"
    >
      <steg-button variant="primary" label="Register document" icon="+" (click)="openRegister()" />
    </steg-page-header>

    <div class="filters card" [formGroup]="filterForm">
      <steg-field label="Internship">
        <steg-select
          id="doc-internship"
          formControlName="internshipId"
          placeholder="Select an internship"
          [options]="internshipOptions()"
        />
      </steg-field>
    </div>

    @if (failed()) {
      <div class="card panel">
        <steg-error-state
          title="Could not load documents"
          [message]="errorMessage()"
          (retry)="load()"
        />
      </div>
    } @else {
      <steg-table
        [columns]="columns"
        [rows]="documents()"
        [loading]="loading()"
        [rowSlot]="actionsRow"
        [trackBy]="trackById"
      >
        <ng-template #actionsRow let-row>
          <steg-button variant="danger" size="sm" label="Delete" (click)="remove(row)" />
        </ng-template>
      </steg-table>

      @if (!loading() && documents().length === 0) {
        <div class="card panel">
          <steg-empty-state
            icon="📄"
            title="No documents found"
            message="Select an internship or register a document to get started."
          />
        </div>
      }
    }

    <steg-modal [open]="showRegister()" title="Register document" (dismissed)="closeRegister()">
      <form [formGroup]="form" (ngSubmit)="save()" novalidate>
        <div class="form-stack">
          <steg-field label="Internship" [required]="true" [invalid]="fieldInvalid('internshipId')" [error]="fieldError('internshipId')">
            <steg-select
              formControlName="internshipId"
              id="reg-internship"
              name="internship"
              placeholder="Select an internship"
              [invalid]="fieldInvalid('internshipId')"
              [options]="internshipOptions()"
            />
          </steg-field>
          <steg-field label="Document type" [required]="true" [invalid]="fieldInvalid('type')" [error]="fieldError('type')">
            <steg-select
              formControlName="type"
              id="reg-type"
              name="type"
              [invalid]="fieldInvalid('type')"
              [options]="documentTypeOptions"
            />
          </steg-field>
          <steg-field label="Storage key" [required]="true" [invalid]="fieldInvalid('storageKey')" [error]="fieldError('storageKey')">
            <input
              id="reg-storage"
              formControlName="storageKey"
              type="text"
              name="storageKey"
              class="native-input"
              placeholder="Object key or file path"
            />
          </steg-field>
          <div class="form-grid">
            <steg-field label="MIME type">
              <input
                id="reg-mime"
                formControlName="mimeType"
                type="text"
                name="mimeType"
                class="native-input"
                placeholder="e.g. application/pdf"
              />
            </steg-field>
            <steg-field label="Size (bytes)">
              <input
                id="reg-size"
                formControlName="size"
                type="number"
                name="size"
                class="native-input"
                min="0"
              />
            </steg-field>
          </div>
        </div>

        <div modal-footer>
          <steg-button variant="ghost" label="Cancel" [disabled]="submitting()" (click)="closeRegister()" />
          <steg-button type="submit" variant="primary" label="Register document" [loading]="submitting()" [disabled]="form.invalid" />
        </div>
      </form>
    </steg-modal>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .filters {
        display: flex;
        gap: 1rem;
        padding: 1rem 1.25rem;
        margin-bottom: 1rem;
      }
      .filters steg-field {
        width: 18rem;
      }
      .panel {
        padding: 1.25rem;
      }
      .form-stack,
      .form-grid {
        display: grid;
        gap: 1rem;
      }
      .form-grid {
        grid-template-columns: 1fr 1fr;
      }
      .native-input {
        width: 100%;
        padding: 0.55rem 0.75rem;
        border: 1px solid var(--color-border, #d1d5db);
        border-radius: var(--radius-md, 0.5rem);
        background: var(--color-surface, #fff);
        color: var(--color-text, #111827);
        font-size: 0.875rem;
      }
      @media (max-width: 640px) {
        .form-grid {
          grid-template-columns: 1fr;
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
export class DocumentListComponent {
  private readonly fb = inject(FormBuilder);
  private readonly documentsSvc = inject(DocumentsService);
  private readonly internships = inject(InternshipsService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);

  protected readonly loading = signal(false);
  protected readonly failed = signal(false);
  protected readonly errorMessage = signal('Unable to load documents.');
  protected readonly documents = signal<DocumentResponse[]>([]);
  protected readonly internshipsList = signal<Array<{ id: string; label: string }>>([]);
  protected readonly showRegister = signal(false);
  protected readonly submitting = signal(false);

  protected readonly documentTypeOptions = DOCUMENT_TYPES;

  protected readonly filterForm = this.fb.nonNullable.group({
    internshipId: ['']
  });

  protected readonly columns: TableColumn<DocumentResponse>[] = [
    { key: 'reference', label: 'Reference' },
    { key: 'type', label: 'Type' },
    { key: 'version', label: 'Version' },
    {
      key: 'size',
      label: 'Size',
      align: 'right'
    },
    { key: 'createdDate', label: 'Created' },
    { key: 'actions', label: '', align: 'right', slot: true }
  ];

  protected readonly trackById = (row: DocumentResponse): string => row.id;

  protected readonly internshipOptions = () =>
    this.internshipsList().map<SelectOption>((i) => ({ value: i.id, label: i.label }));

  protected readonly form = this.fb.nonNullable.group({
    internshipId: ['', Validators.required],
    type: ['INTERNSHIP_CONVENTION' as DocumentType, Validators.required],
    storageKey: ['', Validators.required],
    mimeType: [''],
    size: [0 as number | null]
  });

  constructor() {
    this.loadInternships();
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(300))
      .subscribe(() => this.load());
  }

  private loadInternships(): void {
    this.internships
      .getAll({ page: 0, size: 100 })
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) =>
          this.internshipsList.set(
            data.content.map((i) => ({ id: i.id, label: `${i.reference} — ${i.candidateName}` }))
          ),
        error: () => this.internshipsList.set([])
      });
  }

  protected load(): void {
    const internshipId = this.filterForm.getRawValue().internshipId;
    if (!internshipId) {
      this.documents.set([]);
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.failed.set(false);
    this.documentsSvc
      .getByInternship(internshipId)
      .pipe(takeUntilDestroyed(), finalize(() => this.loading.set(false)))
      .subscribe({
        next: (data) => this.documents.set(data),
        error: (error: { message?: string }) => {
          this.failed.set(true);
          this.errorMessage.set(error.message ?? 'Unable to load documents.');
          this.toast.error('Documents load failed', this.errorMessage());
        }
      });
  }

  protected openRegister(): void {
    this.form.reset({
      internshipId: this.filterForm.getRawValue().internshipId || '',
      type: 'INTERNSHIP_CONVENTION',
      size: 0
    });
    this.showRegister.set(true);
  }

  protected closeRegister(): void {
    this.showRegister.set(false);
  }

  protected async remove(doc: DocumentResponse): Promise<void> {
    const ok = await this.confirm.confirm({
      title: 'Delete document?',
      message: `${doc.reference} will be permanently removed from this internship.`,
      danger: true,
      confirmText: 'Delete'
    });
    if (!ok) {
      return;
    }
    this.documentsSvc
      .delete(doc.id)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: () => {
          this.toast.success('Document deleted', doc.reference);
          this.load();
        },
        error: (error: { message?: string }) => {
          this.toast.error('Delete failed', error.message ?? 'Could not delete document.');
        }
      });
  }

  protected save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.submitting()) {
      return;
    }
    const v = this.form.getRawValue();
    const request: UploadDocumentRequest = {
      type: v.type,
      internshipId: v.internshipId,
      storageKey: v.storageKey,
      mimeType: v.mimeType || undefined,
      size: v.size ?? undefined
    };
    this.submitting.set(true);
    this.documentsSvc
      .upload(request)
      .pipe(takeUntilDestroyed(), finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => {
          this.showRegister.set(false);
          this.toast.success('Document registered', v.storageKey);
          this.load();
        },
        error: (error: { message?: string; fieldErrors?: Record<string, string> }) => {
          const msg = error.fieldErrors
            ? Object.values(error.fieldErrors).join(' ')
            : (error.message ?? 'Could not register document.');
          this.toast.error('Save failed', msg);
        }
      });
  }

  protected fieldInvalid(field: 'internshipId' | 'type' | 'storageKey'): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  protected fieldError(field: 'internshipId' | 'type' | 'storageKey'): string | undefined {
    const control = this.form.get(field);
    if (!control || !control.touched) {
      return undefined;
    }
    return control.hasError('required') ? 'This field is required.' : undefined;
  }

  protected formatSize = formatSize;
}
