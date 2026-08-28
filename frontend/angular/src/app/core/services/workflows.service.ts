import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import {
  WorkflowResponse,
  CreateWorkflowRequest,
  ExecuteActionRequest,
  WorkflowActionResponse
} from '../models/workflow.model';

@Injectable({ providedIn: 'root' })
export class WorkflowsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(): Observable<WorkflowResponse[]> {
    return this.http.get<WorkflowResponse[]>(`${this.config.apiBaseUrl}/workflows`);
  }

  getById(id: string): Observable<WorkflowResponse> {
    return this.http.get<WorkflowResponse>(`${this.config.apiBaseUrl}/workflows/${id}`);
  }

  create(request: CreateWorkflowRequest): Observable<WorkflowResponse> {
    return this.http.post<WorkflowResponse>(`${this.config.apiBaseUrl}/workflows`, request);
  }

  executeAction(request: ExecuteActionRequest): Observable<WorkflowActionResponse> {
    return this.http.post<WorkflowActionResponse>(
      `${this.config.apiBaseUrl}/workflows/actions`,
      request
    );
  }
}
