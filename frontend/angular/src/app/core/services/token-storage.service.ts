import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage.constants';

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  private readonly local: StorageLike = window.localStorage;
  private readonly session: StorageLike = window.sessionStorage;

  getRefreshToken(): string | null {
    return (
      this.local.getItem(STORAGE_KEYS.refreshToken) ??
      this.session.getItem(STORAGE_KEYS.refreshToken)
    );
  }

  setRefreshToken(token: string | null, rememberMe: boolean): void {
    const target: StorageLike = rememberMe ? this.local : this.session;
    const other: StorageLike = rememberMe ? this.session : this.local;
    other.removeItem(STORAGE_KEYS.refreshToken);
    if (token) {
      target.setItem(STORAGE_KEYS.refreshToken, token);
    } else {
      target.removeItem(STORAGE_KEYS.refreshToken);
    }
  }

  getRememberMe(): boolean {
    return this.local.getItem(STORAGE_KEYS.rememberMe) === 'true';
  }

  setRememberMe(value: boolean): void {
    if (value) {
      this.local.setItem(STORAGE_KEYS.rememberMe, 'true');
    } else {
      this.local.removeItem(STORAGE_KEYS.rememberMe);
    }
  }

  clear(): void {
    this.local.removeItem(STORAGE_KEYS.refreshToken);
    this.session.removeItem(STORAGE_KEYS.refreshToken);
  }
}
