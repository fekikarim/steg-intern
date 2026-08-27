import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastHostComponent } from '../../shared/components/toast-host/toast-host.component';
import { ConfirmHostComponent } from '../../shared/components/confirm-host/confirm-host.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { APP_ROUTES } from '../../core/constants/route.constants';

interface NavItem {
  label: string;
  route: string[];
  icon: string;
  /** Permission or role gate; empty means always visible. */
  requires?: { permission?: string; roles?: string[] };
}

@Component({
  selector: 'steg-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ToastHostComponent,
    ConfirmHostComponent,
    AvatarComponent
  ],
  template: `
    <div class="app-shell" [class.sidebar-collapsed]="collapsed()">
      <button
        class="sidebar-scrim"
        [class.open]="mobileOpen()"
        type="button"
        aria-label="Close menu"
        (click)="mobileOpen.set(false)"
      ></button>

      <aside class="sidebar" [class.mobile-open]="mobileOpen()">
        <div class="sidebar-brand">
          <div class="brand-mark" aria-hidden="true">S</div>
          @if (!collapsed()) {
            <span class="brand-name">STEG Back Office</span>
          }
          <button
            class="sidebar-close"
            type="button"
            aria-label="Close menu"
            (click)="mobileOpen.set(false)"
          >
            ×
          </button>
        </div>

        <nav class="sidebar-nav" aria-label="Main navigation">
          @for (item of visibleNav(); track item.label) {
            <a
              class="nav-link"
              [class.collapsed-only]="collapsed()"
              routerLink="{{ item.route[0] }}"
              routerLinkActive="active"
              [attr.aria-current]="null"
              (click)="mobileOpen.set(false)"
            >
              <span class="nav-icon" [innerHTML]="item.icon" aria-hidden="true"></span>
              @if (!collapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button class="nav-link collapse-btn" type="button" (click)="toggleCollapse()">
            <span class="nav-icon" aria-hidden="true">{{ collapsed() ? '»' : '«' }}</span>
            @if (!collapsed()) {
              <span class="nav-label">Collapse</span>
            }
          </button>
        </div>
      </aside>

      <div class="app-main">
        <header class="topbar">
          <div class="topbar-left">
            <button
              class="icon-btn hamburger"
              type="button"
              [attr.aria-label]="mobileOpen() ? 'Close menu' : 'Open menu'"
              (click)="mobileOpen.set(true)"
            >
              ☰
            </button>
            <span class="page-context">Back Office</span>
          </div>

          <div class="topbar-right">
            <button class="icon-btn" type="button" aria-label="Notifications">🔔</button>
            <div class="user-menu" [class.open]="menuOpen()">
              <button class="user-trigger" type="button" (click)="toggleMenu()" aria-haspopup="true" [attr.aria-expanded]="menuOpen()">
                <steg-avatar [name]="fullName()" size="sm" />
                <span class="user-info">
                  <strong class="user-name">{{ fullName() }}</strong>
                  <span class="user-role">{{ roleLabel() }}</span>
                </span>
              </button>

              @if (menuOpen()) {
                <div class="user-dropdown" role="menu">
                  @if (email()) {
                    <div class="dropdown-user">
                      <strong>{{ fullName() }}</strong>
                      <span>{{ email() }}</span>
                    </div>
                  }
                  <button class="dropdown-item" type="button" role="menuitem" (click)="logout()">
                    Sign out
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <main class="content">
          <div class="content-inner">
            <router-outlet />
          </div>
        </main>
      </div>

      <steg-toast-host />
      <steg-confirm-host />
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }
      .app-shell {
        display: flex;
        height: 100vh;
        overflow: hidden;
      }

      /* Sidebar */
      .sidebar {
        width: var(--sidebar-width);
        display: flex;
        flex-direction: column;
        background: var(--color-surface);
        border-right: 1px solid var(--color-border);
        transition: width var(--transition-base), margin-left var(--transition-base);
        z-index: var(--z-sidebar);
        flex-shrink: 0;
      }
      .sidebar-collapsed .sidebar {
        width: var(--sidebar-width-collapsed);
      }
      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        height: var(--topbar-height);
        padding: 0 1rem;
        border-bottom: 1px solid var(--color-border);
        overflow: hidden;
      }
      .brand-mark {
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--color-primary);
        color: #fff;
        font-weight: 700;
        border-radius: var(--radius-sm);
        flex-shrink: 0;
      }
      .brand-name {
        font-weight: 600;
        white-space: nowrap;
      }
      .sidebar-nav {
        flex: 1;
        overflow-y: auto;
        padding: 0.75rem 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.75rem;
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        text-decoration: none;
        white-space: nowrap;
        transition: background var(--transition-fast), color var(--transition-fast);
      }
      .nav-link:hover {
        background: var(--color-surface-alt);
      }
      .nav-link.active {
        background: var(--color-primary-soft);
        color: var(--color-primary);
        font-weight: 500;
      }
      .nav-icon {
        width: 1.25rem;
        text-align: center;
        flex-shrink: 0;
      }
      .sidebar-collapsed .nav-label {
        display: none;
      }
      .sidebar-collapsed .nav-link {
        justify-content: center;
      }
      .sidebar-collapsed .sidebar-brand {
        justify-content: center;
        padding: 0;
      }
      .sidebar-footer {
        padding: 0.75rem;
        border-top: 1px solid var(--color-border);
      }
      .collapse-btn {
        width: 100%;
        background: none;
        border: none;
        font-size: inherit;
        text-align: left;
      }
      .sidebar-close {
        display: none;
        margin-left: auto;
        background: none;
        border: 0;
        font-size: 1.5rem;
        color: var(--color-text-muted);
      }
      .sidebar-scrim {
        display: none;
      }

      /* Main area */
      .app-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .topbar {
        height: var(--topbar-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.25rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        z-index: var(--z-topbar);
      }
      .topbar-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .page-context {
        font-weight: 500;
        color: var(--color-text-secondary);
      }
      .hamburger {
        display: none;
      }
      .topbar-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .icon-btn {
        width: 2.25rem;
        height: 2.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: none;
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
      }
      .icon-btn:hover {
        background: var(--color-surface-alt);
      }
      .user-menu {
        position: relative;
      }
      .user-trigger {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.375rem 0.5rem;
        background: none;
        border: none;
        border-radius: var(--radius-md);
      }
      .user-trigger:hover {
        background: var(--color-surface-alt);
      }
      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.15;
        text-align: left;
      }
      .user-name {
        font-size: 0.8125rem;
        color: var(--color-text);
      }
      .user-role {
        font-size: 0.6875rem;
        color: var(--color-text-muted);
      }
      .user-dropdown {
        position: absolute;
        right: 0;
        top: calc(100% + 0.5rem);
        min-width: 13rem;
        padding: 0.5rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: calc(var(--z-topbar) + 1);
      }
      .dropdown-user {
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid var(--color-border);
        margin-bottom: 0.375rem;
        display: flex;
        flex-direction: column;
      }
      .dropdown-user span {
        font-size: 0.75rem;
        color: var(--color-text-muted);
      }
      .dropdown-item {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.5rem 0.75rem;
        background: none;
        border: none;
        border-radius: var(--radius-sm);
        color: var(--color-danger);
        font-size: 0.875rem;
      }
      .dropdown-item:hover {
        background: var(--color-danger-soft);
      }

      /* Content */
      .content {
        flex: 1;
        overflow-y: auto;
      }
      .content-inner {
        max-width: var(--content-max-width);
        margin: 0 auto;
        padding: 1.5rem;
        min-height: 100%;
      }

      /* Responsive */
      @media (max-width: 900px) {
        .hamburger {
          display: inline-flex;
        }
        .sidebar {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          margin-left: -100%;
        }
        .sidebar.mobile-open {
          margin-left: 0;
        }
        .sidebar-scrim {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(16, 24, 40, 0.5);
          opacity: 0;
          pointer-events: none;
          z-index: calc(var(--z-sidebar) - 1);
          transition: opacity var(--transition-base);
        }
        .sidebar-scrim.open {
          opacity: 1;
          pointer-events: auto;
        }
        .sidebar-close {
          display: block;
        }
        .sidebar-collapsed .sidebar {
          width: var(--sidebar-width);
        }
        .sidebar-collapsed .nav-level {
          display: inline;
        }
        .sidebar-collapsed .nav-link {
          justify-content: flex-start;
        }
        .sidebar-collapsed .sidebar-brand {
          justify-content: flex-start;
          padding: 0 1rem;
        }
      }
      @media (max-width: 560px) {
        .user-info {
          display: none;
        }
        .content-inner {
          padding: 1rem;
        }
      }
    `
  ]
})
export class MainLayoutComponent {
  private readonly authState = inject(AuthStateService);
  private readonly authService = inject(AuthService);

