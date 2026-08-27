import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiError } from '../models/api.model';
import { API_ERROR_CODES } from '../constants/api-error.constants';
import { APP_ROUTES } from '../constants/route.constants';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private readonly router = inject(Router);

  /**
   * Builds a normalized ApiError from any thrown value.
   * Preserves the backend error envelope when present, otherwise derives a
   * sensible fallback from the HTTP status.
   */
  normalize(error: unknown): ApiError {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as Partial<ApiError> | undefined;
      if (body && typeof body.code === 'string' && typeof body.status === 'number') {
        return {
          code: body.code,
          status: body.status,
          message: body.message ?? 'An unexpected error occurred',
          timestamp: body.timestamp,
          path: body.path,
          fieldErrors: body.fieldErrors
        };
      }
      return this.fallbackForStatus(error.status);
    }
    if (isApiError(error)) {
      return error;
    }
    return {
      code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
      status: 0,
      message: 'An unexpected error occurred. Please try again.'
    };
  }

  /** Human-friendly title for a normalized error (used in alerts/toasts). */
  title(error: ApiError): string {
    switch (error.code) {
      case API_ERROR_CODES.VALIDATION_ERROR:
        return 'Validation failed';
      case API_ERROR_CODES.UNAUTHORIZED:
        return 'Authentication required';
      case API_ERROR_CODES.FORBIDDEN:
        return 'Access denied';
      case API_ERROR_CODES.RESOURCE_NOT_FOUND:
        return 'Not found';
      case API_ERROR_CODES.RESOURCE_CONFLICT:
      case API_ERROR_CODES.BUSINESS_RULE_VIOLATION:
      case API_ERROR_CODES.DATA_INTEGRITY_VIOLATION:
        return 'Operation failed';
      case API_ERROR_CODES.ACCOUNT_LOCKED:
        return 'Account locked';
      case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
        return 'Too many requests';
      case API_ERROR_CODES.INTERNAL_SERVER_ERROR:
        return 'Server error';
      default:
        return 'Something went wrong';
    }
  }

  /** Message guiding the user on what to do next for a given error. */
  message(error: ApiError): string {
    if (error.message) {
      return error.message;
    }
    switch (error.code) {
      case API_ERROR_CODES.UNAUTHORIZED:
        return 'Your session has expired. Please sign in again.';
      case API_ERROR_CODES.FORBIDDEN:
        return 'You do not have permission to access this resource.';
      case API_ERROR_CODES.RESOURCE_NOT_FOUND:
        return 'The requested resource could not be found.';
      case API_ERROR_CODES.RATE_LIMIT_EXCEEDED:
        return 'You have made too many requests. Please wait a moment and try again.';
      default:
        return 'Please try again.';
    }
  }

  /** Navigates to the appropriate error/status page, if any. */
  handleUnrecoverable(error: ApiError): void {
    if (error.code === API_ERROR_CODES.FORBIDDEN) {
      this.router.navigate([APP_ROUTES.forbidden]);
    } else if (error.code === API_ERROR_CODES.UNAUTHORIZED) {
      this.router.navigate([APP_ROUTES.login]);
    }
  }

  private fallbackForStatus(status: number): ApiError {
    switch (status) {
      case 0:
        return {
          code: API_ERROR_CODES.INTERNAL_SERVER_ERROR,
          status: 0,
          message: 'Unable to reach the server. Check your connection and try again.'
        };
      case 400:
        return { code: API_ERROR_CODES.MALFORMED_REQUEST, status, message: 'The request was invalid.' };
      case 401:
        return { code: API_ERROR_CODES.UNAUTHORIZED, status, message: 'Your session has expired.' };
      case 403:
        return { code: API_ERROR_CODES.FORBIDDEN, status, message: 'You do not have permission.' };
      case 404:
        return { code: API_ERROR_CODES.RESOURCE_NOT_FOUND, status, message: 'The resource was not found.' };
      case 429:
        return { code: API_ERROR_CODES.RATE_LIMIT_EXCEEDED, status, message: 'Too many requests. Try again later.' };
      default:
        return { code: API_ERROR_CODES.INTERNAL_SERVER_ERROR, status, message: 'An unexpected error occurred.' };
    }
  }
}

function isApiError(value: unknown): value is ApiError {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as ApiError).code === 'string' &&
    typeof (value as ApiError).status === 'number'
  );
}
