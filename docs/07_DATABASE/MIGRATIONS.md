# MIGRATIONS.md

# Database Migration Strategy

**Project:** Intelligent Internship & Administrative Workflow Management Platform  
**Organization:** STEG (Société Tunisienne de l'Électricité et du Gaz)  
**Database:** PostgreSQL  
**Migration Tool:** Flyway  
**Backend:** Spring Boot 3  
**Version:** 1.0

---

# Purpose

This document defines the database migration strategy used by the project.

Database migrations ensure that:

- every developer has the exact same database schema
- production environments remain synchronized
- schema evolution is versioned
- deployments are reproducible
- rollback risks are minimized
- database history is fully traceable

This project follows the **Database as Code** principle.

---

# Migration Tool

The project uses **Flyway** as the migration framework.

Reasons:

- Official Spring Boot support
- Version-controlled SQL scripts
- Reliable execution order
- Easy CI/CD integration
- Production-ready
- Lightweight
- Widely adopted in enterprise applications

---

# Migration Folder Structure

```
src/
└── main/
    └── resources/
        └── db/
            └── migration/
```

Example

```
db/
└── migration/
    ├── V1__Create_identity_tables.sql
    ├── V2__Create_organization_tables.sql
    ├── V3__Create_candidate_tables.sql
    ├── V4__Create_workflow_tables.sql
    ├── V5__Create_document_tables.sql
    ├── V6__Create_mobile_tables.sql
    ├── V7__Create_notification_tables.sql
    ├── V8__Create_payment_tables.sql
    ├── V9__Insert_default_roles.sql
    └── V10__Insert_default_permissions.sql
```

---

# Naming Convention

Every migration follows the Flyway naming convention.

```
V<version>__<description>.sql
```

Examples

```
V1__Create_identity_tables.sql

V2__Create_candidate_tables.sql

V3__Create_workflow_tables.sql

V4__Add_notification_indexes.sql

V5__Insert_default_permissions.sql
```

Rules

- Version starts at 1
- Versions are incremental
- Description uses underscores
- Description is concise
- One responsibility per migration

---

# Migration Philosophy

Each migration must represent **one logical database change**.

Good examples

```
Create Users

Create Roles

Create Internship Tables

Create Workflow Tables

Insert Default Roles

Insert Permissions

Create Indexes
```

Avoid combining unrelated changes in the same migration.

---

# Initial Migration Plan

---

## V1

```
Create Identity & Access Management
```

Creates

- users
- roles
- permissions
- role_permissions
- refresh_tokens
- sessions
- audit_logs

---

## V2

```
Create Organization Module
```

Creates

- departments
- employees
- supervisors
- hr_managers
- finance_managers
- directors
- administrators

---

## V3

```
Create Internship Management
```

Creates

- candidates
- internship_applications
- internships
- internship_assignments

---

## V4

```
Create Workflow Engine
```

Creates

- workflows
- workflow_steps
- workflow_actions

---

## V5

```
Create Internship Companion
```

Creates

- internship_journals
- journal_entries
- tasks
- deliverables
- evaluations
- evaluation_criteria
- evaluation_scores
- comments

---

## V6

```
Create Document Module
```

Creates

- documents
- internship_conventions
- assignment_letters
- internship_certificates
- application_documents

---

## V7

```
Create Notification Module
```

Creates

- notifications
- notification_recipients

---

## V8

```
Create Financial Module
```

Creates

- payments

---

## V9

```
Insert Default Roles
```

Seeds

- ADMINISTRATOR
- DIRECTOR
- HR_MANAGER
- FINANCE_MANAGER
- SUPERVISOR
- CANDIDATE

---

## V10

```
Insert Default Permissions
```

Seeds

All application permissions.

Example

```
USER_READ

USER_CREATE

USER_UPDATE

USER_DELETE

APPLICATION_APPROVE

PAYMENT_VALIDATE

DOCUMENT_GENERATE
```

---

## V11

```
Assign Permissions To Roles
```

Creates

```
role_permissions
```

data.

---

## V12

```
Create Performance Indexes
```

Adds

- indexes
- composite indexes
- unique indexes
- partial indexes

---

# Schema Evolution Rules

Every schema modification requires a new migration.

Examples

```
Add column

Rename column

Drop column

Modify constraint

Create table

Create index

Drop index

Add foreign key

Modify enum
```

Never modify old migrations.

---

# Immutable Migrations

Once a migration has been executed in production:

- never edit it
- never rename it
- never reorder it
- never delete it

Instead:

Create a new migration.

Example

Incorrect

```
Edit V4
```

Correct

```
V13__Add_phone_number_to_candidates.sql
```

---

# Rollback Strategy

Flyway Community Edition does not provide automatic rollback scripts.

Rollback is handled through forward migrations.

Example

Migration

```
V15__Add_new_column.sql
```

Rollback

```
V16__Remove_new_column.sql
```

This ensures a complete and auditable history of schema changes.

---

# Data Migrations

Schema migrations and data migrations must remain separated.

Example

Schema

```
Create payment table
```

Data

```
Insert default payment statuses
```

Never mix schema creation with large business data updates.

---

# Migration Validation

Flyway validates

- checksum
- execution order
- migration history
- duplicate versions
- missing migrations

The migration history is stored in

```
flyway_schema_history
```

This table must never be modified manually.

---

# Migration Execution

During application startup

```
Spring Boot
        ↓
Flyway Validation
        ↓
Pending Migrations
        ↓
Database Update
        ↓
Application Starts
```

If a migration fails:

- application startup is aborted
- no partial deployment is allowed

---

# Development Workflow

When introducing a database change:

1. Update the domain model.
2. Create a new Flyway migration.
3. Apply the migration locally.
4. Verify constraints and indexes.
5. Update the JPA entities if necessary.
6. Commit the migration to version control.
7. Submit for code review.
8. Deploy through the CI/CD pipeline.

---

# Best Practices

- One migration = one logical change.
- Keep migrations small and readable.
- Use explicit SQL instead of generated SQL.
- Name constraints and indexes consistently.
- Add comments for complex operations.
- Test migrations on a clean database.
- Test migrations on an existing database.
- Never delete executed migrations.
- Never bypass Flyway with manual SQL.
- Keep migration files under version control.
- Ensure migrations are deterministic and idempotent when appropriate.

---

# Example Migration Timeline

| Version | Description |
|----------|-------------|
| V1 | Create Identity Tables |
| V2 | Create Organization Tables |
| V3 | Create Internship Tables |
| V4 | Create Workflow Tables |
| V5 | Create Internship Companion Tables |
| V6 | Create Document Tables |
| V7 | Create Notification Tables |
| V8 | Create Payment Tables |
| V9 | Insert Default Roles |
| V10 | Insert Default Permissions |
| V11 | Assign Role Permissions |
| V12 | Create Performance Indexes |

---

# Conclusion

The migration strategy guarantees a controlled and reproducible evolution of the PostgreSQL schema throughout the project's lifecycle. By adopting Flyway, immutable versioned SQL scripts, and a strict migration workflow, the platform ensures consistency across development, testing, and production environments while maintaining full traceability and compatibility with Spring Boot, Hibernate/JPA, and modern DevOps practices.