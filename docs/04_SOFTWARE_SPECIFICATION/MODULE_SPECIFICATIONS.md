# Module Specifications

## STEG Smart Internship & Administrative Workflow Platform

**Version:** 1.0  
**Project Type:** Engineering Internship Project  
**Organization:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Authors:** Karim Feki & Nesrine Derouiche  

---

# 1. Introduction

## 1.1 Purpose

This document defines the functional and technical specifications of each major module composing the STEG Smart Internship & Administrative Workflow Platform.

The objective is to provide a clear reference for:

- Developers implementing the platform.
- Architects maintaining the system.
- AI coding assistants understanding the project structure.
- Future engineers extending the platform.

Each module is described independently while respecting the global architecture and bounded contexts defined in the system design.

---

# 2. Global System Architecture

The platform follows a multi-client architecture based on a centralized backend.

                Users

                   |
    --------------------------------
    |              |               |

Next.js Angular Flutter
Front Office Back Office Mobile Companion

    --------------------------------

          Spring Boot REST API

                   |

              PostgreSQL

## Main Applications

| Application | Technology | Main Users |
|-|-|-|
| Front Office | Next.js | Candidates / Students |
| Back Office | Angular | STEG Employees |
| Mobile Companion | Flutter | Interns & Supervisors |

---

# 3. Module Organization

The platform is divided into the following functional modules:

| Module | Description |
|-|-|
| Identity & Access Management | Authentication and authorization |
| Organization Management | STEG structure and employees |
| Internship Management | Core internship lifecycle |
| Workflow Engine | Generic validation process management |
| Internship Companion | Daily internship monitoring |
| Document Management | Secure document handling |
| Communication Management | Notifications and messaging |
| Financial Management | Internship indemnities |

---

# 4. Identity & Access Management Module

## 4.1 Purpose

This module manages user authentication, authorization and security identity.

It represents the foundation layer of the entire platform.

---

## 4.2 Main Responsibilities

- User authentication.
- Password management.
- Session management.
- Role-based access control.
- Permission management.
- Security audit.

---

## 4.3 Main Entities

### User

Represents the authentication identity.

Attributes:

- id
- email
- passwordHash
- enabled
- status
- createdAt
- updatedAt

---

### Role

Defines a group of permissions.

Examples:

- ADMINISTRATOR
- HR_MANAGER
- FINANCE_MANAGER
- SUPERVISOR
- INTERN

---

### Permission

Defines an allowed system action.

Examples:


INTERN_CREATE
DOCUMENT_VALIDATE
PAYMENT_APPROVE
USER_MANAGE


---

### RefreshToken

Responsible for maintaining secure authentication sessions.

---

### Session

Stores active connection information:

- IP address.
- User agent.
- Login time.
- Expiration.

---

### AuditLog

Maintains complete traceability.

Records:

- Action performed.
- Entity affected.
- Previous value.
- New value.
- Timestamp.

---

# 5. Organization Management Module

## 5.1 Purpose

This module represents the internal STEG organizational structure.

---

## 5.2 Responsibilities

- Manage departments.
- Manage employees.
- Define organizational roles.
- Provide supervisors for internships.

---

## 5.3 Main Entities

## Department

Represents an organizational unit.

Attributes:

- id
- code
- name
- description

Examples:

- IT Department.
- Human Resources.
- Finance Department.

---

## Employee

Represents a STEG employee.

Attributes:

- firstName
- lastName
- phoneNumber
- employeeNumber
- hireDate

Employee inherits authentication identity.

---

## Employee Types

### Supervisor

Responsible for:

- Internship monitoring.
- Validation.
- Evaluation.

---

### HR Manager

Responsible for:

- Candidate management.
- Internship administration.

---

### Finance Manager

Responsible for:

- Payment validation.

---

### Director

Responsible for:

- Monitoring dashboards.
- Decision making.

---

### Administrator

Responsible for:

- Platform administration.

---

# 6. Internship Management Module

## 6.1 Purpose

Core business module managing the complete internship lifecycle.

---

## 6.2 Responsibilities

- Candidate management.
- Internship requests.
- Internship creation.
- Assignment management.
- Internship lifecycle tracking.

---

# 6.3 Main Entities

## Candidate

Represents a student applying for an internship.

Attributes:

- nationalId
- firstName
- lastName
- contactEmail
- phone
- university
- speciality
- diploma
- skills
- languages

A candidate may exist without a platform account.

---

## InternshipApplication

Represents an internship request.

Attributes:

- reference
- status
- submittedOnline
- submissionDate

Lifecycle:


DRAFT
|
SUBMITTED
|
UNDER_REVIEW
|
ACCEPTED / REJECTED


---

## Internship

Represents an approved internship.

