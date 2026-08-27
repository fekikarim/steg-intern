import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ErrorService } from './error.service';
import { API_ERROR_CODES } from '../constants/api-error.constants';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    });
    service = TestBed.inject(ErrorService);
  });

  it('normalizes a backend envelope', () => {
    const error = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
      error: {
        timestamp: '2026-08-27T10:00:00Z',
        code: 'VALIDATION_ERROR',
        status: 422,
        message: 'email is invalid',
        path: '/api/v1/auth/login',
        fieldErrors: { email: 'must be a well-formed email address' }
      }
    });
    const result = service.normalize(error);
    expect(result.code).toBe('VALIDATION_ERROR');
    expect(result.status).toBe(422);
    expect(result.message).toBe('email is invalid');
    expect(result.path).toBe('/api/v1/auth/login');
    expect(result.fieldErrors?.['email']).toBe('must be a well-formed email address');
  });

  it('falls back for a bare HTTP status (401)', () => {
    const error = new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' });
    const result = service.normalize(error);
    expect(result.code).toBe(API_ERROR_CODES.UNAUTHORIZED);
    expect(result.status).toBe(401);
  });

  it('falls back for network errors (status 0)', () => {
    const error = new HttpErrorResponse({ status: 0, error: new ProgressEvent('error') });
    const result = service.normalize(error);
    expect(result.code).toBe(API_ERROR_CODES.INTERNAL_SERVER_ERROR);
    expect(result.status).toBe(0);
  });

  it('returns the api error as-is when already normalized', () => {
    const apiError = { code: 'FORBIDDEN', status: 403, message: 'no' };
    expect(service.normalize(apiError)).toEqual(apiError);
  });

  it('maps titles per code', () => {
    expect(service.title({ code: 'UNAUTHORIZED', status: 401, message: 'x' })).toBe('Authentication required');
    expect(service.title({ code: 'VALIDATION_ERROR', status: 422, message: 'x' })).toBe('Validation failed');
    expect(service.title({ code: 'FORBIDDEN', status: 403, message: 'x' })).toBe('Access denied');
  });

  it('uses message over defaults and provides guidance for message-less errors', () => {
    expect(service.message({ code: 'UNAUTHORIZED', status: 401, message: 'bad creds' })).toBe('bad creds');
    expect(service.message({ code: 'UNAUTHORIZED', status: 401, message: '' })).toContain('sign in again');
  });
});
