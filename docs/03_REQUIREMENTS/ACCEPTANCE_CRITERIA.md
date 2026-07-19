# Acceptance Criteria Specification

## STEG Smart Internship & Administrative Workflow Platform

**Document Type:** Requirements Validation Specification  
**Version:** 1.0  
**Status:** Approved  
**Project:** Conception et Développement d’une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG

---

# 1. Introduction

## 1.1 Purpose

This document defines the acceptance criteria used to validate that the STEG Smart Internship & Administrative Workflow Platform satisfies the functional and business requirements.

Acceptance criteria represent measurable conditions that must be fulfilled before considering a feature complete and accepted.

They serve as a reference for:

- Development teams.
- Test teams.
- Project supervisors.
- Business stakeholders.
- Final project evaluation.

---

# 2. Acceptance Criteria Principles

The platform acceptance criteria follow these principles:

## Functional Validation

Each implemented feature must provide the expected business behavior.

Example:


Given:
A candidate has submitted an internship application.

When:
The HR manager reviews the request.

Then:
The application status must be updated correctly.


---

## Security Validation

Every action must respect:

- Authentication rules.
- Authorization rules.
- Data protection requirements.

---

## Usability Validation

The platform must provide:

- Clear navigation.
- Understandable interfaces.
- Consistent user experience.

---

## Reliability Validation

The system must guarantee:

- Data consistency.
- Workflow integrity.
- Error handling.

---

# 3. Global System Acceptance Criteria

| ID | Criterion | Expected Result |
|-|-|-|
| AC-G01 | System availability | Platform accessible according to deployment configuration |
| AC-G02 | Authentication | Users can securely login using valid credentials |
| AC-G03 | Authorization | Users only access authorized features |
| AC-G04 | Data persistence | All validated information is stored correctly |
| AC-G05 | Auditability | Important actions are recorded |
| AC-G06 | Responsive interfaces | Applications work on supported devices |
| AC-G07 | Error management | System provides meaningful error messages |

---

# 4. Identity & Access Management Criteria

## AC-IAM-01: User Authentication

### Scenario

User attempts to access the platform.

### Acceptance Criteria

Given:


A registered user exists.


When:


The user enters valid credentials.


Then:


The system authenticates the user
and generates an access token.


---

## AC-IAM-02: Invalid Authentication

Given:


Incorrect credentials are provided.


When:


The login request is submitted.


Then:


Access is denied and an error message is displayed.


---

## AC-IAM-03: Role-Based Access Control

Given:


A user has a defined role.


When:


The user accesses a protected resource.


Then:


The system verifies permissions before granting access.


---

## AC-IAM-04: Audit Logging

Given:


A sensitive operation is performed.


When:


The operation is completed.


Then:


An audit record containing:

User
Action
Entity
Timestamp
Change information

is created.


---

# 5. Candidate & Application Management Criteria

## AC-APP-01: Create Internship Application

### Scenario

A student submits an internship request.

Acceptance:


Given:
The candidate provides required information.

When:
The application is submitted.

Then:

A unique reference is generated.
Status becomes SUBMITTED.
Submission date is recorded.

---

## AC-APP-02: Document Upload

Given:


A candidate uploads required documents.


When:


The upload succeeds.


Then:


The documents are stored securely
and linked to the application.


---

## AC-APP-03: Application Review

Given:


An HR manager accesses pending applications.


When:


The manager reviews an application.


Then:


The application status can be changed to:

ACCEPTED
REJECTED
UNDER_REVIEW

---

# 6. Internship Management Criteria

## AC-INT-01: Internship Creation

Given:


An application has been accepted.


When:


The HR manager creates the internship.


Then:


The system creates an Internship entity
with:

Reference
Start date
End date
Status

---

## AC-INT-02: Supervisor Assignment

Given:


An active internship exists.


When:


A supervisor is assigned.


Then:


An InternshipAssignment record is created.


---

## AC-INT-03: Internship Lifecycle

The internship must support:


PLANNED
ACTIVE
COMPLETED
CANCELLED
ARCHIVED


Each transition must respect business rules.

---

# 7. Workflow Engine Criteria

## AC-WF-01: Workflow Creation

Given:


A workflow-enabled entity exists.


When:


A workflow starts.


Then:


A workflow instance is created
with initial status CREATED.


---

## AC-WF-02: Approval Process

Given:


A workflow requires approval.


When:


An authorized user validates it.


Then:


A WorkflowAction is created containing:

Decision
User
Date
Comment

---

