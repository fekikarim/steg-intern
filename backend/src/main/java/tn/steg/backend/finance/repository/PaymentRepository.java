package tn.steg.backend.finance.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.finance.entity.Payment;
import tn.steg.backend.finance.entity.PaymentStatus;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByReference(String reference);
    Page<Payment> findByStatus(PaymentStatus status, Pageable pageable);
    Page<Payment> findByInternshipId(UUID internshipId, Pageable pageable);
    long countByStatus(PaymentStatus status);
}
