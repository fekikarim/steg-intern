import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { InternshipReportResponse, PaymentReportResponse } from '../models/report.model';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getInternshipReport(): Observable<InternshipReportResponse> {
    return this.http.get<InternshipReportResponse>(`${this.config.apiBaseUrl}/reporting/internships`);
  }

  getPaymentReport(): Observable<PaymentReportResponse> {
    return this.http.get<PaymentReportResponse>(`${this.config.apiBaseUrl}/reporting/payments`);
  }
}
