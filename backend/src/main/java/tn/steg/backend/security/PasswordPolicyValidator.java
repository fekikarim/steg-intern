package tn.steg.backend.security;

import org.springframework.stereotype.Component;
import tn.steg.backend.exception.BusinessException;

import java.util.regex.Pattern;

/**
 * Enforces the STEG password policy:
 * <ul>
 *   <li>length between 12 and 128 characters</li>
 *   <li>at least one lowercase, one uppercase, one digit and one special char</li>
 * </ul>
 */
@Component
public class PasswordPolicyValidator {

    public static final int MIN_LENGTH = 12;
    public static final int MAX_LENGTH = 128;

    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern DIGIT = Pattern.compile("\\d");
    private static final Pattern SPECIAL = Pattern.compile("[^A-Za-z0-9]");

    /** The number of most recent passwords that may not be reused. */
    public static final int HISTORY_SIZE = 5;

    public void validate(String rawPassword) {
        if (rawPassword == null) {
            throw new BusinessException("Password is required");
        }
        if (rawPassword.length() < MIN_LENGTH) {
            throw new BusinessException("Password must be at least " + MIN_LENGTH + " characters");
        }
        if (rawPassword.length() > MAX_LENGTH) {
            throw new BusinessException("Password must be at most " + MAX_LENGTH + " characters");
        }
        if (!LOWERCASE.matcher(rawPassword).find()) {
            throw new BusinessException("Password must contain a lowercase letter");
        }
        if (!UPPERCASE.matcher(rawPassword).find()) {
            throw new BusinessException("Password must contain an uppercase letter");
        }
        if (!DIGIT.matcher(rawPassword).find()) {
            throw new BusinessException("Password must contain a digit");
        }
        if (!SPECIAL.matcher(rawPassword).find()) {
            throw new BusinessException("Password must contain a special character");
        }
    }
}
