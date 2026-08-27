import { TestBed } from '@angular/core/testing';
import { AuthStateService } from './auth-state.service';
import { UserProfile, UserStatus } from '../models/user.model';

const profile: UserProfile = {
  id: '1',
  email: 'admin@steg.tn',
  enabled: true,
  status: UserStatus.ACTIVE,
  roleName: 'ADMINISTRATOR',
  permissions: ['USER_CREATE', 'USER_READ', 'USER_UPDATE']
};

describe('AuthStateService', () => {
  let service: AuthStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStateService);
  });

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.authStatus()).toBe('idle');
  });

  it('tracks session lifecycle', () => {
    service.setSession('token', profile);
    expect(service.isAuthenticated()).toBe(true);
    expect(service.authStatus()).toBe('authenticated');
    expect(service.currentToken()).toBe('token');
    expect(service.currentUser()).toEqual(profile);

    service.clearSession();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.authStatus()).toBe('unauthenticated');
    expect(service.currentToken()).toBeNull();
  });

  it('checks role membership', () => {
    service.setSession('token', profile);
    expect(service.hasRole()('ADMINISTRATOR')).toBe(true);
    expect(service.hasRole()('SUPERVISOR')).toBe(false);
  });

  it('checks permission membership', () => {
    service.setSession('token', profile);
    expect(service.hasPermission()('USER_CREATE')).toBe(true);
    expect(service.hasPermission()('PAYMENT_APPROVE')).toBe(false);
  });

  it('returns false for role/permission checks when unauthenticated', () => {
    expect(service.hasRole()('ADMINISTRATOR')).toBe(false);
    expect(service.hasPermission()('USER_CREATE')).toBe(false);
  });
});
