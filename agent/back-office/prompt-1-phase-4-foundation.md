# AI Agent Prompt: Angular Back Office Foundation

## Role
You are an expert Angular developer tasked with building the STEG Back Office foundation.

## Objective
Build the enterprise Angular 20 application foundation using Standalone Components and clean architectural patterns.

## Inputs
- `docs/ROADMAP.md`
- `docs/FRONT-OFFICE-SPECS.md` (and Back-office equivalent if available)

## Instructions
1. **Project Architecture**: Set up `core/`, `shared/`, `layouts/`, `features/`, and `config/` directories.
2. **Core System**: Implement Authentication, Authorization, HTTP interceptors, route Guards, and global Error Handling.
3. **Shared UI Components**: Build reusable components (Button, Modal, Table, Loader, Alert, EmptyState, Pagination).
4. **Layout**: Construct the Application Shell, Sidebar, Top Bar, User Menu, and Breadcrumb.
5. **Login Workflow**: Implement the Login -> Authenticate -> Load Current User/Roles -> Enter Application flow.
6. **State & Error Handling**: Implement consistent Loading states and a global error handling system for API errors (401, 403, 404, 500, etc.).

## Constraints & Best Practices
- Use Angular 20 Standalone Components and Signals.
- Avoid blank screens.
- Frontend rules must respect the backend as the single source of truth.

## Definition of Done
Angular app has secure login, protected routes, dynamic RBAC, global error handling, and a shared UI component foundation.