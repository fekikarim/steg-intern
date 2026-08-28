import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { permissionGuard } from './core/guards/permission.guard';
import { APP_ROUTES } from './core/constants/route.constants';
import { PERMISSIONS } from './core/constants/permission.constants';

export const routes: Routes = [
  {
    path: '',
    redirectTo: APP_ROUTES.dashboard,
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then((m) => m.AuthLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: APP_ROUTES.login.replace('auth/', '')
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
        data: { title: 'Sign in' }
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./features/auth/forgot-password/forgot-password.component').then(
            (m) => m.ForgotPasswordComponent
          ),
        data: { title: 'Forgot password' }
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
        data: { title: 'Reset password' }
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then((m) => m.MainLayoutComponent),
    children: [
      {
        path: APP_ROUTES.dashboard,
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        data: { title: 'Dashboard' }
      },
      {
        path: APP_ROUTES.forbidden,
        loadComponent: () =>
          import('./features/errors/forbidden/forbidden.component').then((m) => m.ForbiddenComponent),
        data: { title: 'Forbidden' }
      },
      {
        path: APP_ROUTES.users,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/users/user-list.component').then((m) => m.UserListComponent),
        data: { title: 'Users', permission: PERMISSIONS.USER_READ }
      },
      {
        path: APP_ROUTES.roles,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/roles/role-list.component').then((m) => m.RoleListComponent),
        data: { title: 'Roles', permission: PERMISSIONS.ROLE_READ }
      },
      {
        path: APP_ROUTES.departments,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/departments/department-list.component').then((m) => m.DepartmentListComponent),
        data: { title: 'Departments', roles: ['ADMINISTRATOR'] }
      },
      {
        path: APP_ROUTES.audit,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/audit/audit-viewer.component').then((m) => m.AuditViewerComponent),
        data: { title: 'Audit log', roles: ['ADMINISTRATOR'] }
      },
      {
        path: APP_ROUTES.internshipDashboard,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/internships/internship-dashboard.component').then((m) => m.InternshipDashboardComponent),
        data: { title: 'Internship dashboard', permission: PERMISSIONS.INTERNSHIP_READ }
      },
      {
        path: APP_ROUTES.candidates,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/candidates/candidate-list.component').then((m) => m.CandidateListComponent),
        data: { title: 'Candidates', permission: PERMISSIONS.CANDIDATE_READ }
      },
      {
        path: APP_ROUTES.applications,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/applications/application-list.component').then((m) => m.ApplicationListComponent),
        data: { title: 'Applications', permission: PERMISSIONS.APPLICATION_READ }
      },
      {
        path: APP_ROUTES.internships,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/internships/internship-list.component').then((m) => m.InternshipListComponent),
        data: { title: 'Internships', permission: PERMISSIONS.INTERNSHIP_READ }
      },
      {
        path: APP_ROUTES.assignments,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/assignments/assignment-list.component').then((m) => m.AssignmentListComponent),
        data: { title: 'Assignments', permission: PERMISSIONS.ASSIGNMENT_READ }
      },
      {
        path: APP_ROUTES.supervisors,
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('./features/supervisors/supervisor-list.component').then((m) => m.SupervisorListComponent),
        data: { title: 'Supervisors', permission: PERMISSIONS.INTERNSHIP_READ }
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { title: 'Not found' }
  }
];
