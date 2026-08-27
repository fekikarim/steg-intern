# STEG Intelligent Internship Management Platform
# Complete Production Development Roadmap

**Project:** Conception et Développement d'une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG  
**Organization:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Stagiaires:** Karim Feki & Nesrine Derouiche  
**Supervisor:** M. Mohsen Marmouri  
**Target Period:** Juillet – Août 2026  
**Primary Architecture:** Next.js + Angular + Flutter + Spring Boot 3 + PostgreSQL + REST API

---

# 1. Purpose of This Roadmap

This document is the **master development roadmap** for the entire STEG Internship Management Platform.

It defines the complete path from the current technical state to a production-ready system covering:

- Backend
- PostgreSQL database
- Angular Back Office
- Next.js Front Office
- Flutter Internship Companion
- Authentication
- Authorization
- RBAC
- Workflows
- Documents
- Notifications
- Payments
- Dashboards
- Reporting
- Auditability
- Testing
- Security
- Performance
- Reliability
- Deployment
- Operations
- Future evolution

The roadmap is designed to be usable by:

- Developers
- Architects
- Project managers
- Technical supervisors
- Future maintainers
- AI coding agents

The roadmap must therefore be treated as a **development control document**.

---

# 2. Source of Truth

The functional scope of this roadmap is derived primarily from the official project **Cahier des Charges STEG**.

The Cahier des Charges defines a platform composed of three client applications sharing:

```text
Next.js Front Office
        |
Angular Back Office
        |
Flutter Mobile Application
        |
        v
Spring Boot 3 REST API
        |
        v
PostgreSQL
```

The three applications must use the same backend services, business rules, and central data source so that information remains consistent across the platform.

The Cahier des Charges explicitly establishes:

- Candidate and internship application management.
- Internal internship management.
- Assignment to services.
- Supervisor designation.
- Workflow management.
- Automatic administrative document generation.
- Indemnity management.
- Reporting.
- Decision dashboards.
- User, role, and permission administration.
- Internship journal.
- Tasks.
- Deliverables.
- Notifications.
- Internship progress tracking.
- Supervisor validation.
- Evaluations.
- Audit logging.
- Secure authentication.
- JWT + Refresh Token.
- RBAC.
- HTTPS.
- Protection of personal data.
- Regular backups.
- Modular and evolvable architecture.

The project must remain aligned with the Cahier des Charges at all times. 
---

# 3. Current Project State

Before beginning the roadmap phases, the following current state must be recognized.

## 3.1. Analysis and Documentation

Completed:

- Cahier des Charges.
- Project vision.
- Project objectives.
- Business analysis.
- Requirements documentation.
- Software specification.
- Security documentation.
- Frontend documentation.
- Backend documentation.
- Mobile documentation.
- Architecture documentation.
- Database documentation.
- Domain model.
- Master class diagram.
- Bounded context diagrams.

---

# 3.2. Backend Foundation

Already started / completed:

- Spring Boot backend setup.
- Entities.
- Relationships.
- CRUD operations.
- PostgreSQL integration.

This means the project is **past the initial domain/persistence bootstrap stage**.

The next backend work is therefore not simply "create entities", but to progressively transform the current backend foundation into a secure, validated, transactional, tested, documented, and production-grade application.

---

# 3.3. Frontend State

Angular Back Office:

- Project initialized.
- Angular 20.
- Initial architecture ready to be developed.
- Authentication foundation is the next major milestone.

Next.js Front Office:

- Development phase to follow the shared backend foundation and shared business contracts.

Flutter Mobile:

- Development phase to follow the core backend/API contracts and operational business modules.

---

# 4. Global Development Principles

Every phase must follow these principles.

## 4.1. Backend Is the Source of Truth

Never duplicate business rules independently inside:

- Next.js
- Angular
- Flutter

Frontend applications may perform UX validation, but backend validation remains authoritative.

---

## 4.2. No Direct Database Access From Clients

Forbidden:

```text
Next.js -> PostgreSQL
Angular -> PostgreSQL
Flutter -> PostgreSQL
```

Required:

```text
Next.js -> Spring Boot -> PostgreSQL
Angular -> Spring Boot -> PostgreSQL
Flutter -> Spring Boot -> PostgreSQL
```

---

## 4.3. Security Must Be Implemented Before Business Expansion

Do not build dozens of business pages and attempt to add security afterward.

Security must be established at the foundation:

```text
Authentication
+
Authorization
+
RBAC
+
Validation
+
Audit
+
Rate Limiting
+
Secure File Access
```

---

## 4.4. Production-Ready Means More Than "Works"

Every feature is considered complete only when it has:

- Correct business behavior.
- Validation.
- Authorization.
- Loading states.
- Empty states.
- Error states.
- Responsive behavior.
- Accessibility.
- Unit tests where applicable.
- Integration tests where applicable.
- Audit coverage when required.
- Documentation.
- Performance review.

---

# 5. Overall Development Order

The recommended global sequence is:

```text
PHASE 0
Project Alignment

        ↓

PHASE 1
Backend Hardening

        ↓

PHASE 2
Authentication & Security

        ↓

PHASE 3
API Contracts & Integration Foundation

        ↓

PHASE 4
Angular Back Office Foundation

        ↓

PHASE 5
Back Office Identity & Administration

        ↓

PHASE 6
Back Office Internship Management

        ↓

PHASE 7
Back Office Workflow & Documents

        ↓

PHASE 8
Back Office Finance & Reporting

        ↓

PHASE 9
Next.js Front Office

        ↓

PHASE 10
Flutter Internship Companion

        ↓

PHASE 11
Cross-Application Synchronization

        ↓

PHASE 12
Advanced Notifications

        ↓

PHASE 13
End-to-End Validation

        ↓

PHASE 14
Performance & Security Hardening

        ↓

PHASE 15
Deployment & Production Readiness

        ↓

PHASE 16
Operational Monitoring & Maintenance

        ↓

PHASE 17
Future Evolution
```

