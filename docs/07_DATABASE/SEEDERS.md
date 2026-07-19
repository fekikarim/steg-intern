# SEEDERS.md

# Database Seeders

**Project:** Intelligent Internship & Administrative Workflow Management Platform  
**Organization:** STEG (Société Tunisienne de l'Électricité et du Gaz)  
**Database:** PostgreSQL  
**Backend:** Spring Boot 3  
**ORM:** Hibernate / JPA  
**Migration Tool:** Flyway  
**Version:** 1.0

---

# Purpose

Seeders populate the database with the minimum required data for the application to function correctly.

Unlike migrations, which define the database structure, seeders insert reference and initialization data that remains relatively stable over time.

The objectives are to:

- initialize the application
- simplify development
- standardize test environments
- provide default business configuration
- reduce manual database setup

---

# Seeder Philosophy

The project distinguishes three categories of data:

| Type | Managed By |
|--------|------------|
| Database Structure | Flyway Migrations |
| Reference Data | Seeders |
| Business Data | Application |

Only stable and reusable data should be seeded.

Examples include:

- Roles
- Permissions
- Departments
- Evaluation Criteria
- Workflow Templates

Business data such as candidates, internships, or payments must never be seeded.

---

# Seeder Execution

Seeders are executed **after all Flyway migrations** have completed successfully.

Application Startup

```
Application Starts
        │
        ▼
Flyway Migrations
        │
        ▼
Database Schema Ready
        │
        ▼
Seeders Execute
        │
        ▼
Application Available
```

---

# Seeder Organization

```
database/

seeders/
│
├── RoleSeeder
├── PermissionSeeder
├── DepartmentSeeder
├── EvaluationCriteriaSeeder
├── WorkflowSeeder
├── AdministratorSeeder
└── DemoSeeder (Development Only)
```

---

# Seeder Rules

Every seeder must:

- be idempotent
- verify existing data before insertion
- avoid duplicate records
- use business identifiers instead of generated IDs when possible
- be independent from execution order whenever feasible
- produce identical results across environments

---

# Seeded Data

---

# Roles

The platform creates the default user roles required by the authorization system.

| Role |
|-------|
| ADMINISTRATOR |
| DIRECTOR |
| HR_MANAGER |
| FINANCE_MANAGER |
| SUPERVISOR |
| CANDIDATE |

These roles are permanent system entities.

---

# Permissions

Every secured feature is represented by a permission.

Examples:

```
USER_READ

USER_CREATE

USER_UPDATE

USER_DELETE

ROLE_READ

ROLE_UPDATE

APPLICATION_CREATE

APPLICATION_READ

APPLICATION_APPROVE

APPLICATION_REJECT

INTERNSHIP_ASSIGN

INTERNSHIP_UPDATE

DOCUMENT_UPLOAD

DOCUMENT_GENERATE

DOCUMENT_DOWNLOAD

WORKFLOW_READ

WORKFLOW_VALIDATE

PAYMENT_READ

PAYMENT_APPROVE

PAYMENT_MANAGE

NOTIFICATION_SEND

REPORT_VIEW

AUDIT_VIEW

SYSTEM_CONFIGURATION
```

Permissions follow the convention:

```
RESOURCE_ACTION
```

Examples

```
USER_CREATE

TASK_UPDATE

DOCUMENT_DELETE

PAYMENT_APPROVE
```

---

# Role Permissions

Each role receives its default permissions.

Example

Administrator

```
ALL PERMISSIONS
```

HR Manager

```
Candidate Management

Applications

Internships

Documents

Reports
```

Supervisor

```
View Assigned Internships

Validate Journal

Validate Deliverables

Evaluate Intern

Write Comments
```

Candidate

```
Submit Application

Upload Documents

Consult Notifications

View Internship Progress

Manage Journal

Upload Deliverables
```

---

# Departments

Default STEG departments are initialized.

Example

```
Human Resources

Finance

Information Systems

Administration

Technical Department

Electrical Engineering

Gas Distribution

Network Operations
```

Departments may later be synchronized with the official organizational structure.

---

# Evaluation Criteria

Default evaluation criteria are inserted.

Example

| Criterion | Weight |
|------------|--------|
| Technical Skills | 30% |
| Quality of Work | 20% |
| Autonomy | 15% |
| Communication | 10% |
| Teamwork | 10% |
| Attendance | 10% |
| Professional Behavior | 5% |

The sum of all weights must equal **100%**.

---

# Workflow Templates

Standard workflows are initialized.

Examples

### Internship Application

```
Submission

↓

HR Review

↓

Department Approval

↓

Supervisor Assignment

↓

Final Validation
```

---

### Internship Completion

```
Journal Validation

↓

Deliverable Validation

↓

Final Evaluation

↓

Certificate Generation

↓

Archive
```

---

### Payment Workflow

```
Payment Request

↓

HR Validation

↓

Finance Approval

↓

Payment Processing

↓

Archive
```

---

# System Administrator

One administrator account is automatically created during the initial deployment.

Example

```
Email

admin@steg.tn
```

The password must be changed immediately after the first login.

In production, credentials must be supplied through secure environment variables.

---

# Development Demo Data

Development environments may include optional demonstration data.

Examples

- Demo candidates
- Demo internships
- Demo supervisors
- Demo journals
- Demo deliverables
- Demo notifications

These records help developers test features without creating data manually.

Demo data must never be deployed to production.

---

# Seeder Execution Order

```
1. RoleSeeder

↓

2. PermissionSeeder

↓

3. RolePermissionSeeder

↓

4. DepartmentSeeder

↓

5. EvaluationCriteriaSeeder

↓

6. WorkflowSeeder

↓

7. AdministratorSeeder

↓

8. DemoSeeder (Development Only)
```

---

# Environment Strategy

## Development

Seed:

- Roles
- Permissions
- Departments
- Evaluation Criteria
- Workflow Templates
- Administrator
- Demo Data

---

## Testing

Seed:

- Roles
- Permissions
- Departments
- Evaluation Criteria
- Workflow Templates
- Test Administrator

No demo business data unless explicitly required by automated tests.

---

## Production

Seed:

- Roles
- Permissions
- Departments
- Evaluation Criteria
- Workflow Templates
- Initial Administrator

Demo data is strictly prohibited.

---

# Idempotency

Every seeder must check whether the target data already exists before inserting new records.

Example

```
IF role "ADMINISTRATOR" exists

DO NOTHING

ELSE

INSERT role
```

This guarantees that repeated executions never create duplicates.

---

# Best Practices

- Keep seeders small and focused.
- Seed only immutable or reference data.
- Never seed sensitive production information.
- Never hardcode production credentials.
- Store secrets in environment variables.
- Ensure seeders are repeatable and deterministic.
- Keep business data outside of seeders.
- Document every new reference dataset.

---

# Future Seeders

Additional seeders may be introduced as the platform evolves.

Examples

- Notification Templates
- Email Templates
- Application Status Templates
- Internship Types
- Academic Institutions
- Specializations
- Languages
- Skills Catalog
- Document Categories
- Dashboard Widgets
- AI Configuration Parameters

---

# Conclusion

The seeding strategy provides a reliable and reproducible initialization process for the platform by supplying all required reference data while keeping business data separate. Through idempotent execution, environment-specific behavior, and clear separation of concerns, seeders ensure consistent application behavior across development, testing, and production environments and align with enterprise best practices for Spring Boot, PostgreSQL, Flyway, and Domain-Driven Design.