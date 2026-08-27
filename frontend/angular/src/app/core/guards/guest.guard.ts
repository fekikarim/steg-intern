import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { APP_ROUTES } from '../constants/route.constants';

/**
 * Blocks authenticated users from guest-only pages (e.g. login) and redirects
 * them into the application.
 */
export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const state = inject(AuthStateService);
  const router = inject(Router);

  if (state.isAuthenticated()) {
    return router.createUrlTree([APP_ROUTES.dashboard]);
  }
  return true;
};
