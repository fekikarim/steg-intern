import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { AuthResponse, LoginRequest, RefreshTokenRequest } from '../models/auth.model';
import { UserProfile } from '../models/user.model';
import { AuthStateService } from './auth-state.service';
import { TokenStorageService } from './token-storage.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  private readonly storage = inject(TokenStorageService);
  private readonly state = inject(AuthStateService);
  private readonly userService = inject(UserService);

  private refreshInFlight: Observable<boolean> | null = null;

  login(credentials: LoginRequest, rememberMe: boolean): Observable<UserProfile> {
    return this.http
      .post<AuthResponse>(`${this.config.apiBaseUrl}/auth/login`, credentials)
      .pipe(switchMap((auth) => this.establishSession(auth, rememberMe)));
  }

  /** Attempts a silent session restore using a persisted refresh token. */
  restoreSession(): Observable<boolean> {
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      this.state.clearSession();
      return of(false);
    }
    return this.refreshSession();
  }

  refreshSession(): Observable<boolean> {
    const refreshToken = this.storage.getRefreshToken();
    if (!refreshToken) {
      return of(false);
    }
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.http
        .post<AuthResponse>(`${this.config.apiBaseUrl}/auth/refresh`, {
          refreshToken
        } satisfies RefreshTokenRequest)
        .pipe(
          switchMap((auth) =>
            this.establishSession(auth, this.storage.getRememberMe()).pipe(map(() => true))
          ),
          catchError(() => {
            this.clearSession();
            return of(false);
          }),
          finalize(() => {
            this.refreshInFlight = null;
          }),
          shareReplay(1)
        );
    }
    return this.refreshInFlight;
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
      })
    );
  }

  hasRefreshToken(): boolean {
    return this.storage.getRefreshToken() !== null;
  }

  private establishSession(auth: AuthResponse, rememberMe: boolean): Observable<UserProfile> {
    this.storage.setRefreshToken(auth.refreshToken, rememberMe);
    this.state.setAccessToken(auth.accessToken);
    this.state.setStatus('loading');
    return this.userService.getProfile().pipe(
      tap((user) => this.state.setSession(auth.accessToken, user))
    );
  }

  private clearSession(): void {
    this.storage.clear();
    this.state.clearSession();
  }
}
