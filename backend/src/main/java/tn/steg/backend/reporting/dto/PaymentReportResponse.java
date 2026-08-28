package tn.steg.backend.reporting.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

/** Aggregated payment statistics for management reporting. */
@Getter
@Builder
public class PaymentReportResponse {

    private final long total;
    private final long pending;
    private final long validated;
    private final long paid;
    private final long archived;
    private final BigDecimal totalPendingAmount;
    private final BigDecimal totalValidatedAmount;
    private final BigDecimal totalPaidAmount;
}
