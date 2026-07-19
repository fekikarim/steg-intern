# Business Rules Specification

## STEG Smart Internship & Administrative Workflow Platform

**Document Type:** Business Analysis  
**Version:** 1.0  
**Project:** Conception et Développement d'une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG  
**Authors:** Karim Feki & Nesrine Derouiche  
**Organization:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Date:** 2026  

---

# 1. Introduction

## 1.1 Purpose

This document defines the business rules governing the operation of the STEG Smart Internship & Administrative Workflow Platform.

Business rules represent the constraints, validations, and operational principles that must be respected by the system regardless of the technical implementation.

They define:

- What actions are allowed
- Who can perform each action
- Under which conditions operations can occur
- How data consistency must be maintained
- How business processes must behave

---

# 2. Business Rule Categories

The platform business rules are organized into the following categories:

1. Candidate Management Rules
2. Internship Application Rules
3. Internship Assignment Rules
4. Workflow Management Rules
5. Document Management Rules
6. Internship Monitoring Rules
7. Evaluation Rules
8. Financial Management Rules
9. Notification Rules
10. Security and Access Rules
11. Data Integrity Rules

---

# 3. Candidate Management Rules

---

## BR-CAND-001: Candidate Identity

A candidate must have a unique identity inside the platform.

Required information:

- First name
- Last name
- National ID
- Contact information
- University information
- Academic speciality

---

## BR-CAND-002: Candidate Account Independence

A candidate can exist without having a platform account.

Explanation:

- Candidates may be created manually by HR.
- User authentication is optional.
- Candidate.contactEmail is different from User.email.

Therefore:


Candidate 0..1 User Account


---

## BR-CAND-003: National ID Uniqueness

A national ID must uniquely identify a candidate.

The system must prevent:

- Duplicate candidates
- Multiple profiles with the same identity information

---

# 4. Internship Application Rules

---

## BR-APP-001: Application Submission

A candidate can submit an internship application only if:

Required documents are provided:

- CV
- Motivation letter
- University documents
- Identity documents (when required)

---

## BR-APP-002: Application Lifecycle

An application follows this lifecycle:


DRAFT
↓
SUBMITTED
↓
UNDER_REVIEW
↓
ACCEPTED / REJECTED


The system must prevent invalid transitions.

Example:


REJECTED → ACCEPTED


is not directly allowed.

---

## BR-APP-003: Application Reference

Each application must have a unique generated reference.

Example:


STEG-INT-2026-0001


The reference is used for:

- Tracking
- Communication
- Reporting

---

## BR-APP-004: Application Modification

A submitted application cannot be modified by the candidate unless it is returned by an authorized employee.

---

# 5. Internship Management Rules

---

## BR-INT-001: Internship Creation

An internship can only be created from an accepted internship application.

Relationship:


Accepted Application
|
↓
Internship Creation


---

## BR-INT-002: Internship Status Lifecycle

An internship follows:


PLANNED
↓
ACTIVE
↓
COMPLETED
↓
ARCHIVED


Alternative:


PLANNED / ACTIVE
↓
CANCELLED


---

## BR-INT-003: Internship Dates Validation

The system must guarantee:


Start Date < End Date


An internship cannot have:

- Negative duration
- Invalid dates

---

# 6. Internship Assignment Rules

---

## BR-ASG-001: Supervisor Assignment

Every active internship must have at least one assigned supervisor.


ACTIVE Internship
|
↓
Supervisor Required


---

## BR-ASG-002: Department Assignment

Every internship assignment must belong to one department.

---

## BR-ASG-003: Active Assignment Constraint

An internship can have multiple assignments during its lifecycle.

However:


Maximum ONE ACTIVE assignment
per internship


Example:

Allowed:


Assignment 1 → ENDED
Assignment 2 → ACTIVE


Not allowed:


Assignment 1 → ACTIVE
Assignment 2 → ACTIVE


---

## BR-ASG-004: Assignment History Preservation

Previous assignments must never be deleted.

They must remain available for:

- Audit
- History
- Reporting

---

# 7. Workflow Management Rules

---

## BR-WF-001: Workflow Attachment

Only entities implementing:


WorkflowAttachable


can have workflows.

Examples:

- Internship Application
- Internship
- Payment

---

## BR-WF-002: Workflow Execution Order

Workflow steps must execute according to their sequence number.

Example:


Step 1 → Step 2 → Step 3


Skipping steps is forbidden unless authorized.

---

## BR-WF-003: Workflow Action Traceability

Every workflow action must record:

- User performing action
- Date/time
- Decision
- Comment
- IP address

---

## BR-WF-004: Approval Rules