## AC-WF-03: Workflow Traceability

The system must keep the complete history of:

- Actions.
- Decisions.
- Users.
- Timestamps.

---

# 8. Internship Companion Criteria

## AC-COMP-01: Journal Management

Given:


An intern has an active internship.


When:


The intern creates a journal entry.


Then:


The entry is stored with:

Date
Description
Status

---

## AC-COMP-02: Task Management

The intern must be able to:

- View assigned tasks.
- Update task status.
- Complete tasks.

---

## AC-COMP-03: Deliverable Submission

Given:


An intern uploads a deliverable.


Then:


The system:

Stores the file securely.
Creates a version.
Calculates integrity checksum.
Notifies the supervisor.

---

## AC-COMP-04: Supervisor Validation

Given:


A deliverable is submitted.


When:


The supervisor validates it.


Then:


The status changes to VALIDATED.


---

# 9. Evaluation Criteria

## AC-EVAL-01: Internship Evaluation

The supervisor must be able to:

- Create evaluations.
- Select evaluation type.
- Add scores.
- Provide feedback.

---

## AC-EVAL-02: Evaluation Criteria Management

The system must support:

- Multiple criteria.
- Different weights.
- Different evaluation types.

---

# 10. Document Management Criteria

## AC-DOC-01: Secure Storage

Given:


A document is uploaded.


Then:


The document is stored using object storage.


Required information:

- Storage key.
- Bucket.
- Object identifier.
- Checksum.
- Metadata.

---

## AC-DOC-02: Document Generation

The system must generate automatically:

- Internship convention.
- Assignment letter.
- Internship certificate.

---

## AC-DOC-03: Document Versioning

When a document is modified:


A new version must be created.
Previous versions remain traceable.


---

# 11. Communication Criteria

## AC-COM-01: Notification Creation

Given:


A business event occurs.


Then:


A notification can be generated.


---

## AC-COM-02: Multi-recipient Notification

The system must support:

- Individual users.
- Departments.
- Roles.
- Broadcast messages.

---

## AC-COM-03: Read Status

Each recipient must have independent:

- Read status.
- Read date.

---

# 12. Financial Management Criteria

## AC-FIN-01: Payment Creation

Given:


An internship requires payment.


Then:


A payment record is created.


Containing:

- Amount.
- Currency.
- Status.
- Payment method.

---

## AC-FIN-02: Payment Validation Workflow

Payment approval must follow:


Created
↓
Pending
↓
Validated
↓
Paid


---

# 13. Front Office Acceptance Criteria

## AC-FRONT-01

The public portal must allow candidates to:

- Access internship information.
- Submit applications.
- Upload documents.
- Track requests.

---

# 14. Back Office Acceptance Criteria

## AC-BACK-01

The administrative portal must allow STEG employees to:

- Manage candidates.
- Manage internships.
- Execute workflows.
- Generate documents.
- View dashboards.

---

# 15. Mobile Application Acceptance Criteria

## AC-MOBILE-01

The mobile application must allow interns and supervisors to:

- Consult internship data.
- Manage journal.
- Submit deliverables.
- Validate activities.
- Receive notifications.

---

# 16. Performance Acceptance Criteria

| ID | Requirement |
|-|-|
| AC-PERF-01 | Common operations respond quickly under normal load |
| AC-PERF-02 | File uploads support configured size limits |
| AC-PERF-03 | Database queries are optimized |
| AC-PERF-04 | API remains stable under concurrent users |

---

# 17. Security Acceptance Criteria

| ID | Requirement |
|-|-|
| AC-SEC-01 | All sensitive APIs require authentication |
| AC-SEC-02 | Authorization is enforced server-side |
| AC-SEC-03 | Passwords are securely hashed |
| AC-SEC-04 | Communication uses HTTPS |
| AC-SEC-05 | Security events are logged |

---

# 18. Final Acceptance Checklist

The project is considered accepted when:


☑ All functional requirements implemented

☑ All actors can perform their authorized actions

☑ Workflows operate correctly

☑ Documents are securely managed

☑ Security requirements validated

☑ Applications communicate correctly

☑ Database integrity verified

☑ Tests successfully executed

☑ Deployment completed successfully


---

# 19. Conclusion

This acceptance criteria document defines the quality baseline required before delivering the STEG Smart Internship & Administrative Workflow Platform.

It ensures alignment between:

- Business expectations.
- Technical implementation.
- Testing strategy.
- Final project objectives.

Any feature not satisfying its acceptance criteria must be considered incomplete.