---

# 6. PHASE 0 — Project Alignment and Baseline

## Objective

Establish a verified technical baseline before significant additional development.

---

## Tasks

### Documentation

Read and reconcile:

```text
00_PROJECT_CHARTER
01_PRODUCT_VISION
02_BUSINESS_ANALYSIS
03_REQUIREMENTS
04_SOFTWARE_SPECIFICATION
05_SYSTEM_DESIGN
06_ARCHITECTURE
07_DATABASE
08_SECURITY
09_FRONTEND
10_BACKEND
11_MOBILE
12_API
13_TESTING
14_DEVOPS
15_PROJECT_MANAGEMENT
16_REPORT
17_DEPLOYMENT
18_FUTURE
```

---

### Domain Verification

Verify that implementation matches:

- Master domain model.
- Master class diagram.
- Bounded contexts.
- Business rules.
- Actor definitions.
- Application states.
- Internship states.
- Workflow states.
- Payment states.

---

### Architecture Verification

Verify:

```text
Angular
Next.js
Flutter
Spring Boot
PostgreSQL
```

are architecturally aligned with the documentation.

---

### API Inventory

Create a definitive inventory of:

```text
Authentication APIs
User APIs
Role APIs
Permission APIs
Candidate APIs
Application APIs
Internship APIs
Assignment APIs
Workflow APIs
Document APIs
Journal APIs
Task APIs
Deliverable APIs
Evaluation APIs
Notification APIs
Payment APIs
Dashboard APIs
Report APIs
Audit APIs
```

---

## Exit Criteria

- Documentation is internally consistent.
- Domain model matches backend entities.
- API inventory exists.
- No major architectural ambiguity remains.
- Development environment is reproducible.

---

# 7. PHASE 1 — Backend Hardening

## Objective

Transform the existing entity/relation/CRUD foundation into a robust application architecture.

---

# 7.1. Backend Architecture

Implement / verify:

```text
Controller Layer
Service Layer
Domain Layer
Repository Layer
Infrastructure Layer
```

Enforce:

- Separation of concerns.
- SOLID.
- Clean Architecture principles.
- DTO usage.
- Mapping layer.
- Centralized exceptions.

---

# 7.2. DTO Architecture

Create separate:

```text
Request DTOs
Response DTOs
Search DTOs
Filter DTOs
Pagination DTOs
```

Never expose JPA entities directly from REST APIs.

---

# 7.3. Mapping

Introduce consistent mapping between:

```text
Entity <-> DTO
```

Prefer a centralized mapping strategy.

---

# 7.4. Validation

Implement:

```text
Jakarta Validation
+
Business Validation
+
Database Constraints
```

Validate:

- Required fields.
- Data formats.
- Dates.
- Status transitions.
- Ownership.
- Relationships.
- File metadata.
- Financial values.

---

# 7.5. Transaction Management

Identify all operations requiring atomicity.

Examples:

### Application Acceptance

```text
Accept Application
+
Create Internship
+
Create / Start Workflow
+
Generate required notification
```

### Internship Assignment

```text
Create Assignment
+
Update Assignment History
+
Trigger notifications
```

Transactions must preserve consistency.

---

# 7.6. State Transition Protection

Implement explicit state transition rules.

Examples:

```text
Application:

DRAFT
 -> SUBMITTED
 -> UNDER_REVIEW
 -> ACCEPTED / REJECTED
```

```text
Internship:

PLANNED
 -> ACTIVE
 -> COMPLETED
 -> ARCHIVED
```

Illegal transitions must be rejected by backend business logic.

---

# 7.7. Global Error Architecture

Implement:

```text
@RestControllerAdvice
```

Create standardized errors for:

- Validation failures.
- Authentication failures.
- Authorization failures.
- Not found.
- Conflict.
- Business rule violations.
- File errors.
- Database failures.
- External service failures.

Never expose internal stack traces to clients.

---

# 7.8. Logging

Implement structured logging with appropriate levels:

```text
TRACE
DEBUG
INFO
WARN
ERROR
```

Never log:

- Passwords.
- JWTs.
- Refresh tokens.
- Sensitive document content.
- Sensitive personal information.

---

# 7.9. Audit Integration

Critical operations must generate audit events.

Examples:

```text
LOGIN
LOGIN_FAILURE
LOGOUT
USER_CREATED
ROLE_CHANGED
APPLICATION_SUBMITTED
APPLICATION_APPROVED
APPLICATION_REJECTED
ASSIGNMENT_CREATED
DOCUMENT_GENERATED
DOCUMENT_VALIDATED
PAYMENT_APPROVED
PAYMENT_PAID
```

---

## Exit Criteria

Backend foundation must:

- Compile.
- Pass tests.
- Enforce business rules.
- Return consistent API responses.
- Provide structured errors.
- Support transactions.
- Generate required audit events.

---

# 8. PHASE 2 — Authentication and Security Foundation

## Objective

Create the enterprise security foundation before exposing business modules.

---

# 8.1. Authentication

Implement:

```text
Login
Logout
Refresh Token
Session Management
Password Change
Password Reset
Email Verification
```

---

# 8.2. JWT

Implement:

- Short-lived Access Token.
- Refresh Token.
- Signature verification.
- Expiration validation.
- Issuer validation.
- Audience validation where configured.
- User status validation.

---

# 8.3. Refresh Token Security

Implement:

- Rotation.
- Revocation.
- Expiration.
- Session association.
- Reuse detection where possible.

---

# 8.4. Password Security

Implement:

- Strong password policy.
- BCrypt or approved secure password hashing.
- Failed login monitoring.
- Temporary lockout.
- Secure reset workflow.
- Session invalidation after password changes.

---

# 8.5. RBAC

Implement:

```text
User
Role
Permission
```

Expected initial organizational roles:

