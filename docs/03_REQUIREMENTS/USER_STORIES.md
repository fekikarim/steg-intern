# User Stories

## STEG Smart Internship & Administrative Workflow Platform

**Project:** Digital Platform for Internship Management and Administrative Workflow Automation  
**Version:** 1.0  
**Document Type:** User Stories Specification  

**Related Documents:**

- Functional Requirements
- Use Cases Specification
- Actors Definition
- Business Workflows
- Domain Master Class Diagram
- Product Vision


---

# 1. Introduction

## 1.1 Purpose

This document defines the user stories of the STEG Smart Internship & Administrative Workflow Platform.

User stories describe the expected interactions between system actors and the platform from a business perspective.

Each user story follows the standard format:

> **As a [actor], I want to [action], so that [business value].**


User stories are organized according to the platform bounded contexts:

- Identity & Access Management
- Organization Management
- Internship Management
- Workflow Engine
- Internship Companion
- Document Management
- Communication
- Financial Management


---

# 2. Actors

The main actors involved in the platform are:

| Actor | Description |
|-|-|
| Candidate | Student applying for an internship |
| Intern | Accepted candidate performing internship |
| Supervisor | STEG employee responsible for intern supervision |
| HR Manager | Responsible for internship administration |
| Finance Manager | Responsible for internship payments |
| Director | Responsible for high-level approvals |
| Administrator | Technical and platform administrator |


---

# 3. Identity & Access Management User Stories

---

## US-IAM-001 User Authentication

### User Story

**As a user,  
I want to authenticate securely into the platform,  
so that I can access the functionalities according to my permissions.**


### Acceptance Intentions

The system must:

- Allow login using credentials.
- Verify user identity.
- Generate secure authentication tokens.
- Redirect the user to the appropriate interface.


### Related Entities

- User
- RefreshToken
- Session


### Priority

High


---

## US-IAM-002 Role-Based Access

### User Story

**As an administrator,  
I want to assign roles and permissions to users,  
so that each user can only access authorized functionalities.**


### Acceptance Intentions

The system must:

- Allow role assignment.
- Associate permissions with roles.
- Enforce authorization rules.


### Related Entities

- Role
- Permission
- User


### Priority

High


---

## US-IAM-003 Audit Tracking

### User Story

**As an administrator,  
I want to track important system actions,  
so that I can guarantee administrative traceability.**


### Acceptance Intentions

The system must record:

- User performing action
- Action type
- Modified entity
- Date/time
- Previous and new values


### Related Entity

- AuditLog


### Priority

High


---

# 4. Candidate User Stories

---

## US-CAN-001 Create Internship Application

### User Story

**As a candidate,  
I want to submit an internship application online,  
so that I can request an internship opportunity at STEG without paper documents.**


### Acceptance Intentions

The candidate can:

- Create application.
- Fill personal information.
- Add academic information.
- Upload required documents.
- Submit application.


### Related Entities

- Candidate
- InternshipApplication
- ApplicationDocument


### Priority

Critical


---

## US-CAN-002 Track Application Status

### User Story

**As a candidate,  
I want to track the status of my internship application,  
so that I know the progress of my request.**


### Possible statuses:

- Draft
- Submitted
- Under Review
- Accepted
- Rejected


### Related Entity

- InternshipApplication


### Priority

High


---

## US-CAN-003 Receive Application Notifications

### User Story

**As a candidate,  
I want to receive notifications about my application,  
so that I stay informed about important updates.**


### Examples:

- Application submitted
- Missing documents
- Accepted internship
- Rejected request


### Related Entities

- Notification
- NotificationRecipient


### Priority

Medium


---

# 5. Intern User Stories

---

## US-INT-001 Access Internship Timeline

### User Story

**As an intern,  
I want to visualize my internship timeline,  
so that I can follow my internship progress.**


### Information displayed:

- Start date
- End date
- Supervisor
- Department
- Tasks
- Deliverables


### Related Entity

- Internship


### Priority

High


---

## US-INT-002 Maintain Internship Journal

### User Story

**As an intern,  
I want to write daily internship journal entries,  
so that my supervisor can monitor my progress.**


### Acceptance Intentions:

The intern can:

- Create journal entries.
- Modify drafts.
- Submit entries.
- Receive validation feedback.


### Related Entities:

- InternshipJournal
- JournalEntry


### Priority

High


---

## US-INT-003 Manage Internship Tasks

### User Story

**As an intern,  
I want to manage my assigned tasks,  
so that I can organize my internship activities.**


### Related Entity:

- Task


### Priority

Medium


---

## US-INT-004 Submit Deliverables

### User Story

**As an intern,  
I want to upload internship deliverables,  
so that my supervisor can validate my work.**


### Acceptance Intentions:

The system supports:

- File upload
- Version management
- Validation status
- Comments


### Related Entity:

- Deliverable


### Priority

High


---

# 6. Supervisor User Stories

---

## US-SUP-001 View Assigned Interns

### User Story

