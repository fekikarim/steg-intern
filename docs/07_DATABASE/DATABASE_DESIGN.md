# Database Design Documentation

## 1. Overview

The database layer represents the persistence foundation of the **Intelligent Internship Management and Administrative Workflow Platform of STEG**.

The database is designed to support:

- Internship lifecycle management.
- Candidate applications.
- Administrative workflows.
- Document management.
- User authentication and authorization.
- Internship monitoring.
- Financial management.
- Communication and notifications.
- Audit and traceability.

The database follows a relational approach using:

- **Database Management System:** PostgreSQL
- **Architecture Style:** Relational Database + Domain Driven Design principles
- **Identifier Strategy:** UUID primary keys
- **Data Integrity:** Foreign keys, constraints, indexes
- **Security:** Controlled access through backend services only.

---

# 2. Database Objectives

The database must:

- Centralize all internship-related information.
- Guarantee data consistency between all client applications.
- Support multiple user roles.
- Maintain complete historical traceability.
- Enable future extension with additional administrative modules.
- Provide optimized queries for dashboards and reporting.
- Support secure document storage metadata management.

---

# 3. Database Architecture Overview


The database is consumed exclusively through the Spring Boot REST API.

Architecture:

             Next.js
          Front Office

                |
                |

             Angular
          Back Office

                |
                |

             Flutter
        Internship Companion

                |
                |

         Spring Boot API

                |
                |

          PostgreSQL Database


The database does not expose direct access to client applications.

All business rules are handled by the backend layer.

---

# 4. Database Design Principles

## 4.1 UUID Primary Keys

All main entities use UUID identifiers.

Advantages:

- Distributed generation.
- Better security than incremental IDs.
- Easier synchronization between systems.
- Suitable for microservice evolution.


Example:


user_id UUID PRIMARY KEY



---

## 4.2 Normalization

The database follows relational normalization principles.

Target:

- Reduce data duplication.
- Improve consistency.
- Simplify maintenance.

Mainly:

- Third Normal Form (3NF).


---

## 4.3 Aggregate Root Persistence

Domain aggregate roots become main database entities.

Main aggregates:

| Aggregate | Main Table |
|-|-|
| User Management | users |
| Internship Management | internships |
| Candidate Management | candidates |
| Workflow Engine | workflows |
| Document Management | documents |
| Payment Management | payments |
| Notification System | notifications |


---

# 5. Database Domains

The database is organized into functional domains.

---

# 5.1 Identity and Access Management Domain


Responsible for authentication and authorization.

Main tables:


users
roles
permissions
refresh_tokens
sessions
audit_logs



Responsibilities:

- User authentication.
- Role management.
- Permission control.
- Session tracking.
- Security auditing.


---

# 5.2 Organization Management Domain


Responsible for STEG organizational structure.


Tables:


departments
employees
supervisors



Responsibilities:

- Manage internal employees.
- Associate supervisors with departments.
- Handle internship supervision.


---

# 5.3 Internship Management Domain


Core business domain.


Tables:


candidates
internship_applications
internships
internship_assignments



Responsibilities:

- Candidate registration.
- Internship requests.
- Internship lifecycle.
- Department assignment.
- Supervisor assignment.


---

# 5.4 Workflow Management Domain


Handles administrative validation processes.


Tables:


workflows
workflow_steps
workflow_actions



Responsibilities:

- Approval workflows.
- Validation processes.
- Decision tracking.
- Administrative traceability.


---

# 5.5 Internship Companion Domain


Supports daily internship activities.


Tables:


internship_journals
journal_entries
tasks
deliverables
evaluations
evaluation_criteria
evaluation_scores
comments



Responsibilities:

- Daily monitoring.
- Task management.
- Deliverable submission.
- Supervisor evaluation.


---

# 5.6 Document Management Domain


Handles all administrative documents.


Tables:


documents
application_documents



Responsibilities:

- Document storage metadata.
- Generated documents.
- Uploaded documents.
- Version management.


Actual files are stored externally.

Database stores:

- Storage key.
- Bucket.
- Object identifier.
- Metadata.


---

# 5.7 Communication Domain


Handles notifications.


Tables:


notifications
notification_recipients



Responsibilities:

- User notifications.
- Push notifications.
- Email notifications.
- In-app notifications.


---

# 5.8 Financial Domain


Handles internship indemnities.


Tables:


payments



Responsibilities:

- Payment tracking.
- Validation workflow.
- Payment status management.


---

# 6. Naming Conventions


## Tables

Convention:


snake_case
plural names



Examples:


users

internship_applications

workflow_actions



---

## Columns


Convention:


snake_case



Examples:


created_at

updated_at

employee_number



---

## Primary Keys


Format:


{id}_id



Example:


user_id
internship_id



---

## Foreign Keys


Format:


referenced_table_singular_id



Example:


user_id

department_id

internship_id



---

# 7. Common Audit Columns


Most entities contain:


```sql
created_at TIMESTAMP NOT NULL;

updated_at TIMESTAMP NOT NULL; 
```

Purpose:

Trace creation.
Track modifications.
Support auditing.

---

# 8. Enumerations Strategy

Business enumerations are stored using PostgreSQL ENUM types or controlled VARCHAR values.

Examples:

Application status:

DRAFT 
SUBMITTED 
UNDER_REVIEW 
ACCEPTED 
REJECTED 

Internship status:

PLANNED 
ACTIVE 
COMPLETED 
CANCELLED 
ARCHIVED 

---

# 9. File Storage Strategy

The database does not store binary files.

Only metadata is stored.

Example:

documents table:

---

document_id

storage_key

bucket

object_id

mime_type

size

checksum

version

Possible future storage:

MinIO
AWS S3
Azure Blob Storage

---

# 10. Transaction Management

Critical operations must execute inside database transactions.

Examples:

Internship Acceptance

Transaction:

Create internship
        |
Assign department
        |
Assign supervisor
        |
Generate documents
        |
Create workflow history

If one operation fails:

ROLLBACK

---

# 11. Performance Strategy

Optimization techniques:

Indexing frequently searched fields.
Pagination for large datasets.
Query optimization.
Lazy loading relationships.
Database constraints.

Examples:

Frequently searched:

candidate.email

internship.reference

user.email

workflow.status 

---

# 12. Security Considerations

Database security rules:

No direct client access.
Credentials stored securely.
Principle of least privilege.
Encrypted connections.
Regular backups.
Audit logs enabled.

---

# 13. Future Evolution

The database is designed to support future modules:

Possible extensions:

leave_management

internal_requests

procurement

employee_training

electronic_signature

ai_document_processing

The current schema provides a reusable foundation for STEG digital transformation.

# Conclusion  

The PostgreSQL database design provides a secure, scalable and maintainable persistence layer for the STEG Internship Management Platform.

The design follows modern engineering principles by combining:

Relational modeling.
Domain Driven Design concepts.
Strong data integrity.
Security practices.
Future extensibility.

It ensures that all applications (Next.js, Angular and Flutter) operate on a single reliable source of truth through the Spring Boot backend.