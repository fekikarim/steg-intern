import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../config/app.config';
import { UserProfile } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.config.apiBaseUrl}/auth/me`);
  }
}