```text
Administrator
HR Manager
Supervisor
Finance Manager
Director
```

The candidate/intern access model must follow the domain and application responsibilities documented for the platform.

---

# 8.6. Authorization

Authorization must occur server-side.

Protect:

```text
Endpoint
+
Action
+
Resource Ownership
```

Examples:

- Supervisor may only manage assigned interns.
- Finance Manager may manage authorized payment processes.
- Candidate may only access their own application information.

---

# 8.7. Security Headers

Configure appropriate production HTTP security headers.

Review:

- Content Security Policy.
- HSTS.
- X-Content-Type-Options.
- Frame protections.
- Referrer Policy.
- Permissions Policy.

---

# 8.8. Rate Limiting

Apply stronger controls to:

```text
Login
Registration
Password Reset
Refresh
File Upload
Public APIs
```

---

# 8.9. HTTPS

Production communication must use HTTPS.

Never deploy production authentication over plain HTTP.

The Cahier des Charges explicitly requires secure communication over HTTPS.

---

## Exit Criteria

Security foundation is considered ready only when:

- Authentication works.
- JWT works.
- Refresh works.
- Revocation works.
- RBAC works.
- Unauthorized access is rejected.
- Rate limiting is active.
- Audit events are generated.
- Security tests pass.

---

# 9. PHASE 3 — API Contract and Integration Foundation

## Objective

Create a stable API contract shared by all three client applications.

---

# 9.1. REST API Standard

Base path:

```text
/api/v1
```

Standardize:

- HTTP methods.
- Status codes.
- Error format.
- Pagination.
- Sorting.
- Filtering.
- Validation.
- Resource naming.

---

# 9.2. OpenAPI

Document:

- Every endpoint.
- Request schemas.
- Response schemas.
- Authentication.
- Error responses.
- Pagination.
- Authorization requirements.

Swagger/OpenAPI is explicitly included in the project technology stack.

---

# 9.3. API Versioning

Start with:

```text
v1
```

Do not create breaking changes silently.

---

# 9.4. Contract Testing

Ensure clients and backend agree on:

- JSON structure.
- Required fields.
- Status codes.
- Error format.
- Enum values.

---

# 9.5. Integration Environments

Establish:

```text
Development
Testing
Production
```

with separate configuration.

---

## Exit Criteria

- OpenAPI documentation is complete.
- API contracts are stable.
- Clients can integrate without reverse-engineering backend behavior.

---

# 10. PHASE 4 — Angular Back Office Foundation

## Objective

Build the enterprise Angular application foundation.

Technology baseline:

```text
Angular 20
TypeScript
Standalone Components
Angular Router
Reactive Forms
Signals
RxJS where appropriate
SCSS
```

---

# 10.1. Project Architecture

Create:

```text
core/
shared/
layouts/
features/
config/
```

---

# 10.2. Core

Implement:

```text
Authentication
Authorization
HTTP
Guards
Interceptors
Error Handling
Configuration
```

---

# 10.3. Shared UI

Create:

```text
Button
Input
Select
Modal
Dialog
Table
Badge
Alert
Toast
Pagination
Breadcrumb
PageHeader
Loader
EmptyState
```

---

# 10.4. Layout

Create:

```text
Application Shell
Sidebar
Top Bar
Breadcrumb
Content Area
Notification Area
User Menu
Responsive Navigation
```

---

# 10.5. Login

The first fully functional Back Office workflow must be:

```text
Login
 -> Authenticate
 -> Load Current User
 -> Load Roles / Permissions
 -> Enter Application
```

---

# 10.6. Loading System

Implement consistent states:

```text
Idle
Loading
Success
Empty
Error
Refreshing
```

Avoid blank screens.

---

# 10.7. Error System

Implement global handling for:

```text
401
403
404
409
422
429
500
503
Network Error
```

---

## Exit Criteria

Angular must have:

- Secure login.
- Protected routes.
- Dynamic RBAC.
- Global error handling.
- Responsive application shell.
- Shared component foundation.

---

# 11. PHASE 5 — Back Office Identity and Administration

## Objective

Implement the administrative foundation of the STEG Back Office.

The Cahier des Charges explicitly requires management of users, roles, and permissions in the Back Office.

---

# 11.1. User Management

Implement:

- User list.
- Search.
- Filtering.
- User detail.
- Create user.
- Edit user.
- Activate user.
- Disable user.
- Lock user.
- Session management where authorized.

---

# 11.2. Role Management

Implement:

- Role list.
- Create role.
- Edit role.
- Assign permissions.
- Remove permissions.

---

# 11.3. Permission Management

Implement:

- Permission catalog.
- Permission assignment.
- Permission viewing.

---

# 11.4. Department Management

Implement:

- Department hierarchy.
- Department creation.
- Department modification.
- Department activation/deactivation where business rules allow.

The organizational hierarchy must be represented correctly and must not be flattened merely for implementation convenience.

---

# 11.5. Audit Viewer

Implement:

- Search by user.
- Search by action.
- Search by entity.
- Date filtering.
- Detail view.
- Before/after values where available.

---

## Exit Criteria

Internal administration is usable and secure.

---

# 12. PHASE 6 — Back Office Internship Management

## Objective

Implement the core business module of the platform.

---

# 12.1. Candidate Management

Implement:

- Candidate list.
- Candidate detail.
- Candidate profile.
- Manual candidate registration.
- Account linking.
- Search.
- Filters.

The Cahier des Charges explicitly requires the ability to register applications manually when applications are submitted directly to STEG.

---

# 12.2. Application Management

Implement:

```text
Draft
Submitted
Under Review
Accepted
Rejected
```

Operations:

- View.
- Search.
- Filter.
- Review.
- Accept.
- Reject.
- Track history.

---

# 12.3. Manual Applications

Back Office users must be able to create applications originating from physical/direct submissions.

The processing path must converge into the same business workflow as online applications.

