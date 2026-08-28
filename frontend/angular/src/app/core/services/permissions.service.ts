import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Permission } from '../models/admin.model';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.config.apiBaseUrl}/permissions`);
  }
}
