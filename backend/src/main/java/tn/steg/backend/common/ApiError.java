package tn.steg.backend.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

/**
 * Unified, machine-readable error envelope returned for every failure.
 *
 * <p>Fields intentionally omit internal details (no stack traces, no SQL).
 * All clients rely on {@link #getCode()} for typed handling and on
 * {@link #getFieldErrors()} for per-field validation feedback.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {

    private Instant timestamp;

    /** Stable machine-readable code, e.g. VALIDATION_ERROR. */
    private String code;

    /** Corresponding HTTP status code. */
    private int status;

    /** Human-readable, client-safe description. */
    private String message;

    /** Request path that produced the error, when available. */
    private String path;

    /** Per-field validation messages (VALIDATION_ERROR only). */
    private Map<String, String> fieldErrors;

    public static ApiError of(ApiErrorCode apiErrorCode, String message) {
        ApiErrorCode effective = apiErrorCode != null ? apiErrorCode : ApiErrorCode.INTERNAL_SERVER_ERROR;
        return ApiError.builder()
                .timestamp(Instant.now())
                .code(effective.value())
                .status(effective.getStatus())
                .message(message)
                .build();
    }
}
