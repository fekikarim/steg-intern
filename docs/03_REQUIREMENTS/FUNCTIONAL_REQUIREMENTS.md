# Functional Requirements

## STEG Smart Internship & Administrative Workflow Platform

**Project:** Digital Platform for Internship Management and Administrative Workflow Automation  
**Version:** 1.0  
**Document Type:** Functional Requirements Specification  
**Related Documents:**
- Project Charter
- Product Vision
- Business Analysis
- Domain Master Class Diagram
- Bounded Context Architecture


---

# 1. Introduction

## 1.1 Purpose

This document defines the functional requirements of the STEG Smart Internship & Administrative Workflow Platform.

It describes the expected behaviors, services, and capabilities that the platform must provide to satisfy business needs identified during the analysis phase.

These requirements represent the functional contract between:

- Business stakeholders
- Product owners
- Software architects
- Developers
- Test engineers


The platform aims to replace traditional paper-based internship management processes with a centralized digital ecosystem composed of:

- Public web portal
- Internal administration portal
- Mobile internship companion application
- Secure backend services


---

# 2. Functional Scope Overview

The platform shall provide the following main functional domains:

| Domain | Description |
|---|---|
| Identity & Access Management | Authentication, authorization, roles and permissions |
| Organization Management | Management of STEG employees, departments and supervisors |
| Internship Management | Complete internship lifecycle management |
| Workflow Engine | Configurable approval and validation workflows |
| Internship Companion | Daily internship tracking and interaction |
| Document Management | Digital document storage and generation |
| Communication | Notifications and communication management |
| Financial Management | Internship indemnity/payment management |


---

# 3. Identity & Access Management Requirements

## FR-IAM-001 Authentication

The system shall allow users to securely authenticate using their credentials.

Supported users:

- Candidates
- Interns
- Supervisors
- HR Managers
- Finance Managers
- Directors
- Administrators


The authentication mechanism shall support:

- Email/password login
- JWT access tokens
- Refresh token mechanism
- Session management


Related domain entities:

- User
- RefreshToken
- Session


---

## FR-IAM-002 User Account Management

The system shall allow administrators to:

- Create user accounts
- Enable/disable accounts
- Manage user status
- Reset credentials


User lifecycle states:

- ACTIVE
- INACTIVE
- LOCKED


Related entity:

- User


---

## FR-IAM-003 Role Based Access Control

The system shall implement RBAC authorization.

Each user shall have:

- One or multiple roles
- Associated permissions


Examples:

| Role | Main permissions |
|-|-|
| Administrator | Full system access |
| HR Manager | Internship applications and documents |
| Supervisor | Internship monitoring and evaluation |
| Finance Manager | Payment management |
| Director | Approval and supervision |
| Candidate | Application and internship tracking |


Related entities:

- Role
- Permission


---

## FR-IAM-004 Audit Tracking

The system shall record important user actions.

Tracked information:

- Action performed
- Target entity
- Previous value
- New value
- Timestamp
- User responsible


Related entity:

- AuditLog


---

# 4. Organization Management Requirements

## FR-ORG-001 Department Management

The system shall allow administrators to manage STEG organizational departments.

Capabilities:

- Create departments
- Update department information
- Assign employees


Related entity:

- Department


---

## FR-ORG-002 Employee Management

The system shall manage STEG employees.

Employee information:

- Identity information
- Employee number
- Phone number
- Hiring date
- Position


Supported employee types:

- Supervisor
- HR Manager
- Finance Manager
- Director
- Administrator


Related entities:

- Employee
- Supervisor
- HRManager
- FinanceManager
- Director
- Administrator


---

## FR-ORG-003 Internship Assignment Management

The system shall allow authorized employees to assign interns.

Assignment information:

- Internship
- Department
- Supervisor
- Assignment date
- Assignment status


Related entity:

- InternshipAssignment


---

# 5. Internship Management Requirements

## FR-INT-001 Candidate Registration

The system shall allow students to create internship requests.

Candidate information:

- Personal information
- University information
- Academic speciality
- Skills
- Languages
- CV


Related entity:

- Candidate


---

## FR-INT-002 Internship Application Submission

The system shall allow candidates to submit internship applications online.

Application lifecycle:


DRAFT
|
SUBMITTED
|
UNDER_REVIEW
|
ACCEPTED / REJECTED



Application data:

- Reference number
- Submission date
- Status
- Attached documents


Related entities:

- InternshipApplication
- ApplicationDocument


---

## FR-INT-003 Internship Lifecycle Management

The system shall manage internship lifecycle from acceptance until completion.