Attributes:

- reference
- startDate
- endDate
- status

Lifecycle:


PLANNED
|
ACTIVE
|
COMPLETED
|
ARCHIVED


---

## InternshipAssignment

Represents assignment information.

Contains:

- Department.
- Supervisor.
- Assignment date.
- Status.

Supports reassignment history.

---

# 7. Workflow Engine Module

## 7.1 Purpose

Generic reusable engine managing validation workflows.

This module is independent from internship business logic.

---

## 7.2 Responsibilities

- Create workflows.
- Define workflow steps.
- Track approvals.
- Store validation history.

---

## 7.3 Main Entities

## Workflow

Represents a business process.

Examples:

- Internship validation.
- Payment approval.

---

## WorkflowStep

Represents one stage.

Example:


Step 1:
HR Review

Step 2:
Director Approval

Step 3:
Final Validation


---

## WorkflowAction

Represents an action performed by a user.

Stores:

- Action type.
- Decision.
- Comment.
- IP address.
- Timestamp.

---

# 8. Internship Companion Module

## 8.1 Purpose

Mobile module dedicated to internship execution monitoring.

---

# 8.2 Student Features

## Internship Journal

Allows interns to record activities.

Contains:

- Journal entries.
- Dates.
- Descriptions.
- Validation status.

---

## Task Management

Allows tracking:

- Assigned tasks.
- Progress.
- Deadlines.

Statuses:


TODO
IN_PROGRESS
COMPLETED
CANCELLED


---

## Deliverables

Allows uploading internship results.

Features:

- File upload.
- Version management.
- Validation tracking.

---

## Comments

Allows communication between:

- Intern.
- Supervisor.

---

# 8.3 Supervisor Features

Supervisors can:

- Review journals.
- Comment.
- Validate deliverables.
- Evaluate interns.

---

# 9. Evaluation Module

## Purpose

Manages internship evaluation.

---

## Main Entities

## Evaluation

Represents an evaluation event.

Types:

- Daily.
- Weekly.
- Mid-term.
- Final.

---

## EvaluationCriterion

Reusable evaluation criteria.

Examples:

- Technical skills.
- Communication.
- Autonomy.

---

## EvaluationScore

Stores the score obtained for each criterion.

---

# 10. Document Management Module

## Purpose

Centralized document lifecycle management.

---

## Responsibilities

- Upload documents.
- Store documents securely.
- Generate documents.
- Manage versions.

---

## Main Entity

## Document

Base abstract entity.

Attributes:

- reference
- type
- storageKey
- bucket
- objectId
- checksum
- version

---

## Document Types

Examples:

- Internship convention.
- Assignment letter.
- Internship certificate.
- CV.
- University documents.

---

# 11. Communication Module

## Purpose

Centralized notification system.

---

## Responsibilities

- Send notifications.
- Track recipients.
- Manage read status.

---

## Main Entities

## Notification

Contains:

- Title.
- Message.
- Type.
- Priority.
- Related entity.

---

## NotificationRecipient

Supports:

- User notification.
- Department notification.
- Role notification.
- Broadcast notification.

---

# 12. Financial Management Module

## Purpose

Manage internship indemnities.

---

## Responsibilities

- Create payments.
- Validate payments.
- Track payment status.

---

## Main Entity

## Payment

Attributes:

- reference
- amount
- currency
- payment method
- status
- payment date

---

## Payment Lifecycle


PENDING

|

VALIDATED

|

PAID

|

ARCHIVED


---

# 13. Module Communication Rules

## Identity Module

Provides:

- Authentication.
- User identity.
- Permissions.

Consumed by:

- All modules.

---

## Organization Module

Provides:

- Employees.
- Departments.
- Supervisors.

Consumed by:

- Internship Management.
- Finance.

---

## Internship Module

Acts as the central business hub.

Consumed by:

- Documents.
- Finance.
- Companion.
- Workflow.

---

## Workflow Module

Generic dependency.

No business dependency.

Used by:

- Internship.
- Finance.

---

# 14. Development Guidelines

## Separation of Responsibilities

Each module must:

- Own its business logic.
- Control its entities.
- Avoid direct database dependency with other modules.

---

## Communication Between Modules

Preferred communication:

- REST API.
- Domain services.
- Events (future evolution).

---

## Future Evolution

The modular structure allows adding:

- Leave management.
- Internal requests.
- Procurement workflows.
- Employee services.
- AI assistants.

---

# Conclusion

The STEG Smart Internship Platform is structured around independent but connected business modules.

This modular approach ensures:

- Maintainability.
- Scalability.
- Security.
- Clear domain ownership.
- Easier future development.

Each module represents a bounded responsibility while contributing to a unified digital ecosystem for internship and administrative workflow management.