import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { DashboardStats } from '../models/dashboard.model';

/**
 * Loads aggregate dashboard counters from the backend. Consumers should
 * subscribe imperatively (e.g. in component lifecycle methods) rather than
 * leaking a shared replay between unrelated components.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.config.apiBaseUrl}/dashboard/stats`);
  }
}
