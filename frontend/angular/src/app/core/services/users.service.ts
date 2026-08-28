import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { UserResponse } from '../models/user.model';
import { CreateUserRequest, UpdateUserRequest } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(pageable: Pageable, filters?: { search?: string; roleName?: string; status?: string }): Observable<Page<UserResponse>> {
    let params = new HttpParams()
      .set('page', pageable.page)
      .set('size', pageable.size);
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.roleName) {
      params = params.set('roleName', filters.roleName);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    return this.http.get<Page<UserResponse>>(`${this.config.apiBaseUrl}/users`, { params });
  }

  getById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.config.apiBaseUrl}/users/${id}`);
  }

  create(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.config.apiBaseUrl}/users`, request);
  }

  update(id: string, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.config.apiBaseUrl}/users/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiBaseUrl}/users/${id}`);
  }

  enable(id: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/users/${id}/enable`, null);
  }

  disable(id: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/users/${id}/disable`, null);
  }

  lock(id: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/users/${id}/lock`, null);
  }

  unlock(id: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/users/${id}/unlock`, null);
  }
}
