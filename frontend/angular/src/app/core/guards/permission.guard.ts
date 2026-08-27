import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStateService } from '../services/auth-state.service';
import { APP_ROUTES } from '../constants/route.constants';

/**
 * Route data contract for RBAC-protected routes.
 * - permission: any single required permission
 * - permissions: all required permissions (AND)
 * - roles: any of the allowed role names
 */
export interface RoutePermissionData {
  permission?: string;
  permissions?: string[];
  roles?: string[];
}

/**
 * Guards routes that require a specific permission or role. Navigation is
 * redirected to the forbidden page when the current user lacks access.
 */
export const permissionGuard: CanActivateFn = (route): boolean | UrlTree => {
  const state = inject(AuthStateService);
  const router = inject(Router);

  if (!state.isAuthenticated()) {
    return router.createUrlTree([APP_ROUTES.login]);
  }

  const data = (route.data ?? {}) as RoutePermissionData;

  if (data.permission && !state.hasPermission()(data.permission)) {
    return router.createUrlTree([APP_ROUTES.forbidden]);
  }

  if (data.permissions?.length && !data.permissions.every((p) => state.hasPermission()(p))) {
    return router.createUrlTree([APP_ROUTES.forbidden]);
  }

  if (data.roles?.length && !data.roles.some((role) => state.hasRole()(role))) {
    return router.createUrlTree([APP_ROUTES.forbidden]);
  }

  return true;
};
