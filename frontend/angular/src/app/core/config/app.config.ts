import { InjectionToken } from '@angular/core';
import { environment, Environment } from '../../../environments/environment';

export interface AppConfig {
  production: boolean;
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  /** Skew applied when deciding whether an access token is near expiry (seconds). */
  accessTokenExpirySkewSeconds: number;
  /** Default page size used by list endpoints. */
  defaultPageSize: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config', {
  providedIn: 'root',
  factory: () => createAppConfig(environment)
});

export function createAppConfig(env: Environment): AppConfig {
  return {
    production: env.production,
    apiBaseUrl: env.apiBaseUrl,
    appName: env.appName,
    appVersion: env.appVersion,
    accessTokenExpirySkewSeconds: 30,
    defaultPageSize: 20
  };
}
