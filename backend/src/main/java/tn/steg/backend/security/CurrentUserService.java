package tn.steg.backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.exception.TokenException;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import tn.steg.backend.users.repository.UserRepository;

/**
 * Resolves the currently authenticated user's identity from the security
 * context, so services never parse JWTs themselves.
 */
@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserRepository userRepository;

    public String currentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw TokenException.invalid("Not authenticated");
        }
        return authentication.getName();
    }

    public boolean isAuthenticated() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(authentication.getPrincipal());
    }

    @Transactional(readOnly = true)
    public User currentUser() {
        return userRepository.findByEmail(currentEmail())
                .orElseThrow(() -> TokenException.invalid("Authenticated user not found"));
    }

    @Transactional(readOnly = true)
    public User loadActiveUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> TokenException.invalid("User not found"));
    }

    public void assertActive(User user) {
        if (!Boolean.TRUE.equals(user.getEnabled())) {
            throw new tn.steg.backend.exception.BusinessException(
                    tn.steg.backend.common.ApiErrorCode.UNAUTHORIZED, "Account is disabled");
        }
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new tn.steg.backend.exception.BusinessException(
                    tn.steg.backend.common.ApiErrorCode.UNAUTHORIZED, "Account is not active");
        }
    }
}
