package tn.steg.backend.observability;

import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.regex.Pattern;

/**
 * Redacts the values of sensitive fields (passwords, tokens, secrets) from log
 * output. Safe against logging of raw JSON request/response bodies: it matches
 * {@code "field" : "value"} patterns and masks the value.
 */
@Component
public class SensitiveDataRedactor {

    private static final Set<String> SENSITIVE_KEYS = Set.of(
            "password", "currentPassword", "newPassword", "oldPassword",
            "refreshToken", "accessToken", "token", "jwt", "secret",
            "authorization", "apiKey", "api_key", "cardNumber", "cvv"
    );

    private static final Pattern JSON_VALUE = Pattern.compile(
            "(\"\\s*(?<key>" + String.join("|", SENSITIVE_KEYS) + ")\\s*\"\\s*:\\s*\")(?<value>[^\"]*)(\")",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern AUTHORIZATION_HEADER =
            Pattern.compile("(?i)(authorization\\s*[:=]\\s*)(Bearer\\s+)?[^\\s,;]+");

    /**
     * Masks sensitive values in the given text. Returns the input unchanged when
     * nothing sensitive is present.
     */
    public String redact(String input) {
        if (input == null || input.isBlank()) {
            return input;
        }
        String redacted = JSON_VALUE.matcher(input).replaceAll("$1***$3");
        redacted = AUTHORIZATION_HEADER.matcher(redacted).replaceAll("$1***");
        return redacted;
    }
}
