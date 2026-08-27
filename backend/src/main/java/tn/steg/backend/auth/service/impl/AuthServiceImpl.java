package tn.steg.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.auth.dto.AuthResponse;
import tn.steg.backend.auth.dto.ChangePasswordRequest;
import tn.steg.backend.auth.dto.ForgotPasswordRequest;
import tn.steg.backend.auth.dto.LoginRequest;
import tn.steg.backend.auth.dto.RegisterRequest;
import tn.steg.backend.auth.dto.ResetPasswordRequest;
import tn.steg.backend.auth.service.AccountLockoutService;
import tn.steg.backend.auth.service.AuthService;
import tn.steg.backend.candidates.entity.Candidate;
import tn.steg.backend.candidates.repository.CandidateRepository;
import tn.steg.backend.audit.annotation.Audited;
import tn.steg.backend.common.ApiErrorCode;
import tn.steg.backend.common.email.EmailService;
import tn.steg.backend.config.SecurityProperties;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.exception.TokenException;
import tn.steg.backend.security.CurrentUserService;
import tn.steg.backend.security.JwtTokenProvider;
import tn.steg.backend.security.PasswordPolicyValidator;
import tn.steg.backend.security.TokenHasher;
import tn.steg.backend.users.dto.UserProfileResponse;
import tn.steg.backend.users.entity.PasswordHistory;
import tn.steg.backend.users.entity.PasswordResetToken;
import tn.steg.backend.users.entity.RefreshToken;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import tn.steg.backend.users.repository.PasswordHistoryRepository;
import tn.steg.backend.users.repository.PasswordResetTokenRepository;
import tn.steg.backend.users.repository.RefreshTokenRepository;
import tn.steg.backend.users.repository.RoleRepository;
import tn.steg.backend.users.repository.UserRepository;
import tn.steg.backend.users.service.UserService;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenHasher tokenHasher;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CandidateRepository candidateRepository;
    private final AccountLockoutService lockoutService;
    private final CurrentUserService currentUserService;
    private final PasswordPolicyValidator passwordPolicy;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserService userService;
    private final EmailService emailService;
    private final SecurityProperties securityProperties;

    @Override
    @Audited(action = "LOGIN", entity = "AUTH", newValue = "#args[0].email")
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        lockoutService.checkNotLocked(user.getId());
        user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
        currentUserService.assertActive(user);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            lockoutService.onSuccess(user.getId());
            return issueTokens(authentication, user.getId(), null);
        } catch (BadCredentialsException ex) {
            lockoutService.recordFailedAttempt(user.getId());
            throw new BadCredentialsException("Invalid credentials");
        }
    }

    @Override
    @Transactional
    @Audited(action = "REFRESH", entity = "AUTH")
    public AuthResponse refreshToken(String rawRefreshToken) {
        String tokenHash = tokenHasher.hash(rawRefreshToken);

        RefreshToken stored = refreshTokenRepository.findByToken(tokenHash)
                .orElseThrow(() -> TokenException.invalid("Invalid refresh token"));

        if (Boolean.TRUE.equals(stored.getRevoked())) {
            // Reuse of a revoked token: treat as a potential theft, revoke the whole family.
            refreshTokenRepository.revokeAllActiveForUser(stored.getUser().getId());
            log.warn("Refresh token reuse detected for user {}", stored.getUser().getId());
            throw TokenException.revoked("Refresh token has been revoked. Please sign in again.");
        }

        if (stored.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw TokenException.expired("Refresh token has expired. Please sign in again.");
        }

        User user = stored.getUser();
        if (!Boolean.TRUE.equals(user.getEnabled()) || user.getStatus() != UserStatus.ACTIVE) {
            throw TokenException.invalid("Account is not active");
        }

        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getEmail());
        String newRawRefreshToken = generateOpaqueToken();

        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        refreshTokenRepository.save(RefreshToken.builder()
                .token(tokenHasher.hash(newRawRefreshToken))
                .expiryDate(LocalDateTime.now().plus(java.time.Duration.ofMillis(jwtTokenProvider.getRefreshTokenExpiration())))
                .revoked(false)
                .user(user)
                .build());

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build();
    }

    @Override
    @Transactional
    @Audited(action = "LOGOUT", entity = "AUTH")
    public void logout(String rawRefreshToken) {
        String tokenHash = tokenHasher.hash(rawRefreshToken);
        refreshTokenRepository.findByToken(tokenHash).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    @Override
    @Transactional
    @Audited(action = "REGISTER", entity = "USER", newValue = "#args[0].email")
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ApiErrorCode.RESOURCE_CONFLICT, "Email already registered");
        }

        passwordPolicy.validate(request.getPassword());

        var candidateRole = roleRepository.findByName("CANDIDATE")
                .orElseThrow(() -> new BusinessException("Candidate role not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .status(UserStatus.ACTIVE)
                .failedLoginAttempts(0)
                .role(candidateRole)
                .build();
        userRepository.save(user);

        recordPasswordHistory(user, request.getPassword());

        Candidate candidate = Candidate.builder()
                .user(user)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .contactEmail(request.getEmail())
                .phone(request.getPhone())
                .university(request.getUniversity())
                .speciality(request.getSpeciality())
                .build();
        candidateRepository.save(candidate);
        log.info("Registered new candidate account {}", request.getEmail());
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse me() {
        return userService.getCurrentUserProfile();
    }

    @Override
    @Transactional
    @Audited(action = "CHANGE_PASSWORD", entity = "AUTH")
    public void changePassword(ChangePasswordRequest request) {
        User user = currentUserService.currentUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Current password is incorrect");
        }
        passwordPolicy.validate(request.getNewPassword());
        ensureNotReused(user, request.getNewPassword());

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        recordPasswordHistory(user, request.getNewPassword());

        // Invalidate all existing sessions/tokens after a password change.
        refreshTokenRepository.revokeAllActiveForUser(user.getId());
        passwordResetTokenRepository.deleteByUserId(user.getId());
        log.info("Password changed for user {}", user.getEmail());
    }

    @Override
    @Transactional
    @Audited(action = "FORGOT_PASSWORD", entity = "AUTH", newValue = "#args[0].email")
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = generateOpaqueToken();
            PasswordResetToken reset = PasswordResetToken.builder()
                    .token(tokenHasher.hash(token))
                    .expiryDate(LocalDateTime.now().plus(securityProperties.getPasswordResetTokenTtl()))
                    .used(false)
                    .user(user)
                    .build();
            passwordResetTokenRepository.save(reset);
            emailService.send(user.getEmail(), "STEG - Password Reset",
                    "Use this link to reset your password. It expires in 15 minutes.\nToken: " + token);
        });
        // Always succeed to avoid user enumeration.
    }

    @Override
    @Transactional
    @Audited(action = "RESET_PASSWORD", entity = "AUTH")
    public void resetPassword(ResetPasswordRequest request) {
        String tokenHash = tokenHasher.hash(request.getToken());
        PasswordResetToken reset = passwordResetTokenRepository.findByToken(tokenHash)
                .orElseThrow(() -> TokenException.invalid("Invalid or expired reset token"));

        if (reset.isExpired() || Boolean.TRUE.equals(reset.getUsed())) {
            throw TokenException.expired("Reset token is expired or already used");
        }

        passwordPolicy.validate(request.getNewPassword());

        User user = reset.getUser();
        ensureNotReused(user, request.getNewPassword());

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setStatus(UserStatus.ACTIVE);
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        reset.setUsed(true);
        passwordResetTokenRepository.save(reset);
        recordPasswordHistory(user, request.getNewPassword());

        refreshTokenRepository.revokeAllActiveForUser(user.getId());
        log.info("Password reset completed for user {}", user.getEmail());
    }

    @Transactional
    private AuthResponse issueTokens(Authentication authentication, UUID userId, String ip) {
        User user = userRepository.findById(userId).orElseThrow();
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String rawRefreshToken = generateOpaqueToken();

        refreshTokenRepository.save(RefreshToken.builder()
                .token(tokenHasher.hash(rawRefreshToken))
                .expiryDate(LocalDateTime.now().plus(java.time.Duration.ofMillis(jwtTokenProvider.getRefreshTokenExpiration())))
                .revoked(false)
                .createdByIp(ip)
                .user(user)
                .build());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(rawRefreshToken)
                .tokenType("Bearer")
                .expiresIn(jwtTokenProvider.getAccessTokenExpiration() / 1000)
                .build();
    }

    private void recordPasswordHistory(User user, String rawPassword) {
        passwordHistoryRepository.save(PasswordHistory.builder()
                .user(user)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .usedAt(LocalDateTime.now())
                .build());
        pruneHistory(user.getId());
    }

    private void pruneHistory(UUID userId) {
        List<PasswordHistory> history =
                passwordHistoryRepository.findHistoryByUserId(userId);
        int overflow = history.size() - PasswordPolicyValidator.HISTORY_SIZE;
        for (int i = 0; i < overflow; i++) {
            PasswordHistory oldest = history.get(history.size() - 1 - i);
            passwordHistoryRepository.delete(oldest);
        }
    }

    private void ensureNotReused(User user, String rawPassword) {
        boolean reused = passwordHistoryRepository.findHistoryByUserId(user.getId())
                .stream()
                .map(PasswordHistory::getPasswordHash)
                .anyMatch(h -> passwordEncoder.matches(rawPassword, h));
        if (reused) {
            throw new BusinessException("Password was used recently. Choose a different password.");
        }
    }

    private String generateOpaqueToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
