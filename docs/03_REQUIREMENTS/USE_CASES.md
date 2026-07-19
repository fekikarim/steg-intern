# Use Cases Specification

## STEG Smart Internship & Administrative Workflow Platform

**Project:** Digital Platform for Internship Management and Administrative Workflow Automation  
**Version:** 1.0  
**Document Type:** Use Cases Specification  

**Related Documents:**

- Functional Requirements
- User Stories
- Actors Definition
- Business Workflows
- Domain Master Class Diagram
- Bounded Context Architecture


---

# 1. Introduction

## 1.1 Purpose

This document defines the main use cases of the STEG Smart Internship & Administrative Workflow Platform.

Use cases describe the interactions between system actors and the platform to achieve specific business objectives.

They provide a detailed functional view of the system and serve as a reference for:

- Software design
- API implementation
- Frontend development
- Mobile application development
- Testing scenarios


---

# 2. System Actors

The platform contains the following actors:

| Actor | Description |
|-|-|
| Candidate | External student requesting an internship |
| Intern | Accepted candidate performing internship |
| Supervisor | STEG employee supervising interns |
| HR Manager | Employee managing internship administration |
| Finance Manager | Employee managing internship payments |
| Director | Senior employee approving important operations |
| Administrator | Technical platform manager |


---

# 3. Identity & Access Management Use Cases

---

# UC-IAM-001 Authenticate User

## Actor

All authenticated users


## Goal

Allow users to securely access the platform.


## Preconditions

- User account exists.
- User account is active.


## Main Flow

1. User enters email and password.
2. System verifies credentials.
3. System validates account status.
4. System generates authentication tokens.
5. System creates a session.
6. User accesses authorized resources.


## Alternative Flows

### Invalid credentials

1. System rejects authentication.
2. User receives an error message.


### Locked account

1. System blocks authentication.
2. Administrator intervention is required.


## Postconditions

- Active user session created.
- Access token generated.


## Related Entities

- User
- RefreshToken
- Session


## Related Context

Identity & Access Management


---

# UC-IAM-002 Manage Roles and Permissions

## Actor

Administrator


## Goal

Configure access rights for platform users.


## Preconditions

- Administrator is authenticated.


## Main Flow

1. Administrator creates or updates a role.
2. Administrator assigns permissions.
3. System saves authorization rules.
4. Users inherit updated permissions.


## Postconditions

- Updated authorization model.


## Related Entities

- Role
- Permission
- User


---

# UC-IAM-003 Consult Audit History

## Actor

Administrator


## Goal

Review system activities for traceability.


## Main Flow

1. Administrator selects entity or user.
2. System retrieves audit records.
3. System displays actions history.


## Related Entity

- AuditLog


---

# 4. Candidate Management Use Cases

---

# UC-CAN-001 Submit Internship Application

## Actor

Candidate


## Goal

Submit an internship request digitally.


## Preconditions

- Candidate accesses public portal.
- Required information is available.


## Main Flow

1. Candidate creates application.
2. Candidate enters personal information.
3. Candidate provides academic information.
4. Candidate uploads required documents.
5. Candidate submits application.
6. System generates application reference.
7. Application status becomes SUBMITTED.


## Alternative Flows

### Missing documents

1. System identifies missing files.
2. Submission is blocked.
3. Candidate completes missing information.


## Postconditions

- Internship application created.
- HR can review application.


## Related Entities

- Candidate
- InternshipApplication
- ApplicationDocument


## Related Context

Internship Management


---

# UC-CAN-002 Track Application Status

## Actor

Candidate


## Goal

Follow internship request progress.


## Main Flow

1. Candidate authenticates.
2. Candidate opens application tracking.
3. System displays current status.


## Possible statuses

- DRAFT
- SUBMITTED
- UNDER_REVIEW
- ACCEPTED
- REJECTED


## Related Entity

- InternshipApplication


---

# 5. Internship Management Use Cases

---

# UC-INT-001 Create Internship After Acceptance

## Actor

HR Manager


## Goal

Create internship record after candidate approval.


## Preconditions

- Application is accepted.
- Required information exists.


## Main Flow

1. HR validates application.
2. System creates internship.
3. Candidate is linked.
4. Internship status becomes PLANNED.


## Postconditions

- Internship lifecycle starts.


## Related Entities

- InternshipApplication
- Internship
- Candidate


---

# UC-INT-002 Assign Supervisor and Department

## Actor

HR Manager


## Goal

Assign organizational responsibility.


## Main Flow

1. HR selects internship.
2. HR selects department.
3. HR selects supervisor.
4. System creates assignment.
5. Assignment becomes ACTIVE.


## Related Entities

- InternshipAssignment
- Department
- Supervisor


---

# UC-INT-003 Manage Internship Lifecycle

## Actor

HR Manager


## Goal

Track internship evolution.


## Main Flow

Internship transitions:


PLANNED
|
ACTIVE
|
COMPLETED
|
ARCHIVED



## Alternative States

- CANCELLED


## Related Entity

- Internship


---

# 6. Workflow Engine Use Cases

---