Do NOT implement two unrelated application systems.

Required:

```text
Online Application
        |
        v
Common Application Domain
        ^
        |
Manual STEG Registration
```

---

# 12.4. Internship Management

Implement:

- Internship creation.
- Internship detail.
- Internship lifecycle.
- Start/end dates.
- Status.
- Candidate relation.
- Reference.

---

# 12.5. Assignment Management

Implement:

- Department assignment.
- Supervisor assignment.
- Assignment history.
- Active assignment rules.
- Reassignment.

Business rule:

Only one assignment may be active for an internship at a given time.

---

# 12.6. Supervisor Management

Implement:

- Supervisor listing.
- Supervisor availability.
- Assigned interns.
- Assignment history.

---

# 12.7. Internship Dashboard

Display:

- Active internships.
- Planned internships.
- Completed internships.
- Pending assignments.
- Upcoming starts.
- Upcoming endings.

---

## Exit Criteria

The full administrative internship lifecycle can be managed without bypassing business rules.

---

# 13. PHASE 7 — Workflow and Document Management

## Objective

Digitize administrative approvals, validations, and document processing.

The Cahier des Charges explicitly requires workflow management and automatic administrative document generation.

---

# 13.1. Workflow Engine

Implement:

```text
Workflow
WorkflowStep
WorkflowAction
```

Support:

```text
APPROVAL
VALIDATION
```

---

# 13.2. Workflow Actions

Each action must contain:

- Actor.
- Decision.
- Comment.
- Timestamp.
- Relevant traceability metadata.

---

# 13.3. Workflow UI

Implement:

- Workflow timeline.
- Current step.
- Completed steps.
- Pending actions.
- Decision history.

---

# 13.4. Document Management

Implement:

- Upload.
- Download.
- Validation.
- Versioning.
- Metadata.
- Access control.
- Audit.

---

# 13.5. Generated Documents

Implement:

```text
Internship Convention
Assignment Letter
Internship Certificate
```

as defined by the project domain model.

---

# 13.6. PDF Generation

Implement:

- Templates.
- Dynamic data.
- Official layout.
- Versioning.
- Storage.
- Download.
- Audit.

---

# 13.7. Document Verification

Implement:

- Document reference.
- Integrity verification.
- QR-based verification where included in the approved implementation.

---

## Exit Criteria

A complete application-to-approval-to-document workflow works end-to-end.

---

# 14. PHASE 8 — Finance and Reporting

## Objective

Implement indemnity/payment management and management reporting.

The Cahier des Charges explicitly includes indemnity management, reports, statistics, and decision dashboards.

---

# 14.1. Payment Management

Implement:

- Payment creation.
- Payment reference.
- Amount.
- Currency.
- Method.
- Status.
- Validation.
- Approval.
- Paid state.
- History.

---

# 14.2. Payment Workflow

Expected flow:

```text
PENDING
   |
   v
VALIDATED
   |
   v
PAID
   |
   v
ARCHIVED
```

---

# 14.3. Financial Security

Restrict financial operations by permission.

Never allow ordinary users to:

- Modify paid records.
- Approve their own unauthorized transactions.
- Access unauthorized financial information.

---

# 14.4. Reports

Implement:

- Internship statistics.
- Candidate statistics.
- Department statistics.
- Payment statistics.
- Workflow statistics.
- Activity reports.

---

# 14.5. Dashboard

Provide role-specific dashboards:

```text
Administrator
HR Manager
Finance Manager
Supervisor
Director
```

---

## Exit Criteria

Management can obtain reliable operational information without manually aggregating database data.

---

# 15. PHASE 9 — Next.js Front Office

## Objective

Build the public/candidate-facing web application.

The Cahier des Charges defines the Front Office as the application intended for students and candidates.

---

# 15.1. Public Website Foundation

Implement:

- Home.
- About.
- Internship information.
- Application information.
- Contact.
- Public documents/information where authorized.

---

# 15.2. Candidate Authentication

Implement:

- Registration.
- Email verification.
- Login.
- Logout.
- Password reset.
- Session restoration.

---

# 15.3. Candidate Profile

Implement:

- Personal information.
- University information.
- Contact information.
- Profile update.

---

# 15.4. Application Wizard

Implement guided flow:

```text
Personal Information
        |
University Information
        |
Documents
        |
Review
        |
Submit
```

---

# 15.5. Application Tracking

Display:

```text
Draft
Submitted
Under Review
Accepted
Rejected
```

Include:

- Timeline.
- Submission date.
- Reference.
- Required actions.

---

# 15.6. Documents

Implement:

- Upload required files.
- View status.
- Download authorized administrative documents.

---

# 15.7. Notifications

Implement:

- In-app notifications.
- Read/unread state.
- Related entity navigation.

---

# 15.8. Front Office UX

Must be:

- Responsive.
- Accessible.
- Fast.
- Mobile-friendly.
- Clear.
- Low-friction.

---

## Exit Criteria

A candidate can complete the full digital application process without Back Office intervention, while manual applications continue to be supported internally.

---

# 16. PHASE 10 — Flutter Internship Companion

## Objective

Build the operational mobile application for interns and supervisors.

The Cahier des Charges explicitly positions the Flutter application as the companion throughout the internship rather than the pre-internship application portal.

---

# 16.1. Mobile Foundation

Implement:

- Authentication.
- Secure token storage.
- Routing.
- State management.
- Local storage.
- Network layer.
- Error handling.

---

# 16.2. Intern Dashboard

Display:

- Internship.
- Supervisor.
- Department.
- Progress.
- Tasks.
- Journal status.
- Deliverables.
- Notifications.

---

# 16.3. Internship Timeline

Display:

- Assignment.
- Current phase.
- Milestones.
- Important deadlines.
- Evaluation events.
- Completion.

---

# 16.4. Journal

Implement:

- Create entry.
- Save draft.
- Submit.
- View validation.
- View supervisor comments.

