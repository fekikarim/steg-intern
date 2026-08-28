import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { DepartmentResponse, CreateDepartmentRequest } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class DepartmentsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(): Observable<DepartmentResponse[]> {
    return this.http.get<DepartmentResponse[]>(`${this.config.apiBaseUrl}/departments`);
  }

  getById(id: string): Observable<DepartmentResponse> {
    return this.http.get<DepartmentResponse>(`${this.config.apiBaseUrl}/departments/${id}`);
  }

  create(request: CreateDepartmentRequest): Observable<DepartmentResponse> {
    return this.http.post<DepartmentResponse>(`${this.config.apiBaseUrl}/departments`, request);
  }

  update(id: string, request: CreateDepartmentRequest): Observable<DepartmentResponse> {
    return this.http.put<DepartmentResponse>(`${this.config.apiBaseUrl}/departments/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiBaseUrl}/departments/${id}`);
  }
}
