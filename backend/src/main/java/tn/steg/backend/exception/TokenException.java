package tn.steg.backend.exception;

import tn.steg.backend.common.ApiErrorCode;

/**
 * Thrown for refresh/access token lifecycle failures (invalid, expired,
 * revoked). All map to HTTP 401 so clients transparently re-authenticate.
 */
public class TokenException extends BaseException {

    public TokenException(ApiErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public static TokenException invalid(String message) {
        return new TokenException(ApiErrorCode.TOKEN_INVALID, message);
    }

    public static TokenException expired(String message) {
        return new TokenException(ApiErrorCode.TOKEN_EXPIRED, message);
    }

    public static TokenException revoked(String message) {
        return new TokenException(ApiErrorCode.TOKEN_REVOKED, message);
    }
}
