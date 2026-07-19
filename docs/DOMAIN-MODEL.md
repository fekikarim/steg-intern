# STEG Smart Internship & Administrative Workflow Platform
## Enterprise Domain Model

**Project:** Smart Internship & Administrative Workflow Platform  
**Company:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Architecture:** Enterprise Domain Model  
**Version:** 1.0  
**Status:** Production Ready Business Model

---

# 1. Purpose

This document defines the complete business domain model of the STEG Smart Internship & Administrative Workflow Platform.

It serves as the unique reference for:

- UML Class Diagram
- PostgreSQL Database Design
- Spring Boot JPA Entities
- REST APIs
- Business Services
- Repository Layer
- DTOs
- Angular Back Office
- Next.js Front Office
- Flutter Mobile Application

This model represents only the business domain.

It intentionally excludes:

- UI Components
- Angular Components
- Flutter Widgets
- Next.js Pages
- Controllers
- Services
- Repositories
- DTOs
- Framework-specific classes

---

# 2. Domain Overview

The platform is composed of three client applications sharing one unified backend.

- Next.js Front Office
- Angular Enterprise Back Office
- Flutter Internship Companion

All three applications consume the same domain model.

The backend is the only owner of business logic.

---

# 3. Core Business Domains

The enterprise domain is divided into nine bounded contexts.

## Identity & Access Management

Responsible for:

- Users
- Roles
- Permissions
- Sessions
- Authentication
- Security

---

## Organization Management

Responsible for:

- Departments
- Organizational hierarchy
- Supervisors
- Administrative structure

---

## Internship Management

Responsible for:

- Candidates
- Internship applications
- Internship assignments
- Internship lifecycle

---

## Workflow Management

Responsible for:

- Generic workflow engine
- Validation
- Approval
- Workflow history

---

## Internship Companion

Responsible for:

- Internship journals
- Journal entries
- Tasks
- Deliverables
- Comments
- Evaluations

---

## Document Management

Responsible for:

- Official documents
- Certificates
- Assignment letters
- Internship conventions

---

## Notification Management

Responsible for:

- Notifications
- Communication
- Alerts

---

## Financial Management

Responsible for:

- Internship indemnities
- Payments

---

## Audit Management

Responsible for:

- Audit logs
- Activity history
- Security tracking

---

# 4. Core Business Entities

The platform contains the following production entities.

## Identity

- User
- Role
- Permission
- RefreshToken
- Session
- AuditLog

---

## Organization

- Department
- Supervisor

---

## Internship

- Candidate
- InternshipApplication
- Internship
- InternshipAssignment

---

## Workflow

- Workflow
- WorkflowStep
- Approval
- Validation

---

## Companion

- InternshipJournal
- JournalEntry
- Task
- Deliverable
- Comment
- Evaluation

---

## Documents

- Document
- InternshipConvention
- AssignmentLetter
- InternshipCertificate

---

## Communication

- Notification

---

## Financial

- Payment

---

# 5. Entity Responsibilities

## User

Represents every authenticated platform user.

Responsible for

- Authentication
- Authorization
- Identity
- Security

A user may become

- Administrator
- HR Manager
- Finance Manager
- Supervisor
- Director

---

## Role

Defines system access levels.

Examples

Administrator

HR

Supervisor

Finance

Director

Intern

Candidate

---

## Permission

Defines granular system authorizations.

Examples

CREATE_APPLICATION

APPROVE_WORKFLOW

GENERATE_CERTIFICATE

VIEW_REPORTS

UPLOAD_DOCUMENT

---

## RefreshToken

Maintains secure authentication sessions.

---

## Session

Tracks active authenticated sessions.

---

## AuditLog

Stores every critical system action.

Cannot be modified.

---

## Department

Represents STEG organizational structure.

Supports hierarchy.

General Directorate

↓

Directorate

↓

Division

↓

Service

Every department belongs to another department except the root.

---

## Supervisor

Specialized business entity.

Inherits User.

Responsible for

- Internship supervision
- Evaluation
- Validation
- Comments

---

## Candidate

Represents any person applying for an internship.

Can exist

- Through Front Office

or

- Manually created by HR

---

## InternshipApplication

Represents a submitted internship request.

May originate from

- Online application

or

- Manual registration

Lifecycle

Draft

↓

Submitted

↓

Reviewed

↓

Accepted

↓

Rejected

---

## Internship

Represents an approved internship.

Cannot exist without

- Candidate

May exist without

- InternshipApplication

(Manual HR creation)

---

## InternshipAssignment

Links

Internship

↓

Department

↓

Supervisor

Responsible for internship placement.

---

## Workflow

Generic workflow engine.

Reusable.

Not internship-specific.

Future administrative modules reuse the same workflow.

---

## WorkflowStep

Represents each workflow stage.

Examples

Submitted

Reviewed

Validated

Approved

Completed

Archived

---

## Approval

Represents user approval.

Stores

Responsible User

Date

Comment

Decision

---

## Validation

Represents business validation.

Can be

Accepted

Rejected

Returned

---

## InternshipJournal

Container of internship history.

One journal

↓

Many entries

---

## JournalEntry

Represents one internship activity.

Contains

Description

Date

Attachments

Status

---

## Task

Represents internship tasks.

Independent from deliverables.

Can be

Pending

Completed

Cancelled

---

## Deliverable

Represents internship outputs.

