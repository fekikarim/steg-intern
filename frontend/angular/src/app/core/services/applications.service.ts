import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { ApplicationResponse, ApplicationStatus, CreateApplicationRequest } from '../models/internship.model';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(pageable: Pageable, filters?: { search?: string; status?: ApplicationStatus | '' }): Observable<Page<ApplicationResponse>> {
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
    return this.http.get<Page<ApplicationResponse>>(`${this.config.apiBaseUrl}/applications`, { params });
  }

  getById(id: string): Observable<ApplicationResponse> {
    return this.http.get<ApplicationResponse>(`${this.config.apiBaseUrl}/applications/${id}`);
  }

  create(request: CreateApplicationRequest): Observable<ApplicationResponse> {
    return this.http.post<ApplicationResponse>(`${this.config.apiBaseUrl}/applications`, request);
  }

  submit(id: string): Observable<ApplicationResponse> {
    return this.http.patch<ApplicationResponse>(`${this.config.apiBaseUrl}/applications/${id}/submit`, null);
  }

  accept(id: string): Observable<ApplicationResponse> {
    return this.http.patch<ApplicationResponse>(`${this.config.apiBaseUrl}/applications/${id}/accept`, null);
  }

  reject(id: string): Observable<ApplicationResponse> {
    return this.http.patch<ApplicationResponse>(`${this.config.apiBaseUrl}/applications/${id}/reject`, null);
  }

  updateStatus(id: string, status: ApplicationStatus): Observable<ApplicationResponse> {
    let params = new HttpParams().set('status', status);
    return this.http.patch<ApplicationResponse>(`${this.config.apiBaseUrl}/applications/${id}/status`, null, { params });
  }
}
