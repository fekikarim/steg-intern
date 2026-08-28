package tn.steg.backend.reporting.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.finance.entity.PaymentStatus;
import tn.steg.backend.finance.repository.PaymentRepository;
import tn.steg.backend.internships.entity.InternshipStatus;
import tn.steg.backend.internships.repository.InternshipRepository;
import tn.steg.backend.reporting.dto.InternshipReportResponse;
import tn.steg.backend.reporting.dto.PaymentReportResponse;
import tn.steg.backend.reporting.service.ReportingService;

@Service
@RequiredArgsConstructor
public class ReportingServiceImpl implements ReportingService {

    private final InternshipRepository internshipRepository;
    private final PaymentRepository paymentRepository;

    @Override
    @Transactional(readOnly = true)
    public InternshipReportResponse getInternshipReport() {
        return InternshipReportResponse.builder()
                .total(internshipRepository.count())
                .planned(internshipRepository.countByStatus(InternshipStatus.PLANNED))
                .active(internshipRepository.countByStatus(InternshipStatus.ACTIVE))
                .completed(internshipRepository.countByStatus(InternshipStatus.COMPLETED))
                .cancelled(internshipRepository.countByStatus(InternshipStatus.CANCELLED))
                .archived(internshipRepository.countByStatus(InternshipStatus.ARCHIVED))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentReportResponse getPaymentReport() {
        return PaymentReportResponse.builder()
                .total(paymentRepository.count())
                .pending(paymentRepository.countByStatus(PaymentStatus.PENDING))
                .validated(paymentRepository.countByStatus(PaymentStatus.VALIDATED))
                .paid(paymentRepository.countByStatus(PaymentStatus.PAID))
                .archived(paymentRepository.countByStatus(PaymentStatus.ARCHIVED))
                .totalPendingAmount(paymentRepository.sumAmountByStatus(PaymentStatus.PENDING))
                .totalValidatedAmount(paymentRepository.sumAmountByStatus(PaymentStatus.VALIDATED))
                .totalPaidAmount(paymentRepository.sumAmountByStatus(PaymentStatus.PAID))
                .build();
    }
}