Internship states:

- PLANNED
- ACTIVE
- COMPLETED
- CANCELLED
- ARCHIVED


The system shall store:

- Internship period
- Candidate
- Supervisor
- Department
- Related documents
- Payments
- Evaluations


Related entity:

- Internship


---

## FR-INT-004 Internship Assignment History

The system shall maintain internship assignment history.

The platform must support:

- Initial assignment
- Supervisor changes
- Department reassignment


Related entity:

- InternshipAssignment


---

# 6. Workflow Engine Requirements

## FR-WF-001 Generic Workflow Management

The system shall provide a reusable workflow engine.

The workflow engine must not depend on internship-specific logic.


Supported workflow targets:

- Internship applications
- Internships
- Payments


Related entities:

- Workflow
- WorkflowStep
- WorkflowAction


---

## FR-WF-002 Approval and Validation Process

The system shall support:

- Approval actions
- Validation actions
- Rejection
- Return for correction


Each action shall record:

- User
- Decision
- Comment
- IP address
- Timestamp


Related entity:

- WorkflowAction


---

# 7. Internship Companion Requirements

## FR-COMP-001 Internship Journal

The mobile application shall allow interns to maintain a digital journal.

Capabilities:

- Create daily entries
- Submit journal
- Supervisor validation


Related entities:

- InternshipJournal
- JournalEntry


---

## FR-COMP-002 Task Management

The system shall allow internship tasks management.

Capabilities:

- Create tasks
- Assign tasks
- Update progress
- Complete tasks


Related entity:

- Task


---

## FR-COMP-003 Deliverable Management

The system shall allow interns to submit deliverables.

Supported features:

- Upload files
- Version management
- Validation
- Integrity checking


Related entity:

- Deliverable


---

## FR-COMP-004 Internship Evaluation

The system shall allow supervisors to evaluate interns.

Evaluation features:

- Multiple evaluation periods
- Criteria-based scoring
- Feedback


Related entities:

- Evaluation
- EvaluationCriterion
- EvaluationScore


---

# 8. Document Management Requirements

## FR-DOC-001 Digital Document Storage

The system shall manage internship documents digitally.

Supported documents:

- Internship convention
- Assignment letter
- Internship certificate
- CV
- Motivation letter
- University documents


Related entity:

- Document


---

## FR-DOC-002 Automatic Document Generation

The system shall generate official documents automatically.

Examples:

- Internship convention
- Assignment letter
- Certificate


The generated documents must contain:

- Official information
- References
- Dates
- Signatures workflow


---

# 9. Communication Requirements

## FR-COM-001 Notification Management

The system shall send notifications to users.

Supported channels:

- Email
- Push notification
- In-app notification


Notification targets:

- User
- Department
- Role
- Broadcast


Related entities:

- Notification
- NotificationRecipient


---

# 10. Financial Management Requirements

## FR-FIN-001 Internship Payment Management

The system shall manage internship indemnities.

Payment information:

- Amount
- Currency
- Payment method
- Status
- Approval date


Related entity:

- Payment


---

## FR-FIN-002 Payment Workflow Integration

Payments shall support workflow validation.

Example:


Created
|
Pending Approval
|
Validated
|
Paid



Related entities:

- Payment
- Workflow


---

# 11. Reporting and Monitoring Requirements

## FR-REP-001 Dashboard Management

The system shall provide dashboards for authorized users.

Examples:

HR dashboard:

- Number of applications
- Active internships
- Pending validations


Supervisor dashboard:

- Assigned interns
- Tasks
- Evaluations


Finance dashboard:

- Pending payments
- Payment history


---

# 12. Mobile Application Requirements

The mobile application shall provide:

- Internship timeline
- Notifications
- Journal
- Tasks
- Deliverables
- Evaluation feedback
- Offline capability for temporary connectivity loss


---

# 13. Traceability With Domain Model

| Requirement Domain | Main Domain Entities |
|-|-|
| Authentication | User, Role, Permission |
| Organization | Employee, Department |
| Internship | Candidate, Internship, InternshipApplication |
| Workflow | Workflow, WorkflowStep, WorkflowAction |
| Companion | Journal, Task, Deliverable, Evaluation |
| Documents | Document |
| Communication | Notification |
| Finance | Payment |


---

# 14. Summary

The functional requirements define the complete behavior expected from the STEG Smart Internship Platform.

They establish the foundation for:

- Software architecture
- API design
- Database modeling
- Frontend implementation
- Mobile development
- Testing strategy

All future implementation decisions must remain consistent with these requirements.