**As a supervisor,  
I want to view my assigned interns,  
so that I can monitor their internship activities.**


### Related Entities:

- InternshipAssignment
- Internship


### Priority

High


---

## US-SUP-002 Validate Journal Entries

### User Story

**As a supervisor,  
I want to validate intern journal entries,  
so that internship progress is officially tracked.**


### Actions:

- Validate
- Reject
- Add comments


### Related Entities:

- JournalEntry
- Comment


### Priority

High


---

## US-SUP-003 Evaluate Intern Performance

### User Story

**As a supervisor,  
I want to evaluate interns based on criteria,  
so that I can provide objective performance assessment.**


### Evaluation includes:

- Criteria scores
- Feedback
- Evaluation period


### Related Entities:

- Evaluation
- EvaluationCriterion
- EvaluationScore


### Priority

High


---

## US-SUP-004 Validate Deliverables

### User Story

**As a supervisor,  
I want to validate submitted deliverables,  
so that intern work quality can be confirmed.**


### Related Entity:

- Deliverable


### Priority

High


---

# 7. HR Manager User Stories

---

## US-HR-001 Manage Internship Applications

### User Story

**As an HR manager,  
I want to review internship applications,  
so that I can accept or reject candidates.**


### Actions:

- Review application
- Verify documents
- Start approval workflow
- Accept/reject


### Related Entities:

- InternshipApplication
- Workflow


### Priority

Critical


---

## US-HR-002 Assign Supervisors

### User Story

**As an HR manager,  
I want to assign supervisors and departments to interns,  
so that internships are properly organized.**


### Related Entities:

- InternshipAssignment
- Department
- Supervisor


### Priority

Critical


---

## US-HR-003 Generate Internship Documents

### User Story

**As an HR manager,  
I want to automatically generate internship documents,  
so that administrative processing becomes faster.**


### Generated documents:

- Internship convention
- Assignment letter
- Certificate


### Related Entity:

- Document


### Priority

High


---

# 8. Finance Manager User Stories

---

## US-FIN-001 Manage Internship Payments

### User Story

**As a finance manager,  
I want to manage internship payments,  
so that indemnities are processed correctly.**


### Information:

- Amount
- Currency
- Payment method
- Status


### Related Entity:

- Payment


### Priority

High


---

## US-FIN-002 Validate Payments

### User Story

**As a finance manager,  
I want to validate payment requests,  
so that only approved payments are executed.**


### Related Entities:

- Payment
- Workflow


### Priority

High


---

# 9. Director User Stories

---

## US-DIR-001 Approve Administrative Requests

### User Story

**As a director,  
I want to approve important workflow steps,  
so that strategic decisions remain controlled.**


### Related Entities:

- Workflow
- WorkflowAction


### Priority

Medium


---

## US-DIR-002 Monitor Internship Statistics

### User Story

**As a director,  
I want to access internship dashboards,  
so that I can monitor global activity.**


### Priority

Medium


---

# 10. Administrator User Stories

---

## US-ADM-001 Manage Platform Users

### User Story

**As an administrator,  
I want to manage platform users,  
so that the system remains secure and operational.**


### Related Entities:

- User
- Role
- Permission


### Priority

High


---

## US-ADM-002 Configure System Parameters

### User Story

**As an administrator,  
I want to configure system settings,  
so that the platform can adapt to organizational needs.**


Examples:

- Roles
- Permissions
- Workflow templates
- Notification settings


### Priority

Medium


---

# 11. Cross-Bounded Context User Stories

---

## US-CROSS-001 Workflow Automation

### User Story

**As a business user,  
I want administrative processes to follow digital workflows,  
so that approvals and validations become faster and traceable.**


### Related Entities:

- Workflow
- WorkflowStep
- WorkflowAction


### Priority

Critical


---

## US-CROSS-002 Digital Document Management

### User Story

**As a user,  
I want documents to be stored digitally,  
so that paper usage and manual searching are reduced.**


### Related Entities:

- Document
- ApplicationDocument


### Priority

Critical


---

## US-CROSS-003 Multi-Channel Notifications

### User Story

**As a user,  
I want to receive notifications through appropriate channels,  
so that I never miss important internship events.**


### Channels:

- Email
- Push
- In-app


### Related Entities:

- Notification
- NotificationRecipient


### Priority

Medium


---

# 12. User Story Coverage Matrix

| Actor | Main Functional Areas |
|-|-|
| Candidate | Application, Documents, Tracking |
| Intern | Journal, Tasks, Deliverables |
| Supervisor | Validation, Evaluation |
| HR Manager | Applications, Assignment, Documents |
| Finance Manager | Payments |
| Director | Approvals, Monitoring |
| Administrator | Security, Configuration |


---

# 13. Summary

These user stories define the expected interactions between platform users and the system.

They serve as a foundation for:

- Use case modeling
- Sprint planning
- API design
- Frontend features
- Mobile features
- Acceptance testing


Every implemented feature must be traceable to at least one user story.