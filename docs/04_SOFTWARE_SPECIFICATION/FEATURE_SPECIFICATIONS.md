# Feature Specifications
## STEG Smart Internship & Administrative Workflow Platform

**Project:** Conception et Développement d'une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG  
**Version:** 1.0  
**Status:** Approved Specification  
**Authors:** Karim Feki & Nesrine Derouiche  
**Company:** Société Tunisienne de l'Électricité et du Gaz (STEG)

---

# 1. Introduction

## 1.1 Purpose

This document defines the detailed functional specifications of the features implemented within the STEG Smart Internship & Administrative Workflow Platform.

It provides a precise description of:

- Available features.
- Business behavior.
- User interactions.
- Functional boundaries.
- Dependencies between features.
- Expected system behavior.

This document serves as a reference for:

- Software developers.
- AI coding assistants.
- Software architects.
- Test engineers.
- Future maintenance teams.

---

# 2. Feature Organization

The platform features are organized according to the three main client applications:

                STEG Platform

    ┌────────────────────────────┐
    │       Next.js Front Office │
    │        Candidate Portal    │
    └──────────────┬─────────────┘
                   │
    ┌──────────────┴─────────────┐
    │      Spring Boot API       │
    │     Business Services      │
    └──────────────┬─────────────┘
                   │
 ┌─────────────────┼─────────────────┐
 │                 │                 │

Angular Back Flutter Mobile PostgreSQL
Office Companion Database


---

# 3. Front Office Features (Next.js)

## 3.1 Public Information Portal

### Description

Provides public access to internship information before authentication.

### Users

- Visitor.
- Candidate.

### Features

- View internship opportunities.
- View internship requirements.
- View required documents.
- Access platform information.

### Business Rules

- Public pages require no authentication.
- Sensitive information must never be exposed.

---

# 3.2 Candidate Account Management

## Description

Allows students to create and manage their candidate account.

## Actors

- Candidate.

## Features

### Account Creation

Candidate can:

- Register.
- Provide personal information.
- Verify account information.
- Activate access.

### Authentication

Supported mechanisms:

- Email authentication.
- Password authentication.
- JWT based session management.

### Data Managed

Candidate information:

- Full name.
- National ID.
- University.
- Speciality.
- Diploma.
- Contact information.

---

# 3.3 Internship Application Management

## Description

Allows candidates to submit internship requests digitally.

## Actors

- Candidate.
- HR Manager.

## Features

### Create Application

Candidate can:

- Fill application form.
- Select internship information.
- Upload required documents.
- Submit request.

### Application Tracking

Candidate can view:

- Current status.
- Processing history.
- Notifications.
- Required actions.

### Application Lifecycle


DRAFT
|
SUBMITTED
|
UNDER_REVIEW
|
┌───────────┐
| |
ACCEPTED REJECTED


---

# 3.4 Document Submission

## Description

Allows candidates to upload required internship documents.

## Supported Documents

Examples:

- CV.
- Motivation letter.
- University convention.
- Transcript.
- National identity document.

## Features

- Upload documents.
- Validate file format.
- Track document status.
- Replace documents when requested.

## Technical Requirements

Documents are stored using:

- Object storage.
- Unique storage identifiers.
- Integrity checksum.

---

# 3.5 Candidate Notifications

## Description

Provides candidates with important updates.

## Notification Examples

- Application received.
- Application accepted.
- Missing documents.
- Internship assigned.
- Documents available.

---

# 4. Back Office Features (Angular)

# 4.1 Authentication and Authorization

## Description

Secure access for STEG employees.

## Actors

- Administrator.
- HR Manager.
- Finance Manager.
- Supervisor.
- Director.

## Features

- Login.
- Role management.
- Permission management.
- Session management.
- Audit tracking.

---

# 4.2 User and Role Management

## Description

Administration of platform users.

## Features

Administrator can:

- Create users.
- Disable users.
- Assign roles.
- Manage permissions.

## Roles


Administrator
|
┌────┼─────┐
HR Finance Director
|
Supervisor


---

# 4.3 Candidate Management

## Description

Centralized management of internship candidates.

## Features

HR can:

- Search candidates.
- View profiles.
- Create candidates manually.
- Link accounts.
- Manage candidate information.

## Business Rule

Candidates may exist without an online account.

---

# 4.4 Internship Management

## Description

Complete lifecycle management of internships.

## Features

HR can:

- Create internships.
- Assign departments.
- Assign supervisors.
- Track internship status.

## Lifecycle


PLANNED
|
ACTIVE
|
COMPLETED
|
ARCHIVED


---

# 4.5 Internship Assignment

## Description

Allows assigning interns to organizational structures.

## Managed Data

