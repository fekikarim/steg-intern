# Actors Specification

## STEG Smart Internship & Administrative Workflow Platform

**Document Type:** Requirements Specification  
**Version:** 1.0  
**Status:** Approved  
**Project:** Conception et Développement d’une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG

---

# 1. Introduction

## 1.1 Purpose

This document defines all actors interacting with the STEG Smart Internship & Administrative Workflow Platform.

An actor represents an external entity (human user, organization role, or external system) that interacts with one or more platform functionalities.

The objective of this document is to:

- Clearly identify all system users.
- Define their responsibilities and permissions.
- Establish the relationship between actors and system modules.
- Serve as a reference for:
  - Use Case modeling.
  - Security design.
  - Role-Based Access Control (RBAC).
  - Frontend application design.
  - Backend authorization implementation.

---

# 2. Actor Classification

The platform actors are divided into three main categories:

                STEG Platform Actors

                        |
    -------------------------------------------
    |                    |                    |

External Users Internal Users System Actors

    |                    |                    |

Candidates STEG Employees Notification System
Interns Supervisors Storage System
HR Managers Authentication System
Finance Managers
Directors
Administrators


---

# 3. External Actors

External actors are users who are not part of the internal STEG organization but interact with the platform.

---

# 3.1 Candidate / Student

## Description

A candidate is a student who wants to apply for an internship opportunity at STEG.

The candidate interacts mainly with the public Front Office portal.

---

## Responsibilities

The candidate can:

- Create an internship application.
- Fill personal information.
- Upload required documents.
- Submit internship requests.
- Track application status.
- Receive notifications.
- Accept internship assignment.

---

## Main Interactions

| Module | Actions |
|---|---|
| Front Office | Submit application |
| Document Management | Upload documents |
| Communication | Receive notifications |
| Internship Management | Consult application status |

---

## Main Use Cases

- Apply for internship.
- Upload CV.
- Upload university documents.
- Follow application progress.
- Receive acceptance/rejection notifications.

---

## Permissions


CREATE_APPLICATION
UPLOAD_DOCUMENT
VIEW_APPLICATION_STATUS
VIEW_NOTIFICATIONS


---

## Authentication

Optional.

A candidate may exist in the system without having an account.

Example:

- Manual creation by HR.
- Imported candidate records.

Relationship:


Candidate 0..1 ---- 1 User


---

# 3.2 Intern

## Description

An intern is a candidate whose internship application has been accepted.

The intern uses the Internship Companion mobile application during the internship period.

---

## Responsibilities

The intern can:

- Consult internship timeline.
- Complete daily journal.
- Manage assigned tasks.
- Submit deliverables.
- Upload internship documents.
- Receive supervisor feedback.
- Consult evaluations.

---

## Main Interactions

| Module | Actions |
|-|-|
| Mobile Application | Daily internship follow-up |
| Internship Management | Access internship information |
| Document Management | Submit files |
| Communication | Receive notifications |

---

## Main Use Cases

- Write journal entries.
- Submit deliverables.
- Complete assigned tasks.
- Consult evaluation results.

---

## Permissions


VIEW_INTERNSHIP
CREATE_JOURNAL_ENTRY
UPLOAD_DELIVERABLE
VIEW_TASKS
VIEW_EVALUATIONS


---

## Authentication

Required.

Relationship:


Intern
|
User Account


---

# 4. Internal STEG Actors

Internal actors are STEG employees responsible for managing internship processes.

All internal actors inherit from:


User
|
Employee
|
Specific Role


---

# 4.1 Supervisor / Encadrant

## Description

A supervisor is a STEG employee responsible for supervising one or more interns.

---

## Responsibilities

The supervisor can:

- Follow assigned interns.
- Validate internship activities.
- Review journals.
- Validate deliverables.
- Add comments.
- Perform evaluations.

---

## Main Interactions

| Module | Actions |
|-|-|
| Internship Management | Supervise internships |
| Internship Companion | Validate activities |
| Communication | Send feedback |

---

## Main Use Cases

- Review journal entries.
- Validate deliverables.
- Evaluate interns.
- Add comments.

---

## Permissions


VIEW_ASSIGNED_INTERNS
VALIDATE_DELIVERABLE
EVALUATE_INTERN
WRITE_COMMENT


---

# 4.2 HR Manager

## Description

The HR Manager manages internship requests and administrative workflows.

---

## Responsibilities

The HR Manager can:

- Review applications.
- Accept or reject candidates.
- Assign supervisors.
- Generate administrative documents.
- Monitor internship lifecycle.

---

## Main Interactions

| Module | Actions |
|-|-|
| Internship Management | Manage internships |
| Workflow Engine | Approve requests |
| Document Management | Generate documents |
| Communication | Notify candidates |

---

## Main Use Cases

- Review applications.
- Start approval workflows.
- Create internship records.
- Generate conventions.

---

## Permissions


