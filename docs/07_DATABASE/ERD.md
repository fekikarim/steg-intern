# Entity Relationship Diagram (ERD)

## 1. Overview

This document describes the Entity Relationship Diagram (ERD) of the **Intelligent Internship Management and Administrative Workflow Platform of STEG**.

The ERD represents the logical database model derived from the domain master class diagram.

The database follows a domain-oriented relational structure where each business domain is represented through interconnected entities.

Main objectives:

- Represent all persistent business entities.
- Define relationships between tables.
- Ensure referential integrity.
- Provide a clear vision of the database structure.
- Facilitate implementation with PostgreSQL and Spring Boot JPA.

---

# 2. Global Database ERD

+----------------+
| roles |
+----------------+
|
|
*
+----------------+
| users |
+----------------+
|
|
+----------------+
| |
* *
+---------------+ +--------------+
| refresh_tokens| | sessions |
+---------------+ +--------------+
    |
    |
    *
+----------------+
| audit_logs |
+----------------+
            ORGANIZATION DOMAIN
+----------------+
| departments |
+----------------+
|
|
*
+----------------+
| employees |
+----------------+
|
|
|
+----------------+
| |
* *
+--------------+ +--------------+
| supervisors | | hr_managers |
+--------------+ +--------------+
            INTERNSHIP DOMAIN
+----------------+
| candidates |
+----------------+
|
|
*
+---------------------------+
| internship_applications |
+---------------------------+
|
|
|
*
+----------------+
| internships |
+----------------+
|
|
+----------------+
| |
* *
+----------------+ +----------------------+
| assignments | | internship_documents |
+----------------+ +----------------------+
    |
    |
    +----------------+
    |                |
    *                *
+----------------+ +----------------+
| tasks | | deliverables |
+----------------+ +----------------+
    |
    |
    *
+----------------+
| evaluations |
+----------------+
            WORKFLOW DOMAIN
+----------------+
| workflows |
+----------------+
|
|
*
+----------------+
| workflow_steps |
+----------------+
|
|
*
+----------------+
|workflow_actions|
+----------------+
            COMMUNICATION DOMAIN
+----------------+
| notifications |
+----------------+
|
|
*
+-------------------------+
|notification_recipients |
+-------------------------+
            FINANCIAL DOMAIN
+----------------+
| payments |
+----------------+

---

# 3. Entity Groups

The database is divided into several bounded contexts.

---

# 3.1 Identity and Access Management ERD

## Entities

### users

Main authentication entity.

Attributes:

user_id PK
email
password_hash
enabled
status
created_at
updated_at

Relationships:

roles 1 ---- N users
users 1 ---- N refresh_tokens
users 1 ---- N sessions
users 1 ---- N audit_logs

---

### roles

Defines application roles.

Examples:

ADMINISTRATOR
HR_MANAGER
SUPERVISOR
FINANCE_MANAGER
DIRECTOR
INTERN

Relationship:

roles N ---- N permissions

---

### permissions

Defines fine-grained authorization rules.

Example:

INTERNSHIP_CREATE
INTERNSHIP_VALIDATE
PAYMENT_APPROVE
DOCUMENT_GENERATE

---

# 3.2 Organization ERD

## Department

Represents STEG organizational units.

Relationship:

department
 |
 |
 N

employees

---

## Employee

Abstract entity representing STEG personnel.

Specializations:

Employee
|
+---- Supervisor
|
+---- HRManager
|
+---- FinanceManager
|
+---- Director
|
+---- Administrator

---

# 3.3 Internship Management ERD

This is the core business domain.

---

## Candidate

Represents students requesting internships.

Relationship:

Candidate

1
|
N

InternshipApplication

---

## InternshipApplication

Represents internship requests.

Relationship:

Application

0..1
|
1

Internship

Meaning:

A validated application can generate an internship.

---

## Internship

Main internship aggregate.

Relationships:

Candidate

1
|
N

