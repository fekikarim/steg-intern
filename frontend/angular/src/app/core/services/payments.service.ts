import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { Page, Pageable } from '../models/api.model';
import { PaymentResponse, PaymentStatus, CreatePaymentRequest } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getAll(pageable: Pageable, status?: PaymentStatus | ''): Observable<Page<PaymentResponse>> {
    let params = new HttpParams().set('page', pageable.page).set('size', pageable.size);
    if (pageable.sort) {
      params = params.set('sort', pageable.sort);
    }
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<Page<PaymentResponse>>(`${this.config.apiBaseUrl}/payments`, { params });
  }

  create(request: CreatePaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.config.apiBaseUrl}/payments`, request);
  }

  validate(id: string): Observable<PaymentResponse> {
    return this.http.patch<PaymentResponse>(`${this.config.apiBaseUrl}/payments/${id}/validate`, null);
  }

  markAsPaid(id: string): Observable<PaymentResponse> {
    return this.http.patch<PaymentResponse>(`${this.config.apiBaseUrl}/payments/${id}/pay`, null);
  }
}
