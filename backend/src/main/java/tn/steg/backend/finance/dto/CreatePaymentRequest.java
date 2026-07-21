package tn.steg.backend.finance.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import tn.steg.backend.finance.entity.CurrencyCode;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreatePaymentRequest {
    @NotNull(message = "Internship ID is required")
    private UUID internshipId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    private CurrencyCode currency;
}
