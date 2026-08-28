package tn.steg.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Rate limiting tuning values, externalized per environment.
 *
 * <p>Limits are expressed in requests per minute per client (IP). The filter
 * applies a sliding-window and returns {@code 429 RATE_LIMIT_EXCEEDED} when a
 * window is exhausted. Auth endpoints use a stricter budget to blunt
 * credential-stuffing and password brute-forcing.</p>
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.rate-limit")
public class RateLimitProperties {

    /** Master switch; disable only for local development. */
    private boolean enabled = true;

    /** Default budget: requests per minute per client for ordinary endpoints. */
    private int defaultPerMinute = 100;

    /** Stricter budget for the authentication endpoints. */
    private int authPerMinute = 10;

    /** Budget for sensitive write operations (create/update/delete). */
    private int sensitivePerMinute = 5;
}