A workflow action must have one decision:


PENDING
APPROVED
REJECTED
RETURNED


---

# 8. Document Management Rules

---

## BR-DOC-001: Document Ownership

Every document must belong to a business entity.

Examples:

- Internship
- Internship Application

---

## BR-DOC-002: Document Integrity

Every uploaded document must store:

- Storage identifier
- File type
- Size
- Checksum

---

## BR-DOC-003: Document Versioning

Document updates create new versions.

Old versions must remain accessible.

---

## BR-DOC-004: Document Access Control

Documents must only be accessible according to user permissions.

Examples:

- Candidate sees own documents
- Supervisor sees assigned interns' documents
- HR sees administrative documents

---

# 9. Internship Companion Rules

---

## BR-COMP-001: Journal Ownership

Each internship has one internship journal.


Internship 1 ─── 1 InternshipJournal


---

## BR-COMP-002: Journal Validation

Journal entries follow:


DRAFT
↓
SUBMITTED
↓
VALIDATED / REJECTED


---

## BR-COMP-003: Task Management

Tasks belong to an internship.

Task states:


TODO
IN_PROGRESS
COMPLETED
CANCELLED


---

## BR-COMP-004: Deliverable Submission

A deliverable must contain:

- Title
- Description
- File information
- Submission date

---

## BR-COMP-005: Deliverable Validation

Only authorized supervisors can validate deliverables.

---

# 10. Evaluation Rules

---

## BR-EVAL-001: Evaluation Responsibility

Only assigned supervisors can evaluate interns.

---

## BR-EVAL-002: Evaluation Criteria

Evaluation scores must respect predefined criteria.

Each criterion contains:

- Name
- Description
- Weight
- Maximum score

---

## BR-EVAL-003: Evaluation Types

Supported evaluation types:

- Daily
- Weekly
- Mid-term
- Final
- Custom

---

# 11. Financial Management Rules

---

## BR-FIN-001: Payment Generation

A payment must be linked to an internship.

---

## BR-FIN-002: Payment Validation

Payment lifecycle:


PENDING
↓
VALIDATED
↓
PAID
↓
ARCHIVED


---

## BR-FIN-003: Financial Approval

Only authorized finance employees can approve payments.

---

## BR-FIN-004: Monetary Precision

Financial values must use decimal precision.

Example:

Java:


BigDecimal


Not:


double
float


---

# 12. Notification Rules

---

## BR-NOTIF-001: Notification Triggering

Notifications are generated by important business events.

Examples:

- Application submission
- Validation request
- Approval
- Deadline reminder
- Payment update

---

## BR-NOTIF-002: Notification Recipients

A notification can target:

- User
- Department
- Role
- Broadcast

---

## BR-NOTIF-003: Read Status

Read status belongs to the recipient, not the notification.

Reason:

A broadcast notification can have:


User A → Read
User B → Unread
User C → Read


---

# 13. Security and Access Rules

---

## BR-SEC-001: Authentication Requirement

Users accessing secured functionalities must authenticate.

---

## BR-SEC-002: Role-Based Access Control

Access rights are determined by:


User
↓
Role
↓
Permission


---

## BR-SEC-003: Sensitive Data Protection

Sensitive information must only be accessible by authorized users.

Examples:

- Personal data
- Documents
- Financial information

---

## BR-SEC-004: Audit Requirement

Critical actions must be logged.

Examples:

- Creation
- Modification
- Validation
- Deletion attempts

---

# 14. Data Integrity Rules

---

## BR-DATA-001: Unique References

The following entities require unique references:

- Internship Application
- Internship
- Payment
- Document

---

## BR-DATA-002: Historical Data Preservation

Business history must never be destroyed.

Deletion should preferably be replaced by:

- Archive
- Soft delete
- Status change

---

## BR-DATA-003: Single Source of Truth

Each business concept must have one responsible context.

Examples:

| Concept | Owner Context |
|-|-|
| User Authentication | Identity |
| Employee Information | Organization |
| Internship | Internship Management |
| Documents | Document Management |
| Payments | Finance |

---

# 15. Future Extension Rules

The platform must support future business rules without major architectural changes.

Potential extensions:

- External company internships
- International internships
- AI-based candidate matching
- Advanced analytics
- Integration with ERP systems

---

# 16. Conclusion

These business rules define the operational foundation of the STEG Smart Internship & Administrative Workflow Platform.

They ensure:

- Consistent business behavior
- Clear responsibilities
- Data integrity
- Workflow reliability
- Security compliance
- Future scalability

All technical implementations must respect these rules to guarantee alignment between the software solution and STEG's operational requirements.