Linked directly to Internship.

Not linked to Task.

Examples

Source code

Presentation

Report

Documentation

Prototype

---

## Comment

Supervisor feedback.

Can target

Journal Entry

Deliverable

Evaluation

---

## Evaluation

Represents internship assessments.

Supports

Multiple evaluations.

Each evaluation contains

Type

Criteria

Score

Feedback

Evaluator

---

## Document

Abstract business entity.

Cannot be instantiated.

Parent of

InternshipConvention

AssignmentLetter

InternshipCertificate

---

## InternshipConvention

Official internship agreement.

---

## AssignmentLetter

Official internship assignment.

---

## InternshipCertificate

Generated after internship completion.

---

## Notification

Represents platform communication.

Can be

Email

Push Notification

In-App Notification

---

## Payment

Represents internship indemnity.

Lifecycle

Pending

Validated

Paid

Archived

---

# 6. Inheritance Model

User

├── Administrator

├── HRManager

├── Supervisor

├── FinanceManager

└── Director

---

Document

├── InternshipConvention

├── AssignmentLetter

└── InternshipCertificate

---

# 7. Relationship Rules

Role

1

↓

*

Users

---

Department

1

↓

*

Supervisors

---

Department

1

↓

*

Internships

---

Candidate

1

↓

*

InternshipApplications

---

Candidate

1

↓

*

Internships

---

Internship

1

↓

1

InternshipAssignment

---

Supervisor

1

↓

*

InternshipAssignments

---

Internship

1

↓

1

InternshipJournal

---

InternshipJournal

1

↓

*

JournalEntries

---

Internship

1

↓

*

Tasks

---

Internship

1

↓

*

Deliverables

---

Deliverable

1

↓

*

Comments

---

JournalEntry

1

↓

*

Comments

---

Internship

1

↓

*

Evaluations

---

Internship

1

↓

*

Documents

---

Internship

1

↓

*

Notifications

---

Internship

1

↓

*

Payments

---

Workflow

1

↓

*

WorkflowSteps

---

WorkflowStep

1

↓

*

Approvals

---

WorkflowStep

1

↓

*

Validations

---

User

1

↓

*

AuditLogs

---

# 8. Cardinality Constraints

Every Internship belongs to exactly one Candidate.

Every Internship belongs to exactly one Department.

Every Internship has exactly one Supervisor assignment.

Every Internship owns exactly one InternshipJournal.

Every InternshipJournal contains one or more JournalEntries.

Every Candidate may submit multiple InternshipApplications.

Every Internship may own multiple Deliverables.

Every Internship may own multiple Tasks.

Every Internship may own multiple Evaluations.

Every Internship may own multiple Documents.

Every User owns one Role.

Every Role contains multiple Permissions.

---

# 9. Business Rules

A candidate may apply online or be manually registered.

An internship may exist without an application.

A supervisor must be assigned before internship start.

One internship has only one active supervisor assignment.

A journal entry cannot be modified after validation.

Deliverables belong to internships.

Tasks are independent from deliverables.

Comments never exist independently.

Certificates are generated only after internship completion.

Payments require workflow validation.

Every workflow action generates an audit log.

Every notification belongs to one business event.

Every approval belongs to the generic workflow engine.

Evaluations support multiple assessment sessions.

Departments support hierarchical organization.

Documents inherit from the abstract Document entity.

Business logic belongs exclusively to the backend.

---

# 10. Aggregate Roots

The following entities are aggregate roots.

- User
- Department
- Candidate
- Internship
- Workflow
- Document
- Notification
- Payment

All other entities are managed through these aggregates.

---

# 11. Enumerations

## UserStatus

ACTIVE

INACTIVE

LOCKED

---

## ApplicationStatus

DRAFT

SUBMITTED

UNDER_REVIEW

ACCEPTED

REJECTED

---

## InternshipStatus

PLANNED

ACTIVE

COMPLETED

CANCELLED

ARCHIVED

---

## TaskStatus

TODO

IN_PROGRESS

COMPLETED

CANCELLED

---

## DeliverableStatus

DRAFT

SUBMITTED

VALIDATED

REJECTED

---

## JournalStatus

DRAFT

SUBMITTED

VALIDATED

REJECTED

---

## WorkflowStatus

CREATED

RUNNING

COMPLETED

ARCHIVED

---

## ApprovalDecision

PENDING

APPROVED

REJECTED

RETURNED

---

## PaymentStatus

PENDING

VALIDATED

PAID

ARCHIVED

---

## NotificationType

EMAIL

PUSH

IN_APP

---

## DocumentType

INTERNSHIP_CONVENTION

ASSIGNMENT_LETTER

INTERNSHIP_CERTIFICATE

---

## EvaluationType

DAILY

WEEKLY

MID_TERM

FINAL

CUSTOM

---

# 12. Domain Principles

The domain model follows:

- Domain-Driven Design (DDD)
- SOLID Principles
- Clean Architecture
- Single Source of Truth
- Separation of Concerns
- High Cohesion
- Low Coupling
- Generic Workflow Engine
- Modular Architecture
- Enterprise Scalability

All business rules are centralized within the Spring Boot backend.

The Angular Back Office, Next.js Front Office, and Flutter Mobile Application interact exclusively through secured REST APIs, ensuring consistency, maintainability, and long-term extensibility of the STEG Smart Internship & Administrative Workflow Platform.