  protected readonly collapsed = signal(false);
  protected readonly mobileOpen = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly APP_ROUTES = APP_ROUTES;

  protected readonly fullName = computed(() => {
    const user = this.authState.currentUser();
    return user?.email ?? '';
  });

  protected readonly email = computed(() => this.authState.currentUser()?.email ?? '');

  protected readonly roleLabel = computed(() => {
    const user = this.authState.currentUser();
    const role = user?.roleName as string | undefined;
    return role ? role.replaceAll('_', ' ') : 'Member';
  });

  private readonly nav: NavItem[] = [
    { label: 'Dashboard', route: [APP_ROUTES.dashboard], icon: '▦' }
  ];

  protected readonly visibleNav = computed(() =>
    this.nav.filter((item) => {
      if (!item.requires) {
        return true;
      }
      const state = this.authState;
      if (item.requires.permission && !state.hasPermission()(item.requires.permission)) {
        return false;
      }
      if (item.requires.roles?.length && !item.requires.roles.some((r) => state.hasRole()(r))) {
        return false;
      }
      return true;
    })
  );

  toggleMenu(): void {
    this.menuOpen.set(!this.menuOpen());
  }

  toggleCollapse(): void {
    this.collapsed.set(!this.collapsed());
  }

  logout(): void {
    this.menuOpen.set(false);
    void this.authService.logout();
  }
}