VIEW_ALL_APPLICATIONS
APPROVE_APPLICATION
CREATE_INTERNSHIP
ASSIGN_SUPERVISOR
GENERATE_DOCUMENT


---

# 4.3 Finance Manager

## Description

The Finance Manager manages internship indemnities and payments.

---

## Responsibilities

The Finance Manager can:

- Verify payment requests.
- Approve internship payments.
- Track payment history.

---

## Main Interactions

| Module | Actions |
|-|-|
| Financial Management | Manage payments |
| Workflow Engine | Validate payment workflow |

---

## Main Use Cases

- Review payment requests.
- Approve payments.
- Consult payment history.

---

## Permissions


VIEW_PAYMENTS
VALIDATE_PAYMENT
APPROVE_PAYMENT


---

# 4.4 Director

## Description

The Director represents the managerial authority responsible for high-level validation and supervision.

---

## Responsibilities

The Director can:

- Validate strategic decisions.
- Approve specific workflows.
- Consult dashboards and reports.

---

## Main Interactions

| Module | Actions |
|-|-|
| Workflow Engine | Final approval |
| Reporting | Monitoring |

---

## Main Use Cases

- Approve critical workflows.
- Consult statistics.
- Monitor internship activities.

---

## Permissions


FINAL_APPROVAL
VIEW_DASHBOARDS
VIEW_REPORTS


---

# 4.5 Administrator

## Description

The Administrator manages the technical configuration of the platform.

---

## Responsibilities

The Administrator can:

- Manage users.
- Manage roles and permissions.
- Configure system parameters.
- Monitor security logs.

---

## Main Interactions

| Module | Actions |
|-|-|
| Identity Management | User administration |
| Security | Audit monitoring |

---

## Main Use Cases

- Create user accounts.
- Assign roles.
- Manage permissions.
- Review audit logs.

---

## Permissions


MANAGE_USERS
MANAGE_ROLES
MANAGE_PERMISSIONS
VIEW_AUDIT_LOGS
SYSTEM_CONFIGURATION


---

# 5. System Actors

System actors are non-human components interacting with the platform.

---

# 5.1 Authentication System

## Description

Responsible for user authentication and authorization.

---

## Responsibilities

- Authenticate users.
- Generate JWT tokens.
- Manage refresh tokens.
- Validate permissions.

---

## Interactions


User
|
Authentication System
|
Security Layer


---

# 5.2 Notification Service

## Description

Responsible for sending notifications.

---

## Responsibilities

- Send emails.
- Send push notifications.
- Manage notification delivery.

---

## Interactions


Business Event
|
Notification Service
|
User


---

# 5.3 Object Storage System

## Description

External storage service used for documents and files.

Examples:

- MinIO
- Azure Blob Storage
- Amazon S3

---

## Responsibilities

- Store uploaded documents.
- Retrieve files.
- Manage file versions.
- Ensure integrity.

---

# 6. Actor Permission Matrix

| Actor | Application | Internship | Documents | Workflow | Payments | Evaluation |
|-|-|-|-|-|-|-|
| Candidate | Create | View | Upload | No | No | No |
| Intern | View | Manage own | Upload | No | No | View |
| Supervisor | View assigned | Supervise | Validate | Validate | No | Create |
| HR Manager | Manage | Create | Generate | Approve | No | View |
| Finance Manager | No | View | No | Approve | Manage | No |
| Director | View | View | View | Final approval | View | View |
| Administrator | Full access | Full access | Full access | Full access | Full access | Full access |

---

# 7. Actor Security Model

The platform uses Role-Based Access Control (RBAC).

Each actor receives:


User
|
Role
|
Permissions
|
Authorized Actions


Example:


Supervisor

Role:
SUPERVISOR

Permissions:

VALIDATE_DELIVERABLE
EVALUATE_INTERN
WRITE_COMMENT

---

# 8. Actor Relationships Summary

                User
                 |
    -----------------------------
    |                           |
 Employee                  Candidate
    |

| | | | |
Supervisor HR Finance Director Administrator

Candidate
|
accepted
|
Intern


---

# 9. Design Principles

The actor model follows these principles:

## Separation of Responsibilities

Each actor has only the permissions required for their mission.

---

## Least Privilege Security

Users cannot access functionalities unrelated to their responsibilities.

---

## Domain Separation

Authentication identity (`User`) is separated from business identity:

- Candidate information belongs to Internship Management.
- Employee information belongs to Organization Management.

---

## Scalability

New actors can be introduced without modifying existing business logic by extending:

- Roles.
- Permissions.
- Workflow rules.

---

# 10. Conclusion

The actor model defines the human and technical interactions with the STEG Smart Internship Platform.

It provides the foundation for:

- Use Case diagrams.
- RBAC security implementation.
- API authorization.
- Frontend route protection.
- Backend access control.

This document represents the official actor reference for the entire system lifecycle.