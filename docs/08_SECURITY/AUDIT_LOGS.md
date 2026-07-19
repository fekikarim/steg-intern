# Audit Logs Specification

## 1. Overview

The Audit Log module provides a complete traceability mechanism for all important operations performed inside the platform.

Since the platform manages sensitive administrative workflows, internship applications, personal information, document exchanges, validations, and financial operations, every critical action must be recorded.

The objective is to guarantee:

- Traceability of user activities.
- Accountability of administrative actions.
- Detection of suspicious behavior.
- Compliance with internal security policies.
- Easier debugging and investigation.

The Audit Log system is a cross-cutting security component used by all platform modules.

---

# 2. Audit Log Objectives

The audit system must:

- Record who performed an action.
- Record when the action occurred.
- Record which entity was affected.
- Record the previous and new values when applicable.
- Provide historical reconstruction of important operations.
- Prevent unauthorized modification of audit records.

---

# 3. Audited Operations

The following operations must generate audit records:

## 3.1 Authentication Operations

Examples:

- Successful login.
- Failed login attempt.
- Logout.
- Password change.
- Password reset.
- Account activation.
- Account locking.
- Refresh token usage.
- Session termination.

Example:


User Karim logged into the platform successfully.


---

## 3.2 User Management

Audited actions:

- Creating a user.
- Updating user information.
- Disabling an account.
- Assigning roles.
- Removing roles.
- Modifying permissions.

Example:


Administrator assigned ROLE_HR_MANAGER to user ID: xxx


---

## 3.3 Internship Management

Audited actions:

- Creating an internship.
- Updating internship information.
- Assigning a supervisor.
- Changing internship status.
- Closing an internship.

Example:


Supervisor assignment changed from Department A to Department B


---

## 3.4 Workflow Operations

Audited actions:

- Workflow creation.
- Workflow execution.
- Approval.
- Rejection.
- Validation.
- Returned requests.

Example:


HR Manager approved internship application REF-2026-001


---

## 3.5 Document Management

Audited actions:

- Uploading documents.
- Downloading sensitive documents.
- Generating documents.
- Validating documents.
- Deleting documents.

Example:


Supervisor validated internship certificate


---

## 3.6 Financial Operations

Audited actions:

- Creating payment records.
- Validating indemnities.
- Updating payment status.
- Approving payments.

Example:


Finance Manager validated payment reference PAY-001


---

# 4. Audit Log Data Model

Based on the domain model:


AuditLog

id
user_id
action
entity_name
entity_id
old_value
new_value
ip_address
user_agent
created_at

---

# 5. AuditLog Entity

```java
class AuditLog {

    UUID id;

    UUID userId;

    String action;

    String entityName;

    UUID entityId;

    String oldValue;

    String newValue;

    String ipAddress;

    String userAgent;

    LocalDateTime createdAt;
}
```

---

# 6. Audit Event Structure

Each audit event should contain:

| Field | Description |
| --- | --- |
| id | Unique identifier |
| userId | User responsible for action |
| action | Performed operation |
| entityName | Modified entity |
| entityId | Target object |
| oldValue | Previous state |
| newValue | New state |
| ipAddress | Source address |
| userAgent | Client information |
| timestamp | Operation date |

---

# 7. Audit Action Naming Convention

Actions must follow a standardized format.

Pattern:

ENTITY_ACTION

Examples:

USER_CREATED

USER_ROLE_UPDATED

INTERNSHIP_ASSIGNED

APPLICATION_APPROVED

DOCUMENT_VALIDATED

PAYMENT_COMPLETED

---

# 8. Audit Levels

## 8.1 Security Level

Critical security events.

Examples:

Login failures.
Password modifications.
Permission changes.

Retention:

Minimum 5 years

## 8.2 Business Level

Business workflow events.

Examples:

Internship approval.
Document validation.
Payment processing.

Retention:

Minimum 3 years

## 8.3 Technical Level

System technical events.

Examples:

API errors.
Configuration changes.
Service failures.

Retention:

Minimum 1 year

---

# 9. Implementation Strategy

The backend will implement audit logging using:

Spring Boot interceptors.
Spring AOP.
Entity listeners.
Custom audit services.

Architecture:

Controller
    |
Service Layer
    |
Business Operation
    |
Audit Service
    |
Audit Database Table

---

# 10. Automatic Auditing

The following entities should automatically generate audit events:

User
Role
Permission
Candidate
InternshipApplication
Internship
InternshipAssignment
Workflow
Document
Payment

---

# 11. Manual Auditing

Some business actions require explicit audit creation.

Examples:

Internship approval.
Supervisor validation.
Payment authorization.

Example:

```
auditService.log(
    "APPLICATION_APPROVED",
    applicationId
);
```

---

# 12. Data Protection

Audit logs may contain sensitive information.

Security rules:

Audit logs are read-only.
Only administrators can access them.
Personal information must be minimized.
Passwords must never be stored.
Tokens must never be stored.

Forbidden:

password=123456
jwtToken=xxxxx

Allowed:

passwordChanged=true
tokenRevoked=true

---

# 13. Database Security

Audit table:

```
audit_logs
```

Requirements:

No UPDATE permission for normal users.
No DELETE permission for normal users.
Immutable records.
Indexed timestamps.

Recommended indexes:

(created_at)    

(user_id)

(entity_name, entity_id)

---

# 14. Audit Access

Authorized roles:

| Role | Access |
| --- | --- |
| Administrator | Full access |
| HR Manager | Internship-related logs |
| Finance Manager | Payment-related logs |
| Director | Read-only dashboards |
| Other users | No access |

---

# 15. Audit Monitoring

The system should provide:

Search by user.
Search by entity.
Search by date range.
Search by action type.
Export capability.

Example queries:

Show all modifications performed by user X.

Show all rejected applications.

Show all payment validations during July 2026.

---

# 16. Failure Handling

Audit failure must not silently remove traceability.

Rules:

Critical operations should fail if audit creation fails.
Non-critical logs may be processed asynchronously.
Audit failures must generate system alerts.

---

# 17. Audit Logs Security Checklist

- All critical actions logged.
- User identity recorded.
- Timestamp recorded.
- Entity changes tracked.
- Passwords excluded.
- Tokens excluded.
- Logs protected against modification.
- Access controlled by RBAC.
- Retention policy defined.

---

# 18. Future Improvements

Possible evolutions:

Centralized logging platform.
SIEM integration.
Real-time security alerts.
AI-based anomaly detection.
Advanced compliance reports.

---

# 19. Conclusion

The Audit Log module is a fundamental security component of the STEG Internship Management Platform.

It ensures that every sensitive operation is traceable, accountable, and recoverable while protecting the integrity of administrative workflows.