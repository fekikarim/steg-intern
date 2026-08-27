import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { AuthStateService } from '../services/auth-state.service';
import { APP_ROUTES } from '../constants/route.constants';

let restoreAttempted = false;

/**
 * Protects application routes. Restores the persisted session on the first
 * guard evaluation and blocks access until the user is authenticated.
 */
export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const state = inject(AuthStateService);
  const router = inject(Router);

  if (!restoreAttempted) {
    restoreAttempted = true;
    await firstValueFrom(authService.restoreSession());
  }

  if (state.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree([APP_ROUTES.login], { queryParams: { redirect: undefined } });
};