---

# 16.5. Tasks

Implement:

- To-Do list.
- Status.
- Due date.
- Completion tracking.

---

# 16.6. Deliverables

Implement:

- File selection.
- Upload.
- Progress.
- Version.
- Validation state.
- Feedback.

---

# 16.7. Supervisor Area

Implement:

- Assigned interns.
- Internship progress.
- Journal validation.
- Deliverable validation.
- Comments.
- Evaluations.

---

# 16.8. Evaluations

Support:

```text
DAILY
WEEKLY
MID_TERM
FINAL
CUSTOM
```

with:

- Criteria.
- Scores.
- Feedback.

---

## Exit Criteria

The complete internship execution lifecycle is available on mobile.

---

# 17. PHASE 11 — Offline and Synchronization

## Objective

Provide resilient mobile behavior in unstable network environments.

Offline capabilities must be implemented carefully and must never compromise backend authority.

---

# 17.1. Local Cache

Cache appropriate information:

- Internship.
- Tasks.
- Journal drafts.
- Previously downloaded documents.
- Notifications.

---

# 17.2. Pending Operations

Queue:

- Journal drafts.
- Task changes.
- Pending uploads.

---

# 17.3. Synchronization

Implement:

```text
Local Changes
    |
    v
Sync Queue
    |
    v
Backend
    |
    v
PostgreSQL
```

---

# 17.4. Conflict Management

Administrative backend decisions always have priority.

Examples:

```text
Internship Status
Assignment
Validation
Approval
Payment Status
```

User-generated drafts may use controlled merge rules.

---

# 17.5. Retry

Failed synchronization:

```text
Attempt 1
Attempt 2
Attempt 3
Failed
```

No infinite retry loops.

---

## Exit Criteria

Offline mode never silently loses user-generated information.

---

# 18. PHASE 12 — Notification System

## Objective

Create a unified notification architecture shared by applications.

The Cahier des Charges requires notifications for the Front Office and Mobile application, including reminders and internship-related updates. 
---

# 18.1. In-App Notifications

Support:

- Read/unread.
- Related entity.
- Priority.
- Timestamp.

---

# 18.2. Email

Use the project's simple email architecture.

Do not introduce unnecessary paid notification infrastructure.

Support:

- Application confirmations.
- Status updates.
- Workflow reminders.
- Validation notifications.
- Password reset.

---

# 18.3. Push

For Flutter:

```text
Firebase Cloud Messaging
```

Use for:

- Journal validation.
- Deliverable feedback.
- New tasks.
- Important reminders.

---

# 18.4. Notification Rules

Avoid notification spam.

Every notification must have a business reason.

---

## Exit Criteria

Critical workflow events correctly produce authorized notifications in the relevant channels.

---

# 19. PHASE 13 — Cross-Application Integration

## Objective

Validate the full platform ecosystem.

Test:

```text
Front Office
      |
      v
Backend
      |
      v
Back Office
      |
      v
Mobile
```

---

# 19.1. End-to-End Candidate Journey

```text
Candidate Registration

        ↓

Application Submission

        ↓

HR Review

        ↓

Application Acceptance

        ↓

Internship Creation

        ↓

Assignment

        ↓

Supervisor Assignment

        ↓

Mobile Access
```

---

# 19.2. Internship Journey

```text
PLANNED

↓

ACTIVE

↓

Journal / Tasks / Deliverables

↓

Evaluation

↓

COMPLETED

↓

Certificate
```

---

# 19.3. Finance Journey

```text
Internship

↓

Payment Creation

↓

Validation

↓

Approval

↓

PAID
```

---

# 19.4. Notification Journey

Every important event must be reviewed for:

- In-app notification.
- Email.
- Push where applicable.

---

# 20. PHASE 14 — Testing Strategy

## Objective

Validate correctness before production.

---

# 20.1. Unit Testing

Backend:

- Services.
- Domain rules.
- Validators.
- Mappers.

Angular:

- Services.
- Guards.
- Interceptors.
- Components.

Next.js:

- Components.
- Validation.
- Data access.

Flutter:

- Use cases.
- Repositories.
- Controllers.

---

# 20.2. Integration Testing

Test:

- Database.
- REST APIs.
- Authentication.
- Authorization.
- File storage.
- Notification infrastructure.

---

# 20.3. End-to-End Testing

Required scenarios:

### Candidate

```text
Register
Login
Create Application
Upload Documents
Submit
Track Status
```

### HR

```text
Login
Review Application
Accept
Create Internship
Assign Department
Assign Supervisor
```

### Supervisor

```text
Login
View Intern
Review Journal
Validate
Review Deliverable
Evaluate
```

### Finance

```text
Login
View Payment
Validate
Approve
Mark Paid
```

### Mobile

```text
Login
View Internship
Create Journal
Submit
Receive Notification
```

---

# 20.4. Negative Testing

Test:

- Invalid credentials.
- Expired JWT.
- Revoked refresh token.
- Unauthorized resource access.
- Invalid status transitions.
- Invalid files.
- Oversized files.
- Duplicate references.
- Duplicate submissions.
- Invalid dates.

---

# 20.5. Security Testing

Perform:

- Authentication tests.
- Authorization tests.
- RBAC tests.
- SQL injection tests.
- XSS tests.
- CSRF review.
- Path traversal tests.
- File upload tests.
- Rate-limit tests.
- Token replay tests.

---

# 20.6. Mobile Testing

Test:

- Android.
- iOS.
- Different screen sizes.
- Offline mode.
- Network interruption.
- Notification reception.
- Camera permission.
- File upload interruption.

---

# 21. PHASE 15 — Performance Engineering

## Objective

Ensure the system remains responsive under realistic load.

---

# 21.1. Backend

Optimize:

- Database queries.
- Pagination.
- Indexes.
- N+1 queries.
- Serialization.
- Transactions.

