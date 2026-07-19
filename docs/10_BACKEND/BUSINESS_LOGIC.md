# Business Logic

## 1. Purpose

This document defines the core business logic of the STEG Internship Management Platform.

The objective is to describe the rules, validations, processes, and domain behaviors that govern the system independently from the technical implementation.

The business logic layer represents the intelligence of the platform and ensures that:

- Business rules are centralized.
- Processes remain consistent.
- Applications share the same behavior.
- Future modifications are easier.

This layer is used by:

- Next.js Front Office.
- Angular Back Office.
- Flutter Mobile Application.

---

# 2. Business Logic Architecture

The backend follows a domain-driven approach.

```

Controllers

```
|
```

Application Services

```
|
```

Domain Business Logic

```
|
```

Repositories

```
|
```

Database

```

Business rules must not be implemented inside:

- Frontend applications.
- Controllers.
- Database procedures.

They belong inside the backend domain/services layer.

---

# 3. Core Business Domains

The platform is divided into the following business domains:

```

Identity Management

Internship Application Management

Internship Lifecycle Management

Workflow Management

Document Management

Internship Follow-up

Evaluation Management

Financial Management

Notification Management

```

---

# 4. Identity Management Rules

## 4.1 User Creation

A user account can be created by:

- Candidate registration.
- Administrator.
- Internal employee creation.

Rules:

- Email must be unique.
- Password must respect security policies.
- User status is initially:

```

ACTIVE

```

unless manually disabled.

---

## 4.2 User Status Management

A user can have:

```

ACTIVE

INACTIVE

LOCKED

```

Rules:

### ACTIVE

The user can:

- Authenticate.
- Access authorized resources.

---

### INACTIVE

The user:

- Cannot authenticate.
- Keeps historical data.

---

### LOCKED

The user:

- Is temporarily blocked.
- Requires administrative action.

---

# 5. Role and Permission Logic

The platform uses RBAC.

A user:

```

User

↓

Role

↓

Permissions

```

Example:

```

HR Manager

Permissions:

* Manage candidates
* Validate applications
* Generate documents

```

Rules:

- Users can only access authorized features.
- Permissions must be checked on every protected operation.
- Roles must not directly bypass security rules.

---

# 6. Candidate Management Logic

## 6.1 Candidate Registration

A candidate provides:

- Personal information.
- University information.
- Internship request information.
- Required documents.

Validation:

Required:

```

First name

Last name

Email

Phone

University

Speciality

```

---

## 6.2 Candidate Account Linking

A candidate may have:

```

0..1 User Account

```

Rules:

- One account belongs to one candidate.
- Duplicate candidate accounts should be prevented.

---

# 7. Internship Application Logic

## 7.1 Application Lifecycle

An application follows:

```

DRAFT

↓

SUBMITTED

↓

UNDER_REVIEW

↓

ACCEPTED

OR

REJECTED

```

---

## 7.2 Draft State

A draft application:

- Can be modified.
- Is not visible as a final request.

---

## 7.3 Submitted State

When submitted:

The system verifies:

- Required information exists.
- Mandatory documents are uploaded.
- Candidate information is valid.

If validation succeeds:

```

DRAFT → SUBMITTED

```

---

## 7.4 Review Process

Only authorized employees can review applications.

Possible actions:

```

Accept

Reject

Request modification

```

---

## 7.5 Acceptance Rules

An accepted application:

- Creates an internship record.
- Initiates internship workflow.
- Allows assignment.

---

# 8. Internship Lifecycle Logic

## 8.1 Internship States

An internship follows:

```

PLANNED

↓

ACTIVE

↓

COMPLETED

↓

ARCHIVED

```

Possible cancellation:

```

PLANNED / ACTIVE

↓

CANCELLED

```

---

# 8.2 Internship Creation

An internship requires:

- Candidate.
- Reference number.
- Start date.
- End date.

Rules:

- End date must be after start date.
- Reference must be unique.

---

# 8.3 Internship Activation

An internship becomes active when:

Conditions:

- Assignment completed.
- Required documents validated.
- Start date reached.

Transition:

```

PLANNED → ACTIVE

```

---

# 8.4 Internship Completion

An internship can be completed when:

- End date reached.
- Final evaluation completed.
- Required deliverables submitted.

Transition:

```

ACTIVE → COMPLETED

```

---

# 9. Assignment Logic

An internship requires at least one assignment.

Assignment contains:

- Department.
- Supervisor.
- Assignment date.

Rules:

