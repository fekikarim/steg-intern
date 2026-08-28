export interface InternshipReportResponse {
  total: number;
  planned: number;
  active: number;
  completed: number;
  cancelled: number;
  archived: number;
}

export interface PaymentReportResponse {
  total: number;
  pending: number;
  validated: number;
  paid: number;
  archived: number;
  totalPendingAmount: number;
  totalValidatedAmount: number;
  totalPaidAmount: number;
}
