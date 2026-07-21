package tn.steg.backend.finance.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import tn.steg.backend.finance.dto.CreatePaymentRequest;
import tn.steg.backend.finance.dto.PaymentResponse;
import tn.steg.backend.finance.entity.PaymentStatus;
import tn.steg.backend.finance.service.PaymentService;
import tn.steg.backend.users.repository.UserRepository;

import java.util.UUID;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Financial payment management")
public class PaymentController {

    private final PaymentService paymentService;
    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'FINANCE_MANAGER', 'DIRECTOR')")
    @Operation(summary = "Get all payments")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        return ResponseEntity.ok(paymentService.getAllPayments(pageable));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'FINANCE_MANAGER')")
    @Operation(summary = "Create payment")
    public ResponseEntity<PaymentResponse> create(@Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(request));
    }

    @PatchMapping("/{id}/validate")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'FINANCE_MANAGER')")
    @Operation(summary = "Validate payment")
    public ResponseEntity<PaymentResponse> validate(@PathVariable UUID id, Authentication auth) {
        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(paymentService.validatePayment(id, user.getId()));
    }

    @PatchMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('ADMINISTRATOR', 'FINANCE_MANAGER')")
    @Operation(summary = "Mark payment as paid")
    public ResponseEntity<PaymentResponse> markAsPaid(@PathVariable UUID id, Authentication auth) {
        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(paymentService.markAsPaid(id, user.getId()));
    }
}
