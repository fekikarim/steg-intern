import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastHostComponent } from '../../shared/components/toast-host/toast-host.component';
import { ConfirmHostComponent } from '../../shared/components/confirm-host/confirm-host.component';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { IconComponent, type StegIconName } from '../../shared/components/icon/icon.component';
import { APP_ROUTES } from '../../core/constants/route.constants';
import { PERMISSIONS } from '../../core/constants/permission.constants';

interface NavItem {
  label: string;
  route: string[];
  icon: StegIconName;
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
    AvatarComponent,
    IconComponent
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
          <img
            src="assets/logo/logo-steg-341x308.png"
            alt="STEG - Société Tunisienne de l'Électricité et du Gaz - Logo"
            class="brand-logo"
            width="341"
            height="308"
            loading="eager"
          />
          @if (!collapsed()) {
            <span class="brand-name">STEG <em>Back Office</em></span>
          }
          <button
            class="sidebar-close"
            type="button"
            aria-label="Close menu"
            (click)="mobileOpen.set(false)"
          >
            <steg-icon name="close" />
          </button>
        </div>

        <nav class="sidebar-nav" aria-label="Main navigation">
          @for (item of visibleNav(); track item.label) {
            <a
              class="nav-link"
              [class.collapsed-only]="collapsed()"
              routerLink="{{ item.route[0] }}"
              routerLinkActive="active"
              (click)="mobileOpen.set(false)"
            >
              <span class="nav-icon" aria-hidden="true">
                <steg-icon [name]="item.icon" size="md" />
              </span>
              @if (!collapsed()) {
                <span class="nav-label">{{ item.label }}</span>
              }
            </a>
          }
        </nav>

        <div class="sidebar-footer">
          <button class="nav-link collapse-btn" type="button" (click)="toggleCollapse()">
            <span class="nav-icon" aria-hidden="true">
              <steg-icon [name]="collapsed() ? 'expand' : 'collapse'" size="md" />
            </span>
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
              <steg-icon name="menu" />
            </button>
            <span class="page-context">Back Office</span>
          </div>

          <div class="topbar-right">
            <div class="notif-menu" [class.open]="notifOpen()">
              <button
                class="icon-btn"
                type="button"
                aria-label="Notifications"
                aria-haspopup="true"
                [attr.aria-expanded]="notifOpen()"
                (click)="toggleNotifs()"
              >
                <steg-icon name="bell" />
                @if (notifCount() > 0) {
                  <span class="notif-badge" aria-hidden="true">{{ notifCount() }}</span>
                }
              </button>

              @if (notifOpen()) {
                <div class="notif-dropdown" role="menu">
                  <div class="dropdown-head">Notifications</div>
                  <div class="notif-empty">
                    <steg-icon name="bell" size="md" />
                    <span>{{ notifCount() > 0 ? 'You have ' + notifCount() + ' new item(s).' : 'You are all caught up.' }}</span>
                  </div>
                </div>
              }
            </div>

            <span class="topbar-divider" aria-hidden="true"></span>

            <div class="user-menu" [class.open]="menuOpen()">
              <button
                class="user-trigger"
                type="button"
                (click)="toggleMenu()"
                aria-haspopup="true"
                [attr.aria-expanded]="menuOpen()"
              >
                <steg-avatar [name]="displayName()" size="sm" />
                <span class="user-info">
                  <strong class="user-name">{{ displayName() }}</strong>
                  <span class="user-role">{{ roleLabel() }}</span>
                </span>
                <steg-icon class="user-caret" name="chevron-down" size="sm" />
              </button>

