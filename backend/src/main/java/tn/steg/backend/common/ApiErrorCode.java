package tn.steg.backend.common;

import lombok.Getter;

/**
 * Canonical error codes returned to API clients.
 *
 * <p>The backend is the single source of truth for business rules and
 * error semantics. Each code maps to one HTTP status and is used by all
 * clients (Angular, Next.js, Flutter) without re-deriving the meaning.</p>
 */
@Getter
public enum ApiErrorCode {

    // Generic
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", 500),

    // Client errors
    VALIDATION_ERROR("VALIDATION_ERROR", 422),
    BUSINESS_RULE_VIOLATION("BUSINESS_RULE_VIOLATION", 409),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", 404),
    RESOURCE_CONFLICT("RESOURCE_CONFLICT", 409),
    UNAUTHORIZED("UNAUTHORIZED", 401),
    FORBIDDEN("FORBIDDEN", 403),
    MALFORMED_REQUEST("MALFORMED_REQUEST", 400),
    MISSING_PARAMETER("MISSING_PARAMETER", 400),
    TYPE_MISMATCH("TYPE_MISMATCH", 400),
    DATA_INTEGRITY_VIOLATION("DATA_INTEGRITY_VIOLATION", 409),
    RATE_LIMIT_EXCEEDED("RATE_LIMIT_EXCEEDED", 429),
    TOKEN_EXPIRED("TOKEN_EXPIRED", 401),
    TOKEN_REVOKED("TOKEN_REVOKED", 401),
    TOKEN_INVALID("TOKEN_INVALID", 401),
    ACCOUNT_LOCKED("ACCOUNT_LOCKED", 423);

    private final String code;
    private final int status;

    ApiErrorCode(String code, int status) {
        this.code = code;
        this.status = status;
    }

    public String value() {
        return code;
    }
}
