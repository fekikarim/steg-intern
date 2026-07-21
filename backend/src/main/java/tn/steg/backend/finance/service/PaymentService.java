package tn.steg.backend.finance.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.finance.dto.CreatePaymentRequest;
import tn.steg.backend.finance.dto.PaymentResponse;
import tn.steg.backend.finance.entity.PaymentStatus;

import java.util.UUID;

public interface PaymentService {
    Page<PaymentResponse> getAllPayments(Pageable pageable);
    Page<PaymentResponse> getPaymentsByStatus(PaymentStatus status, Pageable pageable);
    PaymentResponse createPayment(CreatePaymentRequest request);
    PaymentResponse validatePayment(UUID id, UUID approvedById);
    PaymentResponse markAsPaid(UUID id, UUID approvedById);
}
