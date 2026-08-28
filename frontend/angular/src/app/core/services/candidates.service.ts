import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { CreateCandidateRequest } from '../models/admin.model';
import { CandidateResponse, UpdateCandidateRequest } from '../models/internship.model';

@Injectable({ providedIn: 'root' })
export class CandidatesService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(pageable: Pageable, filters?: { search?: string }): Observable<Page<CandidateResponse>> {
    let params = new HttpParams().set('page', pageable.page).set('size', pageable.size);
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    return this.http.get<Page<CandidateResponse>>(`${this.config.apiBaseUrl}/candidates`, { params });
  }

  getById(id: string): Observable<CandidateResponse> {
    return this.http.get<CandidateResponse>(`${this.config.apiBaseUrl}/candidates/${id}`);
  }

  create(request: CreateCandidateRequest): Observable<CandidateResponse> {
    return this.http.post<CandidateResponse>(`${this.config.apiBaseUrl}/candidates`, request);
  }

  update(id: string, request: UpdateCandidateRequest): Observable<CandidateResponse> {
    return this.http.put<CandidateResponse>(`${this.config.apiBaseUrl}/candidates/${id}`, request);
  }
}
