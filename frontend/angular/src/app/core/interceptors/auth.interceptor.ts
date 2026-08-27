import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Observable, switchMap, throwError, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

const SKIP_AUTH_PATHS = [
  '/auth/login',
  '/auth/refresh',
  '/auth/logout',
  '/auth/forgot-password',
  '/auth/reset-password'
];

/**
 * Internal marker used to detect a request that has already been replayed
 * after a token refresh. Prevents an infinite 401 → refresh → replay loop
 * when the refreshed access token is also rejected by the backend.
 */
const REFRESHED_HEADER = 'x-steg-refreshed';

/**
 * Attaches the short-lived Bearer access token to every protected request.
 * The access token is held in memory only (never persisted); the persisted
 * refresh token is used to obtain a new access token when the current one
 * expires.
 */
export const authHttpInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isPublicPath(req.url)) {
    return next(req);
  }

  const token = authService.currentAccessToken();
  if (!token) {
    return next(req);
  }

  const authorized = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });
  return next(authorized);
};

/**
 * Observes 401 responses on protected endpoints, triggers a single-flight
 * refresh via the AuthService, and replays the original request with the
 * refreshed token. If refresh fails, the session is cleared and the caller is
 * redirected to login.
 */
export const refreshHttpInterceptorFn: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (isPublicPath(req.url)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: unknown) => {
      if (getStatus(error) !== 401 || wasAlreadyRefreshed(req)) {
        return throwError(() => error);
      }
      return authService.refreshAndRetry(req, next);
    })
  );
}

function wasAlreadyRefreshed(req: HttpRequest<unknown>): boolean {
  return req.headers.has(REFRESHED_HEADER);
}

function getStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status?: number }).status;
  }
  return undefined;
};

function isPublicPath(url: string): boolean {
  return SKIP_AUTH_PATHS.some((path) => url.includes(path));
}