---

# 21.2. Frontend

Optimize:

- Initial loading.
- Lazy loading.
- Bundle size.
- Images.
- Rendering.
- API calls.

---

# 21.3. Mobile

Optimize:

- Startup.
- Memory.
- Local database.
- Network usage.
- Images.
- Background operations.

---

# 21.4. Dashboard Performance

Avoid executing large uncontrolled queries for every dashboard widget.

Prefer:

- Aggregated queries.
- Cached statistics where appropriate.
- Pagination.
- Controlled refresh.

---

# 21.5. Load Testing

Simulate:

- Concurrent logins.
- Application submissions.
- File uploads.
- Dashboard access.
- Notifications.

---

# 22. PHASE 16 — Security Hardening

## Objective

Perform a complete security review before production.

---

# 22.1. Authentication Review

Verify:

- Password hashing.
- JWT validation.
- Refresh rotation.
- Logout.
- Session invalidation.
- Account lockout.

---

# 22.2. Authorization Review

Verify every endpoint for:

```text
Authentication
+
Role
+
Permission
+
Ownership
```

---

# 22.3. Data Protection

Protect:

- Personal data.
- Identity documents.
- Financial information.
- Evaluation information.
- Credentials.

The Cahier des Charges explicitly requires confidentiality and protection of information.

---

# 22.4. File Security

Verify:

- MIME validation.
- Extension validation.
- Size limits.
- Secure storage.
- Malware scanning strategy.
- Access control.
- Integrity checksum.
- Audit trail.

---

# 22.5. Secrets

Ensure no secrets exist in:

- Git.
- Frontend bundles.
- Mobile source.
- Logs.
- Documentation.

Use:

```text
Environment Variables
Secret Management
```

---

# 22.6. Dependency Review

Check dependencies for vulnerabilities before release.

---

# 23. PHASE 17 — Reliability and Resilience

## Objective

Ensure the platform behaves predictably under failures.

---

# 23.1. Database

Implement:

- Automated backups.
- Restore tests.
- Integrity checks.

The Cahier des Charges explicitly requires regular backups and information integrity.

---

# 23.2. External Services

Handle failure of:

- SMTP.
- Push notifications.
- File storage.

The core business transaction must not become corrupted because a secondary notification service temporarily fails.

---

# 23.3. Graceful Degradation

Examples:

If email fails:

```text
Business Operation
        |
        v
Completed
        |
        v
Email Retry
```

Do not falsely report that the internship operation failed only because the email provider was temporarily unavailable.

---

# 23.4. Recovery

Document procedures for:

- Database restoration.
- File restoration.
- Application restart.
- Token/session revocation.
- Incident handling.

---

# 24. PHASE 18 — Observability and Monitoring

## Objective

Create production visibility.

---

# 24.1. Application Metrics

Monitor:

- API latency.
- Error rates.
- Authentication failures.
- Database health.
- File storage health.
- Job failures.

---

# 24.2. Logs

Centralize production logs where infrastructure permits.

---

# 24.3. Health Checks

Expose secure health information for:

- Backend.
- Database.
- Storage.
- Critical dependencies.

---

# 24.4. Alerts

Alerts should be triggered for:

- High error rates.
- Database unavailable.
- Backup failures.
- Repeated login attacks.
- Storage failures.
- Background job failures.

---

# 25. PHASE 19 — Deployment Preparation

## Objective

Prepare a controlled production deployment.

---

# 25.1. Environments

Maintain:

```text
Development
Testing / Staging
Production
```

Never test directly against production.

---

# 25.2. Backend Deployment

Package Spring Boot application.

Verify:

- Production profile.
- Database configuration.
- Secrets.
- TLS.
- Logging.
- Health checks.

---

# 25.3. Front Office Deployment

Deploy Next.js production build.

Verify:

- Environment variables.
- API base URL.
- Security headers.
- SEO.
- Caching.

---

# 25.4. Back Office Deployment

Deploy Angular optimized production build.

Verify:

- API configuration.
- Authentication.
- Route handling.
- Browser compatibility.

---

# 25.5. Mobile Release

Prepare:

```text
Android
iOS
```

Verify:

- Signing.
- Production API.
- Push configuration.
- App permissions.
- Crash handling.

---

# 26. PHASE 20 — Production Readiness Review

The project must not be considered production-ready merely because the application builds successfully.

---

# 26.1. Functional Checklist

- [ ] Candidate registration works.
- [ ] Application submission works.
- [ ] Manual application registration works.
- [ ] Application review works.
- [ ] Internship creation works.
- [ ] Assignment works.
- [ ] Supervisor assignment works.
- [ ] Workflow works.
- [ ] Documents work.
- [ ] PDF generation works.
- [ ] Payments work.
- [ ] Dashboard works.
- [ ] Reports work.
- [ ] Mobile journal works.
- [ ] Tasks work.
- [ ] Deliverables work.
- [ ] Evaluations work.
- [ ] Notifications work.

---

# 26.2. Security Checklist

- [ ] HTTPS.
- [ ] JWT.
- [ ] Refresh Token rotation.
- [ ] RBAC.
- [ ] Permission checks.
- [ ] Rate limiting.
- [ ] Password policy.
- [ ] Secure file handling.
- [ ] Audit logging.
- [ ] Security headers.
- [ ] Secrets protected.
- [ ] No sensitive information in logs.

---

# 26.3. Performance Checklist

- [ ] Pagination.
- [ ] Query optimization.
- [ ] Database indexes.
- [ ] Lazy loading.
- [ ] Frontend code splitting.
- [ ] Image optimization.
- [ ] Mobile optimization.
- [ ] Load testing completed.

---

# 26.4. Reliability Checklist

- [ ] Backup configured.
- [ ] Restore tested.
- [ ] Error handling verified.
- [ ] Retry policies verified.
- [ ] Failure scenarios tested.
- [ ] Monitoring enabled.
- [ ] Health checks enabled.

