package tn.steg.backend.exception;

import tn.steg.backend.common.ApiErrorCode;

/**
 * Thrown when a user account is temporarily locked due to repeated failed
 * login attempts. Maps to HTTP 423 (Locked).
 */
public class AccountLockedException extends BaseException {

    public AccountLockedException(String message) {
        super(ApiErrorCode.ACCOUNT_LOCKED, message);
    }
}
