import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { RoleResponse } from '../models/user.model';
import { CreateRoleRequest, UpdateRoleRequest } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(): Observable<RoleResponse[]> {
    return this.http.get<RoleResponse[]>(`${this.config.apiBaseUrl}/roles`);
  }

  getById(id: string): Observable<RoleResponse> {
    return this.http.get<RoleResponse>(`${this.config.apiBaseUrl}/roles/${id}`);
  }

  create(request: CreateRoleRequest): Observable<RoleResponse> {
    return this.http.post<RoleResponse>(`${this.config.apiBaseUrl}/roles`, request);
  }

  update(id: string, request: UpdateRoleRequest): Observable<RoleResponse> {
    return this.http.put<RoleResponse>(`${this.config.apiBaseUrl}/roles/${id}`, request);
  }
}
