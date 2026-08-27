package tn.steg.backend.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.config.SecurityProperties;
import tn.steg.backend.exception.AccountLockedException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import tn.steg.backend.users.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Tracks and enforces the account lockout policy after repeated failed login
 * attempts.
 *
 * <p>Each operation runs in its own transaction ({@code REQUIRES_NEW}) and
 * re-loads the user by id, so a failed-attempt record persists even when the
 * surrounding login flow rolls back. Passing an id (never a managed entity)
 * avoids cross-transaction instance handling and optimistic-lock conflicts.</p>
 */
@Service
@RequiredArgsConstructor
public class AccountLockoutService {

    private final UserRepository userRepository;
    private final SecurityProperties properties;

    /**
     * Must be called before authenticating. Throws {@link AccountLockedException}
     * if the account is currently locked, otherwise clears an expired lock.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User checkNotLocked(UUID userId) {
        User user = requireUser(userId);
        if (user.isLocked()) {
            throw new AccountLockedException(
                    "Account temporarily locked. Try again later or contact an administrator.");
        }
        if (user.getLockedUntil() != null && !user.getLockedUntil().isAfter(LocalDateTime.now())) {
            user.setLockedUntil(null);
            user.setFailedLoginAttempts(0);
            user.setStatus(UserStatus.ACTIVE);
            userRepository.save(user);
        }
        return user;
    }

    /**
     * Records a failed login attempt (commits even if the caller rolls back).
     * Once the threshold is reached the account is locked.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordFailedAttempt(UUID userId) {
        User user = requireUser(userId);
        int attempts = user.getFailedLoginAttempts() == null ? 0 : user.getFailedLoginAttempts();
        attempts++;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= properties.getMaxFailedLoginAttempts()) {
            user.setLockedUntil(LocalDateTime.now().plus(properties.getLockoutDuration()));
            user.setStatus(UserStatus.LOCKED);
            user.setFailedLoginAttempts(0);
        }
        userRepository.save(user);
    }

    /** Called after a successful login to reset the failure counter and stamp last login. */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public User onSuccess(UUID userId) {
        User user = requireUser(userId);
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setLastLoginAt(LocalDateTime.now());
        if (user.getStatus() == UserStatus.LOCKED) {
            user.setStatus(UserStatus.ACTIVE);
        }
        return userRepository.save(user);
    }

    /** Administrative unlock: clears the lock and failure counter. */
    @Transactional
    public void unlock(UUID userId) {
        User user = requireUser(userId);
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    private User requireUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
