# RELATIONSHIPS.md

# Database Relationships

**Project:** Intelligent Internship & Administrative Workflow Management Platform  
**Organization:** STEG (Société Tunisienne de l'Électricité et du Gaz)  
**Database:** PostgreSQL  
**Architecture:** Spring Boot 3 + PostgreSQL + Clean Architecture + DDD  
**Version:** 1.0

---

# Purpose

This document defines every relationship between database tables.

Its objective is to provide:

- a complete view of data dependencies
- referential integrity rules
- cascade policies
- ownership of entities
- aggregate boundaries
- guidance for backend developers
- guidance for AI coding assistants

This document complements:

- DATABASE_DESIGN.md
- ERD.md
- TABLES.md

---

# Relationship Types

The project mainly uses:

- One-to-One (1:1)
- One-to-Many (1:N)
- Many-to-Many (N:N)
- Inheritance
- Polymorphic Associations (implemented at application level)

---

# Identity & Access Management

---

## Role → User

Relationship

```
Role (1)
    |
    |------< User (N)
```

Type

```
One Role
→ Many Users
```

Foreign Key

```
users.role_id
```

Cascade

```
DELETE RESTRICT
UPDATE CASCADE
```

Reason

A role cannot be deleted while users still reference it.

---

## Role ↔ Permission

Relationship

```
Role
   \
    \
 role_permissions
    /
   /
Permission
```

Type

```
Many-to-Many
```

Bridge Table

```
role_permissions
```

Columns

```
role_id
permission_id
```

Composite Primary Key

```
(role_id, permission_id)
```

---

## User → RefreshToken

Relationship

```
User (1)
    |
    |------< RefreshToken (N)
```

Foreign Key

```
refresh_tokens.user_id
```

Cascade

```
DELETE CASCADE
```

Deleting a user removes all refresh tokens.

---

## User → Session

Relationship

```
User (1)
    |
    |------< Session (N)
```

Cascade

```
DELETE CASCADE
```

---

## User → AuditLog

Relationship

```
User (1)
    |
    |------< AuditLog (N)
```

Cascade

```
DELETE SET NULL
```

Audit history must remain available.

---

# Organization

---

## Department → Employee

Relationship

```
Department (1)
      |
      |------< Employee (N)
```

Foreign Key

```
employees.department_id
```

Cascade

```
DELETE RESTRICT
```

Departments cannot be deleted while employees exist.

---

## User → Employee

Relationship

```
User (1)
    |
    |------ Employee (1)
```

Type

```
One-to-One
```

Foreign Key

```
employees.user_id
```

Constraint

```
UNIQUE(user_id)
```

---

# Candidate Management

---

## User → Candidate

Relationship

```
User (1)
   |
   |------ Candidate (0..1)
```

Type

```
One-to-One
```

Foreign Key

```
candidates.user_id
```

Unique

```
TRUE
```

---

## Candidate → InternshipApplication

Relationship

```
Candidate (1)
      |
      |------< InternshipApplication (N)
```

Foreign Key

```
internship_applications.candidate_id
```

Cascade

```
DELETE RESTRICT
```

Applications must never disappear accidentally.

---

## Candidate → Internship

Relationship

```
Candidate (1)
      |
      |------< Internship (N)
```

Normally

```
One active internship

Multiple historical internships allowed
```

---

## InternshipApplication → Internship

Relationship

```
InternshipApplication (1)
            |
            |------ Internship (0..1)
```

Meaning

Only accepted applications generate internships.

Foreign Key

```
internships.application_id
```

Unique

```
TRUE
```

---

# Internship Management

---

## Internship → InternshipAssignment

Relationship

```
Internship (1)
      |
      |------< InternshipAssignment (N)
```

Allows:

- reassignment
- department changes
- supervisor changes

---

## Department → InternshipAssignment

Relationship

```
Department (1)
       |
       |------< InternshipAssignment (N)
```

---

## Supervisor → InternshipAssignment

Relationship

```
Supervisor (1)
      |
      |------< InternshipAssignment (N)
```

One supervisor can supervise many internships.

---

## Employee → InternshipAssignment

Relationship

```
Employee (1)
      |
      |------< InternshipAssignment (N)
```

Represents:

```
assigned_by
```

---

# Workflow Engine

---

## Workflow → WorkflowStep

Relationship

```
Workflow (1)
     |
     |------< WorkflowStep (N)
```

Cascade

```
DELETE CASCADE
```

---

## WorkflowStep → WorkflowAction

Relationship

```
WorkflowStep (1)
        |
        |------< WorkflowAction (N)
```

Each validation step can have multiple actions.

---

## User → WorkflowAction

Relationship

```
User (1)
    |
    |------< WorkflowAction (N)
```

Represents

```
performed_by
```

---

# Internship Companion

---

## Internship → InternshipJournal

Relationship

```
Internship (1)
      |
      |------ InternshipJournal (1)
```

Unique

```
journal.internship_id UNIQUE
```

---

## InternshipJournal → JournalEntry

Relationship

```
Journal (1)
     |
     |------< JournalEntry (N)
```

Cascade

```
DELETE CASCADE
```

---

## Internship → Task

Relationship

```
Internship (1)
      |
      |------< Task (N)
```

---

## Internship → Deliverable

Relationship

```
Internship (1)
      |
      |------< Deliverable (N)
```

---

## Candidate → Deliverable

Relationship

```
Candidate (1)
      |
      |------< Deliverable (N)
```

Represents

```
submitted_by
```

---

## Supervisor → Deliverable

Relationship

```
Supervisor (1)
       |
       |------< Deliverable (N)
```

Represents

```
validated_by
```

---

## Internship → Evaluation

Relationship

```
Internship (1)
      |
      |------< Evaluation (N)
```

---

## Supervisor → Evaluation

Relationship

```
Supervisor (1)
       |
       |------< Evaluation (N)
```

Represents

```
evaluated_by
```

---

## Evaluation → EvaluationScore

Relationship

```
Evaluation (1)
      |
      |------< EvaluationScore (N)
```

---

## EvaluationCriterion → EvaluationScore

Relationship

```
Criterion (1)
      |
      |------< EvaluationScore (N)
```

Each score corresponds to one criterion.

---

# Comment System

The comment system is polymorphic.

A comment may belong to:

- Journal Entry
- Deliverable
- Evaluation

Database fields

```
target_type
target_id
```

Example

```
target_type = JOURNAL_ENTRY

target_id = UUID
```

The backend validates references.

No SQL foreign key is used because PostgreSQL does not support polymorphic FK constraints.

---

# Document Management

---

## Internship → Document

Relationship

```
Internship (1)
      |
      |------< Document (N)
```

Documents include

- Convention
- Certificate
- Assignment Letter

---

## InternshipApplication → ApplicationDocument

Relationship

```
Application (1)
      |
      |------< ApplicationDocument (N)
```

Applicants upload several documents.

---

# Notification System

---

## Notification → NotificationRecipient

Relationship

```
Notification (1)
       |
       |------< NotificationRecipient (N)
```

One notification can target

- one user

or

- many users

or

- one department

or

- one role

---

# Financial Management

---

## Internship → Payment

Relationship

```
Internship (1)
      |
      |------< Payment (N)
```

Usually

```
One payment

Future versions may support multiple installments.
```

---

## Employee → Payment

Relationship

```
Employee (1)
      |
      |------< Payment (N)
```

Represents

```
approved_by
```

---

# Inheritance Strategy

The project uses **JOINED TABLE INHERITANCE**.

Advantages

- normalization
- extensibility
- strong integrity
- compatibility with Spring Boot JPA

---

## Employee Hierarchy

```
User
 │
 └──────── Employee
              │
      ├──────────── Supervisor
      ├──────────── HRManager
      ├──────────── FinanceManager
      ├──────────── Director
      └──────────── Administrator
```

---

## Document Hierarchy

```
Document
    │
    ├──────── InternshipConvention
    ├──────── AssignmentLetter
    ├──────── InternshipCertificate
    └──────── ApplicationDocument
```

---

# Cascade Policy Summary

| Relationship | Delete Policy |
|--------------|---------------|
| User → RefreshToken | CASCADE |
| User → Session | CASCADE |
| User → AuditLog | SET NULL |
| Department → Employee | RESTRICT |
| Candidate → Applications | RESTRICT |
| Internship → Assignments | RESTRICT |
| Internship → Journal | CASCADE |
| Journal → Entries | CASCADE |
| Internship → Tasks | CASCADE |
| Internship → Deliverables | CASCADE |
| Internship → Evaluations | CASCADE |
| Evaluation → Scores | CASCADE |
| Internship → Documents | CASCADE |
| Notification → Recipients | CASCADE |
| Role → Users | RESTRICT |

---

# Referential Integrity Rules

The database enforces the following principles:

- Every foreign key is indexed.
- UUIDs are used as primary keys across all tables.
- Junction tables use composite primary keys where applicable.
- Nullable foreign keys are allowed only when required by business rules.
- Soft deletion is preferred for critical business entities.
- Historical data must remain traceable.
- Audit records are never physically removed.
- Cascading deletes are limited to dependent child entities only.
- Business aggregates maintain ownership of their child records.

---

# Conclusion

The relationship model is designed according to Domain-Driven Design (DDD) principles and emphasizes consistency, traceability, and long-term maintainability.

It preserves clear aggregate boundaries, enforces referential integrity, minimizes data duplication, and supports future evolution of the platform while remaining fully compatible with Spring Boot, Hibernate/JPA, PostgreSQL, and Clean Architecture.