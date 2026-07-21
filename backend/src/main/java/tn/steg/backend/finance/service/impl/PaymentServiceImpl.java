package tn.steg.backend.finance.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.departments.entity.Employee;
import tn.steg.backend.departments.repository.EmployeeRepository;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.finance.dto.CreatePaymentRequest;
import tn.steg.backend.finance.dto.PaymentResponse;
import tn.steg.backend.finance.entity.CurrencyCode;
import tn.steg.backend.finance.entity.Payment;
import tn.steg.backend.finance.entity.PaymentStatus;
import tn.steg.backend.finance.repository.PaymentRepository;
import tn.steg.backend.finance.service.PaymentService;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.repository.InternshipRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InternshipRepository internshipRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByStatus(PaymentStatus status, Pageable pageable) {
        return paymentRepository.findByStatus(status, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public PaymentResponse createPayment(CreatePaymentRequest request) {
        Internship internship = internshipRepository.findById(request.getInternshipId())
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        Payment payment = Payment.builder()
                .reference("PAY-" + System.currentTimeMillis())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : CurrencyCode.TND)
                .status(PaymentStatus.PENDING)
                .internship(internship)
                .build();

        return toResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponse validatePayment(UUID id, UUID approvedById) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        Employee approver = employeeRepository.findById(approvedById)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (payment.getStatus() != PaymentStatus.PENDING) {
            throw new BusinessException("Only pending payments can be validated");
        }

        payment.setStatus(PaymentStatus.VALIDATED);
        payment.setApprovedBy(approver);
        payment.setApprovedAt(LocalDateTime.now());
        return toResponse(paymentRepository.save(payment));
    }

    @Override
    @Transactional
    public PaymentResponse markAsPaid(UUID id, UUID approvedById) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        Employee approver = employeeRepository.findById(approvedById)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        if (payment.getStatus() != PaymentStatus.VALIDATED) {
            throw new BusinessException("Only validated payments can be marked as paid");
        }

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDate.now());
        payment.setApprovedBy(approver);
        return toResponse(paymentRepository.save(payment));
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId())
                .reference(p.getReference())
                .amount(p.getAmount())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .paymentMethod(p.getPaymentMethod())
                .paymentDate(p.getPaymentDate())
                .approvedAt(p.getApprovedAt())
                .internshipId(p.getInternship().getId())
                .approvedById(p.getApprovedBy() != null ? p.getApprovedBy().getId() : null)
                .approvedByName(p.getApprovedBy() != null ? p.getApprovedBy().getFirstName() + " " + p.getApprovedBy().getLastName() : null)
                .build();
    }
}
