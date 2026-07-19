# Software Requirements Specification (SRS)

## STEG Smart Internship & Administrative Workflow Platform

**Project Type:** Intelligent Digital Internship Management Platform  
**Organization:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Version:** 1.0  
**Status:** Approved Specification Document


---

# 1. Introduction

## 1.1 Purpose

This Software Requirements Specification (SRS) defines the complete functional and technical requirements of the STEG Smart Internship & Administrative Workflow Platform.

The purpose of this document is to provide a common reference between:

- Business stakeholders.
- Project supervisors.
- Software architects.
- Backend developers.
- Frontend developers.
- Mobile developers.
- Test engineers.
- Future maintenance teams.
- AI development assistants.

This document describes what the platform must achieve, its expected behaviors, its actors, its modules, and its quality requirements.


---

# 2. System Overview

## 2.1 Product Description

The STEG Smart Internship & Administrative Workflow Platform is a complete digital ecosystem designed to modernize internship management processes inside STEG.

The platform replaces manual paper-based workflows with a centralized solution allowing:

- Online internship applications.
- Digital document management.
- Automated administrative workflows.
- Internship monitoring.
- Communication between interns and supervisors.
- Evaluation management.
- Financial management.
- Reporting and dashboards.


The platform consists of three client applications sharing a common backend:

             ┌─────────────────────┐
             │ Flutter Mobile App  │
             │ Internship Companion│
             └──────────┬──────────┘
                        │

┌────────────────┐ │ ┌─────────────────┐
│ Next.js │ │ │ Angular │
│ Front Office │──────────┼──────────│ Back Office │
└────────────────┘ │ └─────────────────┘
│

             ┌──────────▼──────────┐
             │ Spring Boot REST API│
             └──────────┬──────────┘

             ┌──────────▼──────────┐
             │ PostgreSQL Database │
             └─────────────────────┘


---

# 3. Scope

## 3.1 Included Scope

The system covers:

### Internship Application Management

- Online application submission.
- Candidate profile management.
- CV and document upload.
- Application tracking.
- Application validation workflow.


### Internship Lifecycle Management

- Internship creation.
- Assignment of supervisors.
- Department allocation.
- Internship status tracking.
- Internship completion.


### Administrative Workflow Management

- Configurable approval processes.
- Validation steps.
- Workflow history.
- Decision traceability.


### Internship Companion

Mobile application allowing interns to:

- Follow internship progress.
- Complete daily journals.
- Manage tasks.
- Submit deliverables.
- Receive notifications.


### Document Management

Management of:

- Internship conventions.
- Assignment letters.
- Certificates.
- Candidate documents.
- Generated administrative documents.


### Communication

The platform provides:

- In-app notifications.
- Email notifications.
- Push notifications (mobile).


### Financial Management

Management of:

- Internship payments.
- Payment validation.
- Payment tracking.


---

# 4. System Actors

The platform supports the following actors:


| Actor | Description |
|-|-|
| Candidate | Student applying for an internship |
| Intern | Accepted candidate performing internship |
| Supervisor | STEG employee supervising interns |
| HR Manager | Manages applications and administrative processes |
| Finance Manager | Handles internship payments |
| Director | Provides high-level validation |
| Administrator | Manages technical configuration |
| System | Executes automated operations |


---

# 5. Functional Requirements


## FR-01 Authentication and Authorization

The system shall:

- Authenticate users securely.
- Support JWT authentication.
- Support refresh tokens.
- Manage roles and permissions.
- Restrict access according to user privileges.


---

## FR-02 Candidate Management

The system shall allow:

- Creating candidate profiles.
- Updating personal information.
- Uploading application documents.
- Tracking application status.


---

## FR-03 Internship Management

The system shall allow:

- Creating internships.
- Assigning supervisors.
- Assigning departments.
- Managing internship lifecycle.


---

## FR-04 Workflow Management

The system shall provide:

- Configurable workflows.
- Approval steps.
- Validation steps.
- Workflow history.


---

## FR-05 Document Management

The system shall:

- Store documents securely.
- Manage document versions.
- Generate administrative documents.
- Verify file integrity.


---

## FR-06 Internship Monitoring

The system shall allow interns to:

- Write journal entries.
- Manage tasks.
- Submit deliverables.

Supervisors shall be able to:

- Validate work.
- Provide comments.
- Evaluate interns.


---

## FR-07 Notification System

The system shall notify users about:

- Application updates.
- Validation requests.
- Task deadlines.
- Document approvals.
- Important internship events.


---

## FR-08 Financial Management

The system shall support:

- Payment creation.
- Payment validation.
- Payment tracking.
- Payment history.


---

# 6. Non Functional Requirements


## Security

The system must provide:

- JWT authentication.
- Role Based Access Control.
- HTTPS communication.
- Password encryption.
- Audit logs.


## Performance

The system must:

- Handle multiple simultaneous users.
- Provide acceptable response times.
- Optimize database access.


## Reliability

The system must:

- Prevent data loss.
- Maintain transaction consistency.
- Provide backup mechanisms.


## Maintainability

The system must:

- Follow clean architecture principles.
- Use modular design.
- Provide documentation.
- Support future extensions.


## Scalability

The system should support:

- Increasing number of interns.
- Additional STEG departments.
- New workflow types.
- New client applications.


---

# 7. Technical Architecture


## Backend

Technology:

- Spring Boot 3
- Java
- REST API
- PostgreSQL


Responsibilities:

- Business logic.
- Security.
- Data persistence.
- Workflow processing.


---

## Front Office

Technology:

- Next.js


Responsibilities:

- Public internship portal.
- Candidate applications.
- Document submission.


---

## Back Office

Technology:

- Angular


Responsibilities:

- Internal STEG administration.
- HR management.
- Supervisor management.
- Financial operations.


---

## Mobile Application

Technology:

- Flutter


Responsibilities:

- Internship companion.
- Daily tracking.
- Notifications.
- Deliverables.


---

# 8. Data Management

The platform uses PostgreSQL as the main relational database.

The domain is organized into bounded contexts:

1. Identity & Access Management.
2. Organization Management.
3. Internship Management.
4. Workflow Engine.
5. Internship Companion.
6. Document Management.
7. Communication.
8. Financial Management.


---

# 9. Security Requirements


The system must implement:


## Authentication

- JWT access tokens.
- Refresh token rotation.
- Session management.


## Authorization

RBAC model:


User
|
Role
|
Permission



## Auditing

The system records:

- User actions.
- Entity modifications.
- Workflow decisions.


---

# 10. API Requirements


The backend exposes REST APIs:

Examples:


/api/auth
/api/users
/api/candidates
/api/internships
/api/workflows
/api/documents
/api/notifications
/api/payments



API requirements:

- JSON communication.
- OpenAPI documentation.
- Standard HTTP status codes.


---

# 11. Error Management

The system must provide:

- Centralized exception handling.
- Standard error responses.
- Validation messages.
- Logging.


Example response:

```json
{
 "timestamp":"2026-01-01T10:00:00",
 "status":400,
 "error":"VALIDATION_ERROR",
 "message":"Invalid document format"
}

```

---

# 12. Future Evolution

The architecture must allow:

Integration with STEG internal systems.
Additional workflow types.
Advanced analytics.
Artificial Intelligence assistance.
Automatic document generation.
Mobile application evolution.

---

# 13. Conclusion

This SRS defines the foundation of the STEG Smart Internship & Administrative Workflow Platform.

It ensures that all technical implementations remain aligned with business objectives, architectural decisions, and long-term maintainability requirements.