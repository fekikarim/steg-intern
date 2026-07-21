package tn.steg.backend.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.finance.entity.CurrencyCode;
import tn.steg.backend.finance.entity.PaymentMethod;
import tn.steg.backend.finance.entity.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private UUID id;
    private String reference;
    private BigDecimal amount;
    private CurrencyCode currency;
    private PaymentStatus status;
    private PaymentMethod paymentMethod;
    private LocalDate paymentDate;
    private LocalDateTime approvedAt;
    private UUID internshipId;
    private UUID approvedById;
    private String approvedByName;
}
