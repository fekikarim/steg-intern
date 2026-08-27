package tn.steg.backend.exception;

import tn.steg.backend.common.ApiErrorCode;

/**
 * Thrown when a request violates a domain business rule (illegal state
 * transition, validation rule, etc.). Maps to HTTP 409 by default.
 */
public class BusinessException extends BaseException {

    public BusinessException(String message) {
        super(ApiErrorCode.BUSINESS_RULE_VIOLATION, message);
    }

    public BusinessException(ApiErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
