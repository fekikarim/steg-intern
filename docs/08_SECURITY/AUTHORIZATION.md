# Authorization

> **Document Version:** 1.0  
> **Project:** Intelligent Internship Management & Administrative Workflow Platform - STEG  
> **Module:** Security  
> **Document:** Authorization Strategy

---

# 1. Purpose

This document defines the authorization strategy used throughout the platform.

While authentication answers the question:

> "Who are you?"

Authorization answers:

> "What are you allowed to do?"

Every operation executed inside the platform must be authorized according to the user's permissions.

The platform follows a centralized authorization model implemented in the Spring Boot Backend.

No client application (Angular, Next.js or Flutter) is allowed to make authorization decisions.

---

# 2. Authorization Architecture

```
                 Login
                   │
                   ▼
        Authentication (JWT)
                   │
                   ▼
      User Identity Retrieved
                   │
                   ▼
      Load User Roles & Permissions
                   │
                   ▼
       Authorization Decision
                   │
          Allowed / Forbidden
                   │
                   ▼
           Execute Request
```

---

# 3. Authorization Principles

The platform follows these principles.

## Principle 1

Every authenticated request must be authorized.

---

## Principle 2

Authorization is role-based.

Permissions are assigned to Roles.

Users inherit permissions through their assigned roles.

---

## Principle 3

Least Privilege Principle

Every user only receives the minimum permissions required to perform their work.

No unnecessary access is granted.

---

## Principle 4

Backend Authority

Only the backend determines whether an operation is allowed.

Frontend applications only adapt their interface according to received permissions.

They never enforce security.

---

## Principle 5

Permission-based Decisions

The backend checks permissions instead of checking role names whenever possible.

Instead of:

```
ROLE_HR
```

Prefer:

```
internship:create
```

This makes the system more flexible.

---

# 4. Authorization Flow

```
Request
   │
   ▼
JWT Filter
   │
   ▼
Extract User
   │
   ▼
Load User Permissions
   │
   ▼
Security Filter
   │
   ▼
Permission Check
   │
   ├───────────────┐
   │               │
Allowed         Forbidden
   │               │
Execute        HTTP 403
```

---

# 5. Authorization Levels

The platform defines several authorization levels.

| Level | Description |
|---------|------------|
| Public | Accessible without authentication |
| Authenticated | Requires login |
| Role Protected | Restricted to specific roles |
| Permission Protected | Restricted to specific permissions |
| Resource Protected | Access depends on ownership or assignment |

---

# 6. Public Resources

These endpoints require no authentication.

Examples:

- Internship information
- Internship opportunities
- Registration
- Login
- Password reset request
- Public documentation

---

# 7. Authenticated Resources

Accessible to any authenticated user.

Examples:

- View own profile
- Change password
- View personal notifications
- Logout
- Refresh token

---

# 8. Permission-Protected Resources

Business operations require explicit permissions.

Examples:

### Internship

- internship:create
- internship:update
- internship:delete
- internship:view

---

### Candidates

- candidate:create
- candidate:update
- candidate:view

---

### Documents

- document:upload
- document:download
- document:generate
- document:delete

---

### Workflow

- workflow:start
- workflow:approve
- workflow:reject
- workflow:view

---

### Payments

- payment:view
- payment:validate
- payment:approve

---

### Administration

- user:create
- user:update
- user:disable
- role:manage
- permission:manage

---

# 9. Resource-Based Authorization

Some operations depend on ownership rather than only permissions.

Examples:

A Candidate can:

- View their own application
- Edit their draft application
- Upload their own documents

But cannot access another candidate's application.

---

Supervisor rules:

A supervisor may only:

- Validate journals of assigned interns
- Comment assigned deliverables
- Evaluate assigned interns

They cannot manage internships assigned to another supervisor.

---

Intern rules:

An intern may:

- Submit their own journal
- Upload their own deliverables
- View their own evaluations

They cannot access another intern's data.

---

# 10. Administrative Authorization

Administrative users have broader permissions but remain restricted by business rules.

Examples:

HR Manager

Can:

- Manage candidates
- Create internships
- Assign supervisors
- Generate documents

Cannot:

- Modify audit logs
- Manage security configuration

---

Finance Manager

Can:

- Validate payments
- Approve indemnities
- View financial reports

Cannot:

- Create internships
- Assign supervisors

---

Director

Can:

- View dashboards
- View reports
- View statistics
- Approve strategic workflows

Cannot:

- Modify applications
- Delete documents

---

Administrator

Has full technical administration capabilities.

Can:

- Manage users
- Manage roles
- Manage permissions
- Configure security
- Unlock accounts
- Reset passwords
- View audit logs

---

# 11. Authorization in REST API

Each endpoint declares its required permission.

Example:

```
GET /api/internships

Permission:
internship:view
```

---

```
POST /api/internships

Permission:
internship:create
```

---

```
PUT /api/internships/{id}

Permission:
internship:update
```

---

```
DELETE /api/internships/{id}

Permission:
internship:delete
```

---

# 12. Authorization in Angular

The Angular Back Office uses permissions to improve the user experience.

Examples:

Hide buttons

Disable menu entries

Hide unauthorized pages

Disable actions

Display access denied messages

However, these checks are only for the UI.

The backend always performs the final authorization.

---

# 13. Authorization in Next.js

Candidates only access resources linked to their own account.

Examples:

- My Applications
- My Documents
- My Notifications
- My Internship

Ownership is validated by the backend.

---

# 14. Authorization in Flutter

Interns and supervisors receive different interfaces.

Intern:

- Journal
- Tasks
- Deliverables
- Timeline
- Documents

Supervisor:

- Assigned interns
- Journal validation
- Deliverable validation
- Evaluations
- Comments

Displayed features are driven by backend permissions.

---

# 15. Forbidden Access

When authorization fails:

```
HTTP 403 Forbidden
```

Response:

```json
{
  "timestamp": "2026-08-15T10:00:00Z",
  "status": 403,
  "error": "Forbidden",
  "message": "You do not have permission to perform this action.",
  "path": "/api/internships/42"
}
```

---

# 16. Authorization Logging

Authorization failures are recorded.

Logged information includes:

- User ID
- Requested endpoint
- HTTP method
- Missing permission
- Timestamp
- IP address
- User Agent

Repeated unauthorized attempts may trigger security alerts.

---

# 17. Authorization Best Practices

The platform follows these practices:

- Deny access by default
- Never trust frontend authorization
- Validate every request
- Use fine-grained permissions
- Restrict access to owned resources
- Enforce least privilege
- Separate authentication from authorization
- Log all sensitive authorization events
- Review permissions regularly
- Keep authorization rules centralized in the backend

---

# 18. Future Improvements

Future versions of the platform may include:

- Attribute-Based Access Control (ABAC)
- Dynamic policy engine
- Department-level access restrictions
- Time-based permissions
- Temporary delegated permissions
- Multi-tenant authorization
- Context-aware authorization (device, location, network)
- External Identity Provider (SSO) integration
- Approval-based privilege elevation

---

# 19. Summary

The platform implements a centralized, backend-driven authorization model based on RBAC and fine-grained permissions. Every request is authenticated, authorized, and validated before execution. Resource ownership rules ensure that users can only access data relevant to their responsibilities, while audit logging provides complete traceability of all authorization decisions. This approach guarantees a secure, scalable, and maintainable authorization architecture aligned with enterprise security best practices.