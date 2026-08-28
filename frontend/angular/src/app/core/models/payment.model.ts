export type PaymentStatus = 'PENDING' | 'VALIDATED' | 'PAID' | 'ARCHIVED';
export type PaymentMethod = 'BANK_TRANSFER' | 'CHECK' | 'CASH';
export type CurrencyCode = 'TND' | 'EUR' | 'USD';

export interface PaymentResponse {
  id: string;
  reference: string;
  amount: number;
  currency: CurrencyCode;
  status: PaymentStatus;
  paymentMethod?: PaymentMethod | null;
  paymentDate?: string | null;
  approvedAt?: string | null;
  internshipId: string;
  approvedById?: string | null;
  approvedByName?: string | null;
}

export interface CreatePaymentRequest {
  internshipId: string;
  amount: number;
  currency?: CurrencyCode;
}
