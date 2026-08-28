import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { AssignmentResponse, AssignmentStatus, CreateAssignmentRequest } from '../models/internship.model';

@Injectable({ providedIn: 'root' })
export class AssignmentsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(status?: AssignmentStatus | ''): Observable<AssignmentResponse[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<AssignmentResponse[]>(`${this.config.apiBaseUrl}/assignments`, { params });
  }

  getById(id: string): Observable<AssignmentResponse> {
    return this.http.get<AssignmentResponse>(`${this.config.apiBaseUrl}/assignments/${id}`);
  }

  getByInternship(internshipId: string): Observable<AssignmentResponse[]> {
    return this.http.get<AssignmentResponse[]>(`${this.config.apiBaseUrl}/assignments/internship/${internshipId}`);
  }

  create(request: CreateAssignmentRequest): Observable<AssignmentResponse> {
    return this.http.post<AssignmentResponse>(`${this.config.apiBaseUrl}/assignments`, request);
  }

  updateStatus(id: string, status: AssignmentStatus): Observable<AssignmentResponse> {
    let params = new HttpParams().set('status', status);
    return this.http.patch<AssignmentResponse>(`${this.config.apiBaseUrl}/assignments/${id}/status`, null, { params });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.config.apiBaseUrl}/assignments/${id}`);
  }
}