---

# 26.5. UX Checklist

- [ ] Responsive.
- [ ] Accessible.
- [ ] Loading states.
- [ ] Empty states.
- [ ] Error states.
- [ ] Success feedback.
- [ ] No unnecessary blocking.
- [ ] Clear navigation.
- [ ] Consistent components.

---

# 27. PHASE 21 — User Acceptance Testing

## Objective

Verify that the platform corresponds to real STEG operational expectations.

---

# 27.1. HR Acceptance

Validate:

- Candidate management.
- Application management.
- Internship management.
- Assignment.
- Documents.
- Workflows.

---

# 27.2. Supervisor Acceptance

Validate:

- Intern monitoring.
- Journal.
- Deliverables.
- Evaluations.
- Notifications.

---

# 27.3. Finance Acceptance

Validate:

- Payments.
- Validation.
- Reports.

---

# 27.4. Management Acceptance

Validate:

- Dashboards.
- Statistics.
- Reporting.
- Decision-support information.

---

# 27.5. Candidate Acceptance

Validate:

- Registration.
- Application.
- Documents.
- Tracking.

---

# 28. PHASE 22 — Documentation Finalization

## Objective

Ensure the implementation and documentation never diverge.

Update:

```text
Architecture
Database
API
Security
Frontend
Backend
Mobile
Testing
Deployment
```

Document:

- Major decisions.
- Known limitations.
- Operational procedures.
- Recovery procedures.
- Environment setup.

---

# 29. Definition of Done

A feature is complete only when:

```text
Functional
+
Secure
+
Validated
+
Tested
+
Responsive
+
Accessible
+
Documented
+
Audited where required
+
Performant
```

A feature is **not** complete merely because:

```text
"The page works."
```

---

# 30. Development Rules for AI Coding Agents

Any AI agent working on the project must:

## Before Coding

Read:

```text
/docs
```

especially the documentation related to the requested feature.

---

## During Coding

The agent must:

- Respect the domain model.
- Respect business rules.
- Respect API contracts.
- Reuse existing abstractions.
- Avoid duplication.
- Preserve security.
- Preserve responsiveness.
- Preserve accessibility.
- Preserve error handling.
- Preserve loading behavior.

---

## Forbidden

The agent must not:

- Invent unrelated business behavior.
- Bypass the backend.
- Introduce duplicate sources of truth.
- Hardcode permissions.
- Hardcode business status logic in multiple clients.
- Expose database credentials.
- Store passwords in plaintext.
- Log JWTs or refresh tokens.
- Directly manipulate production data.
- Delete existing functionality without justification.
- Rewrite stable architecture unnecessarily.

---

# 31. Data Ownership Rule

Every business concept must have one authoritative owner.

Example:

```text
Internship Status
        |
        v
Backend
```

Not:

```text
Angular Internship Status
Next.js Internship Status
Flutter Internship Status
```

The clients display backend state.

---

# 32. Business Rule Ownership

Rules belong to the backend.

Examples:

- Application state transitions.
- Internship state transitions.
- Assignment constraints.
- Workflow permissions.
- Payment status transitions.
- Document authorization.
- Evaluation authorization.

Frontend may disable impossible actions for UX purposes, but backend must enforce the rule.

---

# 33. Cross-Application Consistency

Whenever one business event occurs, all clients must eventually reflect the same backend state.

Example:

```text
HR accepts application

        |

Backend

        |

Internship created

        |

Notification generated

        |

Front Office updated

        |

Back Office updated

        |

Mobile becomes eligible
```

---

# 34. Performance Rules

Never optimize prematurely, but never ignore performance.

Every implementation must consider:

- Database query count.
- Payload size.
- Rendering cost.
- Network usage.
- Memory.
- File size.
- Caching.

---

# 35. Error Handling Rules

Every asynchronous operation must support:

```text
Loading
Success
Empty
Error
Retry
```

Critical operations must never fail silently.

---

# 36. Responsive Rules

Every web screen must be validated at minimum for:

```text
Mobile
Tablet
Desktop
Large Desktop
```

Mobile application must support:

```text
Small Smartphone
Large Smartphone
Tablet where relevant
```

---

# 37. Accessibility Rules

Every interface must preserve:

- Keyboard navigation.
- Focus visibility.
- Screen reader semantics.
- Sufficient contrast.
- Meaningful labels.
- Accessible errors.
- Accessible touch targets.

Target:

```text
WCAG AA
```

---

# 38. Git and Version Control Strategy

Recommended branches:

```text
main
develop
feature/*
fix/*
release/*
```

Every meaningful feature must be:

- Small enough to review.
- Clearly named.
- Tested.
- Documented where needed.

Do not merge unfinished experimental code into production branches.

---

# 39. Continuous Integration

CI should perform at minimum:

```text
Install dependencies

↓

Lint

↓

Type Check

↓

Unit Tests

↓

Build

↓

Integration / Contract Tests where configured
```

A failing CI pipeline must block production release.

---

# 40. Release Strategy

Each production release should contain:

- Version number.
- Release notes.
- Database migration state.
- Known issues.
- Deployment instructions.
- Rollback strategy.

---

# 41. Database Migration Strategy

Every schema change must be versioned.

Never manually modify the production database without a controlled migration.

Migration process:

```text
Development

↓

Migration

↓

Testing

↓

Staging

↓

Production
```

Every migration must be:

- Repeatable in a controlled environment.
- Tested.
- Backward compatibility reviewed where required.

---

# 42. Backup and Recovery

Before major database migrations:

```text
Backup

↓

Migration

↓

Verification
```

For critical releases:

```text
Backup
+
Rollback Plan
+
Restore Test
```

---

# 43. Final Production Architecture

The target architecture is:

```text
                    INTERNET
                        |
                 HTTPS / TLS
                        |
              Reverse Proxy / Gateway
                        |
        -----------------------------------
        |                |                |
        |                |                |
 Next.js             Angular           Flutter
 Front Office       Back Office      Internship Companion
        |                |                |
        -----------------------------------
                        |
                        v
              Spring Boot 3 REST API
                        |
        -----------------------------------
        |                |                |
   Business          Security         Background
    Modules           Layer            Jobs
        |                |                |
        -----------------------------------
                        |
                 PostgreSQL
                        |
        -----------------------------------
        |                |                |
   File Storage    Notifications      Monitoring
```

---

# 44. Target Business Modules

The completed platform must contain at least:

```text
Identity & Access Management
Organization Management
Candidate Management
Internship Application Management
Internship Management
Assignment Management
Workflow Management
Document Management
Internship Companion
Evaluation Management
Notification Management
Financial Management
Audit Management
Reporting & Dashboard Management
```

---

# 45. Complete End-to-End Business Flow

The final system should support the following conceptual journey:

```text
CANDIDATE
   |
   | Registration
   v
CANDIDATE ACCOUNT
   |
   | Application
   v
INTERNSHIP APPLICATION
   |
   | Review
   v
WORKFLOW
   |
   | Approval
   v
INTERNSHIP
   |
   | Assignment
   v
DEPARTMENT + SUPERVISOR
   |
   v
INTERNSHIP COMPANION
   |
   +---- Journal
   |
   +---- Tasks
   |
   +---- Deliverables
   |
   +---- Notifications
   |
   +---- Evaluations
   |
   v
INTERNSHIP COMPLETION
   |
   +---- Certificate
   |
   +---- Payment Processing
   |
   v
REPORTING / ARCHIVING
```

---

# 46. Production Quality Gates

The project must pass the following gates sequentially.

## Gate 1 — Architecture

- [ ] Architecture reviewed.
- [ ] Documentation aligned.
- [ ] Domain verified.

## Gate 2 — Backend

- [ ] API operational.
- [ ] Business rules implemented.
- [ ] Database stable.

## Gate 3 — Security

- [ ] Authentication secure.
- [ ] Authorization secure.
- [ ] Audit complete.

## Gate 4 — Back Office

- [ ] Core administration functional.

## Gate 5 — Front Office

- [ ] Candidate lifecycle functional.

## Gate 6 — Mobile

- [ ] Internship lifecycle functional.

## Gate 7 — Integration

- [ ] Cross-application synchronization verified.

## Gate 8 — Testing

- [ ] Automated tests pass.
- [ ] User acceptance passes.

## Gate 9 — Production

- [ ] Deployment validated.
- [ ] Backup verified.
- [ ] Monitoring enabled.
- [ ] Rollback procedure documented.

---

# 47. Explicitly Deferred Features

The following items belong to future evolution unless explicitly promoted into the approved implementation scope:

```text
Electronic Signature
Biometric Authentication
Complete Offline-First Architecture
OCR
AI Assistance
Advanced Business Intelligence
Additional Administrative Processes
```

These are identified by the Cahier des Charges as perspectives of evolution rather than mandatory first-version functionality.

Do not allow future features to destabilize the core release.

---

# 48. Future Evolution Roadmap

Once the core platform is stable:

## Evolution 1

```text
Electronic Signature
```

## Evolution 2

```text
Biometric Mobile Authentication
```

## Evolution 3

```text
Full Offline-First
```

## Evolution 4

```text
OCR
```

## Evolution 5

```text
AI Assistance
```

## Evolution 6

```text
Advanced Decision Intelligence
```

## Evolution 7

```text
Additional STEG Administrative Processes
```

Examples named in the Cahier des Charges include:

- Congés
- Demandes internes
- Achats



---

# 49. Final Roadmap Summary

The complete development journey is:

```text
1.  Align Documentation
        ↓
2.  Harden Existing Backend
        ↓
3.  Secure Authentication
        ↓
4.  Establish API Contracts
        ↓
5.  Build Angular Foundation
        ↓
6.  Build Back Office Administration
        ↓
7.  Build Internship Management
        ↓
8.  Build Workflow + Documents
        ↓
9.  Build Finance + Reports
        ↓
10. Build Next.js Front Office
        ↓
11. Build Flutter Mobile
        ↓
12. Build Offline + Synchronization
        ↓
13. Integrate Notifications
        ↓
14. Perform Cross-Application Integration
        ↓
15. Complete Automated Testing
        ↓
16. Perform Performance Engineering
        ↓
17. Perform Security Hardening
        ↓
18. Implement Monitoring + Reliability
        ↓
19. Prepare Deployment
        ↓
20. Perform Production Readiness Review
        ↓
21. Execute User Acceptance Testing
        ↓
22. Finalize Documentation
        ↓
23. Production Release
        ↓
24. Continuous Maintenance
        ↓
25. Future STEG Digital Evolution
```

---

# 50. Final Objective

The final objective is not simply to produce three applications and a backend.

The objective is to deliver a **coherent digital platform for STEG** capable of centralizing the internship lifecycle from application through completion while improving:

- Administrative efficiency.
- Information centralization.
- Traceability.
- Document management.
- Validation workflows.
- Communication.
- Internship monitoring.
- Decision support.
- Security.
- Reliability.
- Maintainability.
- Future scalability.

This directly responds to the principal objectives of the Cahier des Charges: centralizing internship management, reducing paper usage, digitizing validation and follow-up, improving communication, ensuring traceability, automating administrative documents, providing dashboards, accompanying interns throughout their internship, and creating an evolvable architecture for future administrative modules.

The final implementation must therefore be treated as an **enterprise software platform**, not as a collection of independent CRUD applications.

Every future development decision must preserve the central principles of:

```text
Correctness
Security
Consistency
Traceability
Performance
Reliability
Accessibility
Responsiveness
Maintainability
Scalability
```

These qualities define the completion standard for the STEG Internship Management Platform.