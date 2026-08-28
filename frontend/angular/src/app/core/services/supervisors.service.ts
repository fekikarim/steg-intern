import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { SupervisorInternshipResponse, SupervisorResponse } from '../models/internship.model';

@Injectable({ providedIn: 'root' })
export class SupervisorsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(pageable: Pageable, filters?: { search?: string; departmentId?: string }): Observable<Page<SupervisorResponse>> {
    let params = new HttpParams().set('page', pageable.page).set('size', pageable.size);
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.departmentId) {
      params = params.set('departmentId', filters.departmentId);
    }
    return this.http.get<Page<SupervisorResponse>>(`${this.config.apiBaseUrl}/supervisors`, { params });
  }

  getById(id: string): Observable<SupervisorResponse> {
    return this.http.get<SupervisorResponse>(`${this.config.apiBaseUrl}/supervisors/${id}`);
  }

  getAssignedInternships(id: string): Observable<SupervisorInternshipResponse[]> {
    return this.http.get<SupervisorInternshipResponse[]>(`${this.config.apiBaseUrl}/supervisors/${id}/assigned-interns`);
  }
}
