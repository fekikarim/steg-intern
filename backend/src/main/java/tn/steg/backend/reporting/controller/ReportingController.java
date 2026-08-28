package tn.steg.backend.reporting.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.steg.backend.reporting.dto.InternshipReportResponse;
import tn.steg.backend.reporting.dto.PaymentReportResponse;
import tn.steg.backend.reporting.service.ReportingService;

@RestController
@RequestMapping("/reporting")
@RequiredArgsConstructor
@Tag(name = "Reporting", description = "Aggregated management reports and analytics")
public class ReportingController {

    private final ReportingService reportingService;

    @GetMapping("/internships")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'DIRECTOR', 'HR_MANAGER', 'FINANCE_MANAGER')")
    @Operation(summary = "Internship statistics report")
    public ResponseEntity<InternshipReportResponse> internshipReport() {
        return ResponseEntity.ok(reportingService.getInternshipReport());
    }

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'DIRECTOR', 'FINANCE_MANAGER')")
    @Operation(summary = "Payment statistics report")
    public ResponseEntity<PaymentReportResponse> paymentReport() {
        return ResponseEntity.ok(reportingService.getPaymentReport());
    }
}
