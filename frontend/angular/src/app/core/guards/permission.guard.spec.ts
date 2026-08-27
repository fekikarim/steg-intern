import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { permissionGuard } from './permission.guard';
import { AuthStateService } from '../services/auth-state.service';
import { UserProfile, UserStatus } from '../models/user.model';

@Component({ template: '' })
class StubComponent {}

@Component({ template: '' })
class ForbiddenComponent {}

function profile(role: string, permissions: string[]): UserProfile {
  return {
    id: '1',
    email: 'u@steg.tn',
    enabled: true,
    status: UserStatus.ACTIVE,
    roleName: role,
    permissions
  };
}

describe('permissionGuard', () => {
  let router: Router;
  let state: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StubComponent, ForbiddenComponent],
      providers: [
        provideRouter([
          { path: 'protected', component: StubComponent, canActivate: [permissionGuard], data: { permission: 'USER_READ' } },
          { path: 'role-protected', component: StubComponent, canActivate: [permissionGuard], data: { roles: ['ADMINISTRATOR'] } },
          { path: 'forbidden', component: ForbiddenComponent },
          { path: 'auth/login', component: ForbiddenComponent }
        ])
      ]
    });
    router = TestBed.inject(Router);
    state = TestBed.inject(AuthStateService);
  });

  it('allows access when the user has the required permission', async () => {
    state.setSession('t', profile('SUPERVISOR', ['USER_READ']));
    await router.navigateByUrl('/protected');
    expect(router.url).toBe('/protected');
  });

  it('redirects to forbidden when the permission is missing', async () => {
    state.setSession('t', profile('SUPERVISOR', []));
    await router.navigateByUrl('/protected');
    expect(router.url).toBe('/forbidden');
  });

  it('allows access when the user has a matching role', async () => {
    state.setSession('t', profile('ADMINISTRATOR', []));
    await router.navigateByUrl('/role-protected');
    expect(router.url).toBe('/role-protected');
  });

  it('redirects to login when unauthenticated', async () => {
    await router.navigateByUrl('/protected');
    expect(router.url).toBe('/auth/login');
  });
});
