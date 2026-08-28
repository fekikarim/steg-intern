import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { DocumentResponse, UploadDocumentRequest } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getByInternship(internshipId: string): Observable<DocumentResponse[]> {
    return this.http.get<DocumentResponse[]>(
      `${this.config.apiBaseUrl}/documents/internship/${internshipId}`
    );
  }

  upload(request: UploadDocumentRequest): Observable<DocumentResponse> {
    return this.http.post<DocumentResponse>(`${this.config.apiBaseUrl}/documents/upload`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiBaseUrl}/documents/${id}`);
  }
}
