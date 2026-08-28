import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { AuditResponse } from '../models/admin.model';

export interface AuditFilters {
  actor?: string;
  action?: string;
  entityName?: string;
  from?: string;
  to?: string;
}

@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  search(pageable: Pageable, filters?: AuditFilters): Observable<Page<AuditResponse>> {
    let params = new HttpParams()
      .set('page', pageable.page)
      .set('size', pageable.size);
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    if (filters?.actor) {
      params = params.set('actor', filters.actor);
    }
    if (filters?.action) {
      params = params.set('action', filters.action);
    }
    if (filters?.entityName) {
      params = params.set('entityName', filters.entityName);
    }
    if (filters?.from) {
      params = params.set('from', filters.from);
    }
    if (filters?.to) {
      params = params.set('to', filters.to);
    }
    return this.http.get<Page<AuditResponse>>(`${this.config.apiBaseUrl}/audit`, { params });
  }
}