              @if (menuOpen()) {
                <div class="user-dropdown" role="menu">
                  <div class="dropdown-head">
                    <steg-avatar [name]="displayName()" size="md" />
                    <div class="dropdown-head-copy">
                      <strong class="dropdown-name">{{ displayName() }}</strong>
                      @if (email()) {
                        <span class="dropdown-email">{{ email() }}</span>
                      }
                    </div>
                  </div>
                  <div class="dropdown-body">
                    <button class="dropdown-item" type="button" role="menuitem" (click)="logout()">
                      <span class="dropdown-item-icon"><steg-icon name="logout" size="sm" /></span>
                      <span>Sign out</span>
                    </button>
                  </div>
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
      .brand-logo {
        height: 2rem;
        width: auto;
        object-fit: contain;
        flex-shrink: 0;
        border-radius: var(--radius-xs);
      }
      .brand-name {
        font-weight: 700;
        letter-spacing: 0.01em;
        color: var(--color-text);
        white-space: nowrap;
      }
      .brand-name em {
        font-style: normal;
        font-weight: 500;
        color: var(--color-text-muted);
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
        border: 1px solid transparent;
        transition: background var(--transition-fast), color var(--transition-fast),
          border-color var(--transition-fast);
      }
      .nav-link:hover {
        background: var(--color-surface-alt);
        color: var(--color-text);
      }
      .nav-link.active {
        background: var(--color-primary-soft);
        color: var(--color-primary);
        font-weight: 600;
        border-color: color-mix(in srgb, var(--color-primary) 18%, transparent);
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
        gap: 1rem;
        padding: 0 1.25rem;
        background: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
        z-index: var(--z-topbar);
      }
      .topbar-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 0;
      }
      .page-context {
        font-weight: 600;
        font-size: 0.9375rem;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .hamburger {
        display: none;
      }
      .topbar-right {
        display: flex;
        align-items: center;
        gap: 0.375rem;
      }
      .icon-btn {
        position: relative;
        width: 2.5rem;
        height: 2.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: none;
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: background var(--transition-fast), color var(--transition-fast),
          border-color var(--transition-fast);
      }
      .icon-btn:hover {
        background: var(--color-surface-alt);
        color: var(--color-text);
      }
      .icon-btn:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      .notif-badge {
        position: absolute;
        top: 0.35rem;
        right: 0.4rem;
        min-width: 1rem;
        height: 1rem;
        padding: 0 0.25rem;
        border-radius: 999px;
        background: var(--color-primary);
        color: #fff;
        font-size: 0.625rem;
        font-weight: 700;
        line-height: 1rem;
        text-align: center;
        box-shadow: 0 0 0 2px var(--color-surface);
      }
      .topbar-divider {
        width: 1px;
        height: 1.5rem;
        background: var(--color-border);
        margin: 0 0.25rem;
      }
      .notif-menu,
      .user-menu {
        position: relative;
      }
      .notif-dropdown,
      .user-dropdown {
        position: absolute;
        right: 0;
        top: calc(100% + 0.5rem);
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: calc(var(--z-topbar) + 1);
        overflow: hidden;
        animation: dropdown-in 0.14s ease;
      }
      .notif-dropdown {
        width: 18rem;
        max-width: calc(100vw - 2rem);
      }
      .user-dropdown {
        min-width: 15rem;
      }
      @keyframes dropdown-in {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .dropdown-head {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        border-bottom: 1px solid var(--color-border);
        background: var(--color-surface-alt);
      }
      .dropdown-head-copy {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .dropdown-name {
        font-size: 0.875rem;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dropdown-email {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .dropdown-body {
        padding: 0.375rem;
      }
      .dropdown-item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        width: 100%;
        text-align: left;
        padding: 0.625rem 0.75rem;
        background: none;
        border: none;
        border-radius: var(--radius-md);
        color: var(--color-danger);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: background var(--transition-fast), color var(--transition-fast);
      }
      .dropdown-item:hover {
        background: var(--color-danger-soft);
      }
      .dropdown-item:focus-visible {
        outline: 2px solid var(--color-danger);
        outline-offset: -2px;
      }
      .dropdown-item-icon {
        display: inline-flex;
      }
      .notif-empty {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 1.25rem 1rem;
        color: var(--color-text-muted);
        font-size: 0.8125rem;
      }
      .user-trigger {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.375rem 0.5rem;
        background: none;
        border: 1px solid transparent;
        border-radius: var(--radius-md);
        cursor: pointer;
        transition: background var(--transition-fast), border-color var(--transition-fast);
      }
      .user-trigger:hover {
        background: var(--color-surface-alt);
      }
      .user-trigger:focus-visible {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
      }
      .user-caret {
        color: var(--color-text-muted);
        transition: transform var(--transition-fast);
      }
      .user-menu.open .user-caret {
        transform: rotate(180deg);
      }
      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        line-height: 1.15;
        text-align: left;
        min-width: 0;
      }
      .user-name {
        max-width: 12rem;
        font-size: 0.8125rem;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .user-role {
        font-size: 0.6875rem;
        color: var(--color-text-muted);
        text-transform: capitalize;
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
  protected readonly notifOpen = signal(false);
  protected readonly notifCount = signal(0);
  protected readonly APP_ROUTES = APP_ROUTES;

  protected readonly email = computed(() => this.authState.currentUser()?.email ?? '');

  protected readonly displayName = computed(() => {
    const e = this.email();
    if (!e) {
      return 'Guest';
    }
    const local = e.split('@')[0] ?? '';
    return local
      .split(/[._-]+/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ') || e;
  });

  protected readonly roleLabel = computed(() => {
    const user = this.authState.currentUser();
    const role = user?.roleName as string | undefined;
    return role ? role.replaceAll('_', ' ') : 'Member';
  });

  private readonly nav: NavItem[] = [
    { label: 'Dashboard', route: [APP_ROUTES.dashboard], icon: 'dashboard' },
    { label: 'Users', route: [APP_ROUTES.users], icon: 'users', requires: { permission: PERMISSIONS.USER_READ } },
    { label: 'Roles', route: [APP_ROUTES.roles], icon: 'roles', requires: { permission: PERMISSIONS.ROLE_READ } },
    {
      label: 'Candidates',
      route: [APP_ROUTES.candidates],
      icon: 'candidates',
      requires: { permission: PERMISSIONS.CANDIDATE_READ }
    },
    {
      label: 'Applications',
      route: [APP_ROUTES.applications],
      icon: 'applications',
      requires: { permission: PERMISSIONS.APPLICATION_READ }
    },
    {
      label: 'Internship dashboard',
      route: [APP_ROUTES.internshipDashboard],
      icon: 'reports',
      requires: { permission: PERMISSIONS.INTERNSHIP_READ }
    },
    {
      label: 'Internships',
      route: [APP_ROUTES.internships],
      icon: 'internships',
      requires: { permission: PERMISSIONS.INTERNSHIP_READ }
    },
    {
      label: 'Assignments',
      route: [APP_ROUTES.assignments],
      icon: 'assignments',
      requires: { permission: PERMISSIONS.ASSIGNMENT_READ }
    },
    {
      label: 'Supervisors',
      route: [APP_ROUTES.supervisors],
      icon: 'supervisors',
      requires: { permission: PERMISSIONS.INTERNSHIP_READ }
    },
    {
      label: 'Workflows',
      route: [APP_ROUTES.workflows],
      icon: 'workflows',
      requires: { permission: PERMISSIONS.WORKFLOW_READ }
    },
    {
      label: 'Documents',
      route: [APP_ROUTES.documents],
      icon: 'documents',
      requires: { permission: PERMISSIONS.DOCUMENT_UPLOAD }
    },
    {
      label: 'Payments',
      route: [APP_ROUTES.payments],
      icon: 'payments',
      requires: { permission: PERMISSIONS.PAYMENT_READ }
    },
    {
      label: 'Reports',
      route: [APP_ROUTES.reports],
      icon: 'reports',
      requires: { permission: PERMISSIONS.REPORT_READ }
    },
    {
      label: 'Departments',
      route: [APP_ROUTES.departments],
      icon: 'departments',
      requires: { roles: ['ADMINISTRATOR'] }
    },
    {
      label: 'Audit log',
      route: [APP_ROUTES.audit],
      icon: 'audit',
      requires: { roles: ['ADMINISTRATOR'] }
    }
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
    this.notifOpen.set(false);
  }

  toggleNotifs(): void {
    this.notifOpen.set(!this.notifOpen());
    this.menuOpen.set(false);
  }

  closeMenus(): void {
    this.menuOpen.set(false);
    this.notifOpen.set(false);
    this.mobileOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) {
      return;
    }
    if (target.closest('.user-menu') || target.closest('.notif-menu')) {
      return;
    }
    this.menuOpen.set(false);
    this.notifOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeMenus();
  }

  toggleCollapse(): void {
    this.collapsed.set(!this.collapsed());
  }

  logout(): void {
    this.closeMenus();
    this.authService.logout().subscribe();
  }
}