# UC-WF-001 Execute Approval Workflow

## Actor

Authorized employee


## Goal

Process administrative approvals digitally.


## Preconditions

- Workflow exists.
- User has required permission.


## Main Flow

1. System loads workflow steps.
2. User performs required action.
3. System records decision.
4. Workflow progresses.
5. Next actor is notified.


## Actions:

- APPROVAL
- VALIDATION


## Related Entities

- Workflow
- WorkflowStep
- WorkflowAction


---

# UC-WF-002 Reject or Return Request

## Actor

Approver


## Goal

Request correction or reject an operation.


## Main Flow

1. Approver reviews request.
2. Approver selects rejection/return.
3. Approver adds comments.
4. System updates workflow status.


## Related Entity

- WorkflowAction


---

# 7. Internship Companion Use Cases

---

# UC-COMP-001 Create Journal Entry

## Actor

Intern


## Goal

Document internship progress.


## Main Flow

1. Intern opens journal.
2. Intern creates entry.
3. Intern saves draft.
4. Intern submits entry.


## Related Entities

- InternshipJournal
- JournalEntry


---

# UC-COMP-002 Validate Journal Entry

## Actor

Supervisor


## Goal

Review intern progress.


## Main Flow

1. Supervisor opens submitted entry.
2. Supervisor reviews content.
3. Supervisor validates or rejects.
4. System updates status.


## Related Entity

- JournalEntry


---

# UC-COMP-003 Submit Deliverable

## Actor

Intern


## Goal

Upload internship work.


## Main Flow

1. Intern selects file.
2. System validates file.
3. System stores document.
4. Deliverable status becomes SUBMITTED.
5. Supervisor receives notification.


## Related Entity

- Deliverable


---

# UC-COMP-004 Evaluate Intern

## Actor

Supervisor


## Goal

Assess internship performance.


## Main Flow

1. Supervisor selects evaluation period.
2. Supervisor evaluates criteria.
3. Supervisor enters scores.
4. Supervisor adds feedback.
5. Evaluation is saved.


## Related Entities

- Evaluation
- EvaluationCriterion
- EvaluationScore


---

# 8. Document Management Use Cases

---

# UC-DOC-001 Upload Document

## Actor

Candidate / Intern / HR Manager


## Goal

Store required documents digitally.


## Main Flow

1. User selects document.
2. System validates file.
3. System stores file metadata.
4. Document becomes accessible according to permissions.


## Related Entity

- Document


---

# UC-DOC-002 Generate Official Document

## Actor

HR Manager


## Goal

Automatically generate administrative documents.


## Generated documents:

- Internship convention
- Assignment letter
- Certificate


## Main Flow

1. HR requests generation.
2. System retrieves internship data.
3. Document template is processed.
4. Generated document is stored.


## Related Entities

- Document
- Internship


---

# 9. Communication Use Cases

---

# UC-COM-001 Send Notification

## Actor

System


## Goal

Inform users about important events.


## Trigger examples:

- Application update
- Workflow action
- Validation result
- Payment update


## Main Flow

1. Business event occurs.
2. Notification is created.
3. Recipients are determined.
4. Notification is delivered.


## Related Entities

- Notification
- NotificationRecipient


---

# UC-COM-002 Consult Notifications

## Actor

User


## Goal

View received notifications.


## Main Flow

1. User opens notifications.
2. System displays messages.
3. User marks notification as read.


## Related Entity

- NotificationRecipient


---

# 10. Financial Management Use Cases

---

# UC-FIN-001 Create Internship Payment

## Actor

Finance Manager


## Goal

Create internship indemnity payment.


## Main Flow

1. Finance manager creates payment.
2. Amount and currency are entered.
3. Payment starts workflow validation.


## Related Entities

- Payment
- Workflow


---

# UC-FIN-002 Validate Payment

## Actor

Finance Manager / Director


## Goal

Approve payment execution.


## Main Flow

1. Payment request is reviewed.
2. Approval action is performed.
3. Payment status changes.


## Payment lifecycle:


PENDING
|
VALIDATED
|
PAID
|
ARCHIVED



## Related Entities

- Payment
- WorkflowAction


---

# 11. Reporting Use Cases

---

# UC-REP-001 Consult Dashboard

## Actor

HR Manager / Director / Administrator


## Goal

Monitor platform activity.


## Displayed information:

- Number of applications
- Active internships
- Pending workflows
- Payments
- Statistics


---

# 12. Use Case Coverage Matrix

| Use Case Domain | Main Actors |
|-|-|
| Authentication | All users |
| Application Management | Candidate, HR |
| Internship Management | HR, Supervisor |
| Workflow | HR, Finance, Director |
| Journal & Evaluation | Intern, Supervisor |
| Documents | Candidate, HR |
| Notifications | All users |
| Payments | Finance, Director |
| Administration | Administrator |


---

# 13. Summary

These use cases represent the complete functional interaction model of the STEG Smart Internship Platform.

They provide the foundation for:

- UML diagrams
- API endpoints
- Frontend screens
- Mobile features
- Automated testing scenarios


Every functional requirement must be represented by at least one use case.