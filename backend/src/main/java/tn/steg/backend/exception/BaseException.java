package tn.steg.backend.exception;

import lombok.Getter;
import tn.steg.backend.common.ApiErrorCode;

/**
 * Base class for all application exceptions carrying a stable error code.
 */
@Getter
public abstract class BaseException extends RuntimeException {

    private final ApiErrorCode errorCode;

    protected BaseException(ApiErrorCode errorCode, String message) {
        super(message);
        this.errorCode = errorCode != null ? errorCode : ApiErrorCode.INTERNAL_SERVER_ERROR;
    }
}
