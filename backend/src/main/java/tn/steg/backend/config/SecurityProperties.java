package tn.steg.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Central security tuning values, externalized so they can be adjusted per
 * environment without code changes.
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.security")
public class SecurityProperties {

    /** Max failed login attempts before the account is locked. */
    private int maxFailedLoginAttempts = 5;

    /** How long an account stays locked after too many failures. */
    private Duration lockoutDuration = Duration.ofMinutes(15);

    /** Lifetime of a password reset token. */
    private Duration passwordResetTokenTtl = Duration.ofMinutes(15);

    /** Whether the application requires HTTPS in production. */
    private boolean requireHttps = false;
}