- Department.
- Supervisor.
- Assignment date.
- Assignment status.

## Business Rules

- One internship can have multiple assignments historically.
- Only one assignment can be active.

---

# 4.6 Workflow Management

## Description

Generic approval and validation engine.

## Purpose

Replace manual approval processes.

## Supported Workflows

Examples:

- Internship application approval.
- Document validation.
- Internship validation.
- Payment validation.

## Workflow Lifecycle


CREATED

RUNNING

COMPLETED

ARCHIVED


---

# 4.7 Document Management

## Description

Central document repository.

## Features

- Upload documents.
- Generate documents automatically.
- Version management.
- Document validation.
- Document history.

## Generated Documents

Examples:

- Internship convention.
- Assignment letter.
- Internship certificate.

---

# 4.8 Internship Monitoring

## Description

Allows supervisors and HR to follow internship progress.

## Features

- View internship timeline.
- View journals.
- View tasks.
- View deliverables.
- View evaluations.

---

# 4.9 Financial Management

## Description

Management of internship indemnities.

## Actors

- Finance Manager.

## Features

- Generate payments.
- Validate payments.
- Track payment status.

## Payment Lifecycle


PENDING

VALIDATED

PAID

ARCHIVED


---

# 4.10 Dashboard and Reporting

## Description

Provides decision support indicators.

## Metrics

Examples:

- Number of interns.
- Active internships.
- Applications statistics.
- Department distribution.
- Payment statistics.

---

# 4.11 Audit Management

## Description

Tracks sensitive system operations.

## Recorded Information

- User.
- Action.
- Entity modified.
- Old value.
- New value.
- Timestamp.

---

# 5. Mobile Application Features (Flutter)

# 5.1 Mobile Authentication

## Description

Secure access for interns and supervisors.

## Features

- Login.
- Token management.
- Session security.

---

# 5.2 Internship Timeline

## Description

Provides internship overview.

## Information Displayed

- Start date.
- End date.
- Assigned supervisor.
- Department.
- Progress.

---

# 5.3 Internship Journal

## Description

Allows interns to document daily activities.

## Features

Intern can:

- Create journal entries.
- Update drafts.
- Submit entries.

Supervisor can:

- Validate.
- Reject.
- Comment.

## Lifecycle


DRAFT

SUBMITTED

VALIDATED / REJECTED


---

# 5.4 Task Management

## Description

Personal internship task tracking.

## Features

Intern can:

- View tasks.
- Update progress.
- Complete tasks.

Statuses:


TODO

IN_PROGRESS

COMPLETED

CANCELLED


---

# 5.5 Deliverable Management

## Description

Management of internship deliverables.

## Features

Intern:

- Upload deliverables.
- Track validation.

Supervisor:

- Review.
- Validate.
- Reject.
- Comment.

---

# 5.6 Evaluation Management

## Description

Digital evaluation process.

## Actors

- Supervisor.

## Features

- Create evaluations.
- Evaluate criteria.
- Add feedback.
- Submit final evaluation.

---

# 5.7 Mobile Notifications

## Description

Real-time communication channel.

## Notification Types

- Push notification.
- In-app notification.
- Email notification.

## Examples

- Task assigned.
- Journal validated.
- Deliverable rejected.
- Important reminder.

---

# 6. Cross Platform Features

# 6.1 Authentication

All applications use:

- JWT Access Token.
- Refresh Token.
- Role Based Access Control.

---

# 6.2 Security

Common security features:

- HTTPS communication.
- Password hashing.
- Authorization checks.
- Audit logs.
- Input validation.

---

# 6.3 File Management

All uploaded files must support:

- Secure storage.
- Metadata tracking.
- Integrity verification.
- Version management.

---

# 6.4 Workflow Integration

Business processes requiring approval must use the centralized workflow engine.

Examples:

- Applications.
- Documents.
- Payments.
- Evaluations.

---

# 7. Future Features

The architecture allows future integration of:

## Electronic Signature

Digital approval of administrative documents.

---

## OCR Document Processing

Automatic extraction of information from documents.

---

## Artificial Intelligence Assistant

Possible capabilities:

- Candidate assistance.
- Document classification.
- Workflow recommendation.
- Administrative automation.

---

## Offline Mobile Mode

Allow mobile operation with limited connectivity.

---

## Additional Administrative Modules

Future processes:

- Leave requests.
- Internal requests.
- Equipment requests.
- Administrative workflows.

---

# 8. Feature Design Principles

All implemented features must respect:

## Modularity

Each feature belongs to a clear business domain.

## Security First

No feature bypasses authorization rules.

## Scalability

Features must support future growth.

## Maintainability

Code must follow clean architecture principles.

## Traceability

Critical actions must be recorded.

---

# End of Document