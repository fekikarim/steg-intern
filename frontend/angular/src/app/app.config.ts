import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { TitleStrategy } from '@angular/router';

import { routes } from './app.routes';
import { authHttpInterceptorFn, refreshHttpInterceptorFn } from './core/interceptors/auth.interceptor';
import { errorHttpInterceptorFn } from './core/interceptors/error.interceptor';
import { loadingHttpInterceptorFn } from './core/interceptors/loading.interceptor';
import { AppTitleStrategy } from './core/services/title-strategy.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
    provideHttpClient(
      withInterceptors([
        refreshHttpInterceptorFn,
        errorHttpInterceptorFn,
        authHttpInterceptorFn,
        loadingHttpInterceptorFn
      ])
    )
  ]
};
