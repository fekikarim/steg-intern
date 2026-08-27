package tn.steg.backend.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;

/**
 * One-way hashing for refresh tokens before they are persisted.
 *
 * <p>Storing a digest (SHA-256) rather than the raw token means a database
 * breach does not leak usable credentials, mirroring how passwords are hashed.
 * </p>
 */
@Component
public class TokenHasher {

    private static final String ALGORITHM = "SHA-256";

    public String hash(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance(ALGORITHM);
            byte[] bytes = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
