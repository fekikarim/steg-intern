import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import {
  Observable,
  catchError,
  EMPTY,
  finalize,
  map,
  of,
  shareReplay,
  switchMap,
  tap
} from 'rxjs';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../config/app.config';
import { AuthResponse, LoginRequest, RefreshTokenRequest } from '../models/auth.model';
import { UserProfile } from '../models/user.model';
import { AuthStateService } from './auth-state.service';
import { TokenStorageService } from './token-storage.service';
import { UserService } from './user.service';
import { APP_ROUTES } from '../constants/route.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly config = inject(APP_CONFIG);
  private readonly storage = inject(TokenStorageService);
  private readonly state = inject(AuthStateService);
  private readonly userService = inject(UserService);

  private refreshInFlight: Observable<AuthResponse | null> | null = null;

  /** Current in-memory access token, exposed for interceptors. */
  currentAccessToken(): string | null {
    return this.state.currentToken();
  }

  login(credentials: LoginRequest, rememberMe: boolean): Observable<UserProfile> {
    return this.http
      .post<AuthResponse>(`${this.config.apiBaseUrl}/auth/login`, credentials)
      .pipe(switchMap((auth) => this.establishSession(auth, rememberMe)));
  }

  /** Attempts a silent session restore using a persisted refresh token. */
  restoreSession(): Observable<boolean> {
    if (this.state.isAuthenticated()) {
      return of(true);
    }
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      this.state.clearSession();
      return of(false);
    }
    return this.refreshSession();
  }

  refreshSession(): Observable<boolean> {
    return this.performRefresh().pipe(map((auth) => auth !== null));
  }

  /**
   * Replays a failed request after a single-flight token refresh. Returns the
   * retried HTTP event stream, or redirects to login when refresh fails / the
   * retried request is still unauthorized.
   */
  refreshAndRetry<T>(req: HttpRequest<T>, next: HttpHandlerFn): Observable<HttpEvent<T>> {
    return this.performRefresh().pipe(
      switchMap((auth): Observable<HttpEvent<T>> => {
        if (!auth) {
          return EMPTY;
        }
        const retried = req.clone({
          setHeaders: {
            Authorization: `Bearer ${auth.accessToken}`,
            'x-steg-refreshed': 'true'
          }
        });
        return next(retried) as Observable<HttpEvent<T>>;
      }),
      catchError((error) => {
        this.clearSession();
        this.router.navigate([APP_ROUTES.login]);
        return EMPTY;
      })
    );
  }

  logout(): Observable<void> {
    const refreshToken = this.storage.getRefreshToken();
    const request = refreshToken
      ? this.http
          .post<void>(`${this.config.apiBaseUrl}/auth/logout`, { refreshToken } satisfies RefreshTokenRequest)
          .pipe(catchError(() => of(undefined)))
      : of(undefined);

    return request.pipe(
      finalize(() => {
        this.clearSession();
        this.router.navigate([APP_ROUTES.login]);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/auth/change-password`, {
      currentPassword,
      newPassword
    });
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.config.apiBaseUrl}/auth/reset-password`, {
      token,
      newPassword
    });
  }

  hasRefreshToken(): boolean {
    return this.storage.getRefreshToken() !== null;
  }

  /**
   * Single-flight refresh: concurrent callers share the same refresh request.
   * Returns the new AuthResponse, or null when there is no refresh token or
   * the refresh itself fails.
   */
  private performRefresh(): Observable<AuthResponse | null> {
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      return of(null);
    }
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.http
        .post<AuthResponse>(`${this.config.apiBaseUrl}/auth/refresh`, {
          refreshToken
        } satisfies RefreshTokenRequest)
        .pipe(
          tap((auth) => {
            this.storage.setRefreshToken(auth.refreshToken, this.storage.getRememberMe());
            this.state.setAccessToken(auth.accessToken);
          }),
          catchError(() => of(null)),
          finalize(() => {
            this.refreshInFlight = null;
          }),
          shareReplay(1)
        );
    }
    return this.refreshInFlight;
  }

  private establishSession(auth: AuthResponse, rememberMe: boolean): Observable<UserProfile> {
    this.storage.setRefreshToken(auth.refreshToken, rememberMe);
    this.state.setAccessToken(auth.accessToken);
    this.state.setStatus('loading');
    return this.userService.getProfile().pipe(
      tap((user) => this.state.setSession(auth.accessToken, user)),
      catchError((error) => {
        this.clearSession();
        throw error;
      })
    );
  }

  private clearSession(): void {
    this.storage.clear();
    this.state.clearSession();
  }
}
