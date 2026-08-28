package tn.steg.backend.reporting.service;

import tn.steg.backend.reporting.dto.InternshipReportResponse;
import tn.steg.backend.reporting.dto.PaymentReportResponse;

public interface ReportingService {
    InternshipReportResponse getInternshipReport();
    PaymentReportResponse getPaymentReport();
}