Internships

Internship

1
|
N

InternshipAssignments

---

## InternshipAssignment

Represents internship allocation.

Links:

Internship

|
|

Department

Internship

|
|

Supervisor

An internship must have:

- Department.
- Supervisor.

---

# 3.4 Workflow ERD


Workflow engine manages administrative processes.

Structure:


Workflow

1
|
N

WorkflowStep

1
|
N

WorkflowAction

Example:

Internship validation workflow:

Created
↓
HR Review
↓
Supervisor Approval
↓
Director Validation
↓
Completed

---

# 3.5 Internship Companion ERD

Supports daily internship monitoring.

---

## Internship Journal

Relationship:

Internship

1
|
1

InternshipJournal

---

## Journal Entry

Relationship:

InternshipJournal

1
|
N

JournalEntry

---

## Tasks

Relationship:

Internship

1
|
N

Tasks

Used for:

- Daily objectives.
- Internship planning.
- Progress tracking.


---

## Deliverables

Relationship:

Internship

1
|
N

Deliverables

Used for:

- Reports.
- Documents.
- Project files.

---

## Evaluation

Relationship:

Internship

1
|
N

Evaluation

Evaluation contains:

Evaluation

1
|
N

EvaluationScore

N
|
1

EvaluationCriterion

---

# 3.6 Document Management ERD

Documents are stored using metadata.

Structure:

Document
(abstract)

|
+----------------+
|

InternshipConvention
AssignmentLetter
InternshipCertificate
ApplicationDocument

Relationships:

Internship

1
|
N

Documents


Application documents:

InternshipApplication

1
|
N

ApplicationDocuments

---

# 3.7 Communication ERD

Notification system:

Notification

1
|
N

NotificationRecipient

Supports:

- Individual notifications.
- Role notifications.
- Department notifications.
- Broadcast notifications.


---

# 3.8 Financial ERD

Payment entity:

Internship

1
|
N

Payment

Payment approval:

Employee

1
|
N

Payments

---

# 4. Main Cardinalities Summary


| Relationship | Cardinality |
|-|-|
| Role → Users | 1:N |
| Role ↔ Permission | N:N |
| User → Refresh Tokens | 1:N |
| User → Sessions | 1:N |
| User → Audit Logs | 1:N |
| Department → Employees | 1:N |
| Candidate → Applications | 1:N |
| Candidate → Internships | 1:N |
| Application → Internship | 1:0..1 |
| Internship → Assignments | 1:N |
| Internship → Documents | 1:N |
| Internship → Tasks | 1:N |
| Internship → Deliverables | 1:N |
| Internship → Evaluations | 1:N |
| Workflow → Steps | 1:N |
| Workflow Step → Actions | 1:N |
| Notification → Recipients | 1:N |
| Internship → Payments | 1:N |


---

# 5. Database Integrity Rules


## Foreign Key Rules


All relationships must enforce:


- Referential integrity.
- Controlled deletion.
- No orphan records.


Example:

Cannot delete a department
if active internships depend on it.



---

# 6. Delete Strategy


Recommended strategy:


## Soft Delete


For business-critical entities:

users

documents

internships

applications



Using:

deleted_at TIMESTAMP NULL

---

## Cascade Delete


Allowed only for technical entities:


Examples:



refresh_tokens

sessions

notification_recipients



---

# 7. ERD Evolution Strategy


The ERD is designed for future expansion.


Possible future entities:


ElectronicSignature

OCRDocumentAnalysis

AIRecommendation

TrainingRequest

LeaveManagement



The current model provides a stable foundation for extending STEG digital administrative services.

---

# Conclusion


The Entity Relationship Diagram defines the complete persistence model of the STEG Internship Management Platform.

It ensures:

- Clear domain separation.
- Strong relationships.
- Data consistency.
- Scalability.
- Maintainability.

The ERD serves as the reference model before PostgreSQL schema implementation and Spring Boot entity creation.