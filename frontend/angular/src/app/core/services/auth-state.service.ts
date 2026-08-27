import { Injectable, computed, signal } from '@angular/core';
import { UserProfile } from '../models/user.model';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly accessToken = signal<string | null>(null);
  private readonly user = signal<UserProfile | null>(null);
  private readonly status = signal<AuthStatus>('idle');

  readonly currentToken = this.accessToken.asReadonly();
  readonly currentUser = this.user.asReadonly();
  readonly authStatus = this.status.asReadonly();

  readonly isAuthenticated = computed(() => this.status() === 'authenticated');
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly hasRole = computed(() => (role: string) => this.user()?.roleName === role);
  readonly hasPermission = computed(
    () => (code: string) => this.user()?.permissions.includes(code) ?? false
  );

  setAccessToken(token: string | null): void {
    this.accessToken.set(token);
  }

  setUser(user: UserProfile | null): void {
    this.user.set(user);
  }

  setStatus(status: AuthStatus): void {
    this.status.set(status);
  }

  setSession(token: string, user: UserProfile): void {
    this.accessToken.set(token);
    this.user.set(user);
    this.status.set('authenticated');
  }

  clearSession(): void {
    this.accessToken.set(null);
    this.user.set(null);
    this.status.set('unauthenticated');
  }
}