- A supervisor must belong to the organization.
- A supervisor can supervise multiple interns.
- Assignment history must be preserved.

---

# 10. Workflow Engine Logic

The workflow engine manages approval processes.

General workflow:

```

Created

↓

Running

↓

Completed

↓

Archived

```

---

# 10.1 Workflow Actions

Actions:

```

APPROVAL

VALIDATION

```

Each action stores:

- User.
- Decision.
- Comment.
- Date.
- IP address.

---

# 10.2 Approval Decisions

Possible decisions:

```

PENDING

APPROVED

REJECTED

RETURNED

```

Rules:

- Only authorized users can approve.
- Every decision must be recorded.
- Previous actions cannot be deleted.

---

# 11. Document Management Logic

## 11.1 Document Upload

Before storing:

Validate:

- File type.
- File size.
- User permission.
- Ownership.

---

## 11.2 Document Versioning

Documents support versions.

Example:

```

CV_v1

CV_v2

CV_v3

```

Rules:

- Previous versions remain accessible.
- Latest version is active.

---

## 11.3 Automatic Document Generation

The system can generate:

- Internship convention.
- Assignment letter.
- Internship certificate.

Generation requires:

- Valid internship data.
- Approved workflow.

---

# 12. Internship Companion Logic

## 12.1 Journal Management

A journal entry follows:

```

DRAFT

↓

SUBMITTED

↓

VALIDATED

OR

REJECTED

```

---

Rules:

A trainee can:

- Create entries.
- Modify drafts.
- Submit journals.

Supervisor can:

- Validate.
- Reject.
- Comment.

---

# 12.2 Task Management

Tasks follow:

```

TODO

↓

IN_PROGRESS

↓

COMPLETED

```

Rules:

- Tasks belong to an internship.
- Interns can update progress.
- Supervisors can create tasks.

---

# 12.3 Deliverable Management

Deliverable lifecycle:

```

DRAFT

↓

SUBMITTED

↓

VALIDATED

OR

REJECTED

```

Rules:

- Only assigned interns can submit deliverables.
- Supervisor validation is required.

---

# 13. Evaluation Logic

Evaluations can be:

```

DAILY

WEEKLY

MID_TERM

FINAL

CUSTOM

```

Rules:

- Only authorized supervisors can evaluate.
- Criteria weights must be valid.
- Scores must respect maximum values.

Example:

```

Score <= Max Score

```

---

# 14. Payment Logic

## 14.1 Payment Lifecycle

```

PENDING

↓

VALIDATED

↓

PAID

↓

ARCHIVED

```

---

## 14.2 Payment Validation

A payment requires:

- Internship reference.
- Amount.
- Currency.
- Approval.

---

## 14.3 Payment Rules

Rules:

- Amount cannot be negative.
- Payment must have a responsible validator.
- Paid payments cannot be modified.

---

# 15. Notification Logic

Notifications can be generated by:

- Workflow changes.
- Validation actions.
- New assignments.
- Comments.
- Important deadlines.

---

Notification priority:

```

LOW

NORMAL

HIGH

URGENT

```

Rules:

- Users only receive authorized notifications.
- Read status is tracked.

---

# 16. Audit Logic

Important actions must create audit records.

Examples:

- User creation.
- Permission changes.
- Application decisions.
- Document generation.
- Payment validation.

Audit information:

```

User

Action

Entity

Old Value

New Value

Timestamp

```

---

# 17. Data Integrity Rules

The system must guarantee:

## Referential Integrity

Example:

An internship cannot exist without a candidate.

---

## Historical Integrity

Important records must not be physically deleted.

Use:

- Archive.
- Status changes.

---

## Consistency

All applications must use the same business rules.

---

# 18. Transaction Management

Critical operations must be transactional.

Examples:

Application acceptance:

```

Accept Application

*

Create Internship

*

Create Workflow

*

Generate Notification

```

All operations succeed together or fail together.

---

# 19. Exception Rules

Business exceptions must be explicit.

Examples:

```

ApplicationAlreadySubmittedException

InvalidWorkflowTransitionException

UnauthorizedActionException

DocumentValidationException

```

---

# 20. Future Business Extensions

Possible future modules:

- Leave management.
- Internal requests.
- Recruitment workflows.
- Electronic signature.
- AI-assisted document processing.
- Advanced approval engines.

---

# 21. Conclusion

The business logic layer is the core intelligence of the STEG Internship Management Platform.

By centralizing business rules, workflows, validations, and domain behaviors, the system ensures consistency between all applications while remaining scalable and maintainable for future evolution.