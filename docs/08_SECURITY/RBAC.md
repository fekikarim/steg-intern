# Role-Based Access Control (RBAC)

> **Document Version:** 1.0  
> **Project:** Intelligent Internship Management & Administrative Workflow Platform - STEG  
> **Module:** Security  
> **Document:** Role-Based Access Control (RBAC)

---

# 1. Purpose

This document defines the Role-Based Access Control (RBAC) model implemented within the STEG Internship Management Platform.

RBAC ensures that every authenticated user only has access to the resources and operations required to perform their responsibilities.

The platform follows an enterprise-grade RBAC architecture where:

- Users are assigned one or more Roles.
- Roles contain Permissions.
- Permissions authorize business operations.
- The backend is the single source of truth for authorization decisions.

---

# 2. RBAC Architecture

```
                 User
                  │
                  │
          Assigned Roles
                  │
        ┌─────────┴─────────┐
        │                   │
     HR Manager        Supervisor
        │                   │
        └─────────┬─────────┘
                  │
           Role Permissions
                  │
        internship:view
        internship:update
        journal:validate
        document:generate
        ...
                  │
                  ▼
         Authorization Decision
```

---

# 3. RBAC Principles

The authorization model follows several core principles.

## Principle 1

Users never receive permissions directly.

Permissions are always inherited through Roles.

---

## Principle 2

Roles represent business responsibilities.

Examples:

- Candidate
- Intern
- Supervisor
- HR Manager
- Finance Manager
- Director
- Administrator

---

## Principle 3

Permissions represent actions.

Examples:

```
internship:create
```

```
document:generate
```

```
payment:approve
```

---

## Principle 4

A user may have multiple roles simultaneously.

Example:

```
Supervisor

+

HR Manager
```

The effective permissions are the union of both roles.

---

## Principle 5

Authorization decisions are always permission-based.

The backend should avoid checking role names whenever possible.

Preferred:

```
Has Permission:
journal:validate
```

Instead of:

```
Role == Supervisor
```

---

# 4. RBAC Components

The RBAC system is composed of four entities.

```
User
   │
   ▼
Role
   │
   ▼
Permission
   │
   ▼
Business Operation
```

---

# 5. User

Represents an authenticated platform user.

Example:

```
User

ID
Email
Password
Status
```

A user may own one or several roles.

---

# 6. Role

A role groups permissions according to a business function.

Examples:

- Candidate
- Intern
- Supervisor
- HR Manager
- Finance Manager
- Director
- Administrator

Roles simplify permission management.

---

# 7. Permission

Permissions describe a single authorized action.

Examples:

```
candidate:create
```

```
candidate:view
```

```
candidate:update
```

```
candidate:delete
```

Permissions are granular and reusable.

---

# 8. User → Role Relationship

```
User

↓

One or More Roles
```

Example

```
John

↓

Supervisor

↓

journal:validate
deliverable:validate
evaluation:create
```

---

# 9. Role → Permission Relationship

```
Role

↓

Permission 1

Permission 2

Permission 3

Permission n
```

A role can contain many permissions.

A permission can belong to multiple roles.

---

# 10. Platform Roles

The platform defines the following primary roles.

---

## Candidate

Represents a student who applies for an internship.

Responsibilities:

- Create account
- Submit application
- Upload documents
- Track application
- Download available documents

---

## Intern

Represents an accepted candidate currently completing an internship.

Responsibilities:

- Complete journal entries
- Manage tasks
- Upload deliverables
- View evaluations
- View comments
- Download internship documents

---

## Supervisor

Represents the internship supervisor.

Responsibilities:

- Supervise assigned interns
- Validate journals
- Validate deliverables
- Evaluate interns
- Write comments
- Monitor progress

---

## HR Manager

Responsible for internship administration.

Responsibilities:

- Manage candidates
- Manage internships
- Assign supervisors
- Generate documents
- Manage workflows
- Produce reports

---

## Finance Manager

Responsible for financial operations.

Responsibilities:

- Validate indemnities
- Approve payments
- View payment reports

---

## Director

Responsible for management oversight.

Responsibilities:

- View dashboards
- View statistics
- Monitor KPIs
- Review reports

---

## Administrator

Responsible for platform administration.

Responsibilities:

- Manage users
- Manage roles
- Manage permissions
- Configure security
- Unlock accounts
- Access audit logs

---

# 11. Permission Naming Convention

Permissions follow a standardized naming format.

```
resource:action
```

Examples:

```
candidate:create
```

```
candidate:view
```

```
candidate:update
```

```
candidate:delete
```

Another example:

```
journal:submit
```

```
journal:validate
```

```
journal:view
```

This convention improves consistency and scalability.

---

# 12. Permission Categories

## Candidate

- candidate:create
- candidate:view
- candidate:update
- candidate:delete

---

## Internship

- internship:create
- internship:view
- internship:update
- internship:delete

---

## Application

- application:create
- application:view
- application:update
- application:approve
- application:reject

---

## Documents

- document:upload
- document:download
- document:generate
- document:delete

---

## Journal

- journal:create
- journal:submit
- journal:view
- journal:validate

---

## Deliverables

- deliverable:create
- deliverable:submit
- deliverable:view
- deliverable:validate

---

## Evaluation

- evaluation:create
- evaluation:update
- evaluation:view

---

## Workflow

- workflow:start
- workflow:view
- workflow:approve
- workflow:reject

---

## Payments

- payment:view
- payment:validate
- payment:approve

---

## Administration

- user:create
- user:update
- user:disable
- role:manage
- permission:manage

---

# 13. Role Matrix

| Permission | Candidate | Intern | Supervisor | HR | Finance | Director | Admin |
|------------|:---------:|:------:|:----------:|:--:|:--------:|:--------:|:-----:|
| View own profile | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit application | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Upload documents | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |
| View application | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Manage applications | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Assign supervisor | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Validate journal | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Validate deliverable | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Create evaluation | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Generate documents | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Validate payment | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| View dashboards | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

# 14. Resource Ownership Rules

RBAC is complemented by ownership validation.

Examples:

A Candidate can only:

- View their own applications.
- Upload their own documents.
- View their own internship.

An Intern can only:

- Edit their own journal.
- Submit their own deliverables.
- View their own evaluations.

A Supervisor can only:

- Access interns assigned to them.
- Validate journals they supervise.
- Evaluate assigned interns.

These ownership rules are enforced by the backend in addition to RBAC permissions.

---

# 15. Spring Security Integration

RBAC is implemented using Spring Security.

Typical authorization annotations include:

```java
@PreAuthorize("hasAuthority('internship:view')")
```

```java
@PreAuthorize("hasAuthority('journal:validate')")
```

```java
@PreAuthorize("hasAuthority('payment:approve')")
```

Business services may also include ownership checks after permission validation.

---

# 16. Permission Evaluation Flow

```
Incoming Request
        │
        ▼
JWT Authentication
        │
        ▼
Load User
        │
        ▼
Load Roles
        │
        ▼
Load Permissions
        │
        ▼
Permission Check
        │
        ▼
Ownership Validation (if required)
        │
   ┌────┴────┐
   │         │
Allowed   Forbidden (403)
```

---

# 17. RBAC Best Practices

The platform follows these best practices:

- Roles represent business responsibilities.
- Permissions represent individual actions.
- Users never receive permissions directly.
- Authorization decisions rely on permissions rather than role names.
- Ownership validation complements RBAC.
- Every sensitive operation is protected.
- Access is denied by default.
- Permissions are reusable and standardized.
- Role assignments are managed only by administrators.
- Authorization events are recorded in audit logs.

---

# 18. Future Improvements

The RBAC model has been designed to evolve without major architectural changes.

Future enhancements may include:

- Attribute-Based Access Control (ABAC)
- Department-scoped permissions
- Temporary delegated permissions
- Time-limited role assignments
- Dynamic policy engine
- Context-aware authorization
- External Identity Provider (SSO)
- Multi-tenant role isolation

---

# 19. Summary

The STEG Internship Management Platform implements a centralized Role-Based Access Control (RBAC) model where users inherit permissions through assigned roles. Permissions define business actions, while ownership validation ensures access is limited to relevant resources. Combined with Spring Security, JWT authentication, and audit logging, this approach provides a secure, scalable, and maintainable authorization framework suitable for enterprise environments.