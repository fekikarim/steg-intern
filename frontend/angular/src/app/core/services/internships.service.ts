import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { CreateInternshipRequest, InternshipResponse, InternshipStatus, InternshipStats } from '../models/internship.model';

@Injectable({ providedIn: 'root' })
export class InternshipsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(pageable: Pageable, filters?: { search?: string; status?: InternshipStatus | '' }): Observable<Page<InternshipResponse>> {
    let params = new HttpParams().set('page', pageable.page).set('size', pageable.size);
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    return this.http.get<Page<InternshipResponse>>(`${this.config.apiBaseUrl}/internships`, { params });
  }

  getStats(): Observable<InternshipStats> {
    return this.http.get<InternshipStats>(`${this.config.apiBaseUrl}/internships/stats`);
  }

  getById(id: string): Observable<InternshipResponse> {
    return this.http.get<InternshipResponse>(`${this.config.apiBaseUrl}/internships/${id}`);
  }

  create(request: CreateInternshipRequest): Observable<InternshipResponse> {
    return this.http.post<InternshipResponse>(`${this.config.apiBaseUrl}/internships`, request);
  }

  updateStatus(id: string, status: InternshipStatus): Observable<InternshipResponse> {
    let params = new HttpParams().set('status', status);
    return this.http.patch<InternshipResponse>(`${this.config.apiBaseUrl}/internships/${id}/status`, null, { params });
  }
}
