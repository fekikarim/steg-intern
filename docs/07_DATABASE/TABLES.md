# Database Tables Documentation

## 1. Overview

This document describes the complete PostgreSQL database table structure of the **Intelligent Internship Management and Administrative Workflow Platform of STEG**.

The schema is derived from the domain master class diagram and represents all persistent entities required by:

- Next.js Front Office.
- Angular Back Office.
- Flutter Internship Companion.
- Spring Boot REST API.

The database follows:

- PostgreSQL relational modeling.
- UUID-based identification.
- Domain Driven Design principles.
- Strong relational constraints.
- Auditability requirements.

---

# 2. Database Schema Organization

The database is divided into the following domains:


01_identity_access
02_organization
03_internship_management
04_workflow_engine
05_internship_companion
06_document_management
07_communication
08_financial_management
09_audit_tracking


---

# 3. Identity and Access Management Tables

---

# 3.1 users

## Description

Main authentication table containing all platform users.

Users can represent:

- Administrators.
- HR managers.
- Supervisors.
- Finance managers.
- Directors.
- Candidates.
- Interns.

---

## Structure

| Column | Type | Constraints | Description |
|-|-|-|-|
| user_id | UUID | PK | Unique identifier |
| role_id | UUID | FK | Assigned role |
| email | VARCHAR(255) | UNIQUE NOT NULL | User email |
| password_hash | VARCHAR(255) | NOT NULL | Encrypted password |
| enabled | BOOLEAN | NOT NULL | Account status |
| status | VARCHAR | NOT NULL | ACTIVE, INACTIVE, LOCKED |
| created_at | TIMESTAMP | NOT NULL | Creation date |
| updated_at | TIMESTAMP | NOT NULL | Last update |

---

# 3.2 roles

## Description

Defines user roles and access levels.

---

## Structure

| Column | Type | Constraints |
|-|-|-|
| role_id | UUID | PK |
| name | VARCHAR(100) | UNIQUE |
| description | TEXT | |

---

Examples:


ADMINISTRATOR

HR_MANAGER

SUPERVISOR

FINANCE_MANAGER

DIRECTOR

INTERN


---

# 3.3 permissions

## Description

Defines detailed authorization permissions.

---

## Structure

| Column | Type | Constraints |
|-|-|-|
| permission_id | UUID | PK |
| code | VARCHAR(100) | UNIQUE |
| description | TEXT | |

---

Example:


USER_MANAGE

INTERNSHIP_VALIDATE

DOCUMENT_GENERATE

PAYMENT_APPROVE


---

# 3.4 role_permissions

## Description

Association table implementing Role-Based Access Control.

---

## Structure

| Column | Type |
|-|-|
| role_id | UUID FK |
| permission_id | UUID FK |

Primary Key:


(role_id, permission_id)


---

# 3.5 refresh_tokens

## Description

Stores JWT refresh tokens.

---

## Structure

| Column | Type |
|-|-|
| refresh_token_id | UUID PK |
| user_id | UUID FK |
| token | VARCHAR |
| expiry_date | TIMESTAMP |
| revoked | BOOLEAN |

---

# 3.6 sessions

## Description

Tracks authenticated sessions.

---

## Structure

| Column | Type |
|-|-|
| session_id | UUID PK |
| user_id | UUID FK |
| access_token | VARCHAR |
| ip_address | VARCHAR |
| user_agent | VARCHAR |
| login_at | TIMESTAMP |
| expires_at | TIMESTAMP |

---

# 4. Organization Management Tables

---

# 4.1 departments

## Description

Represents STEG organizational units.

---

## Structure

| Column | Type |
|-|-|
| department_id | UUID PK |
| code | VARCHAR |
| name | VARCHAR |
| description | TEXT |

---

# 4.2 employees

## Description

Base employee entity.

---

## Structure

| Column | Type |
|-|-|
| employee_id | UUID PK |
| user_id | UUID FK |
| department_id | UUID FK |
| first_name | VARCHAR |
| last_name | VARCHAR |
| phone_number | VARCHAR |
| employee_number | VARCHAR UNIQUE |
| hire_date | DATE |

---

# 4.3 supervisors

## Description

Specialized employee entity responsible for internship supervision.

---

## Structure

| Column | Type |
|-|-|
| supervisor_id | UUID PK |
| employee_id | UUID FK |
| position | VARCHAR |

---

# 5. Internship Management Tables

---

# 5.1 candidates

## Description

Stores student information before internship assignment.

---

## Structure

| Column | Type |
|-|-|
| candidate_id | UUID PK |
| user_id | UUID FK |
| national_id | VARCHAR |
| first_name | VARCHAR |
| last_name | VARCHAR |
| contact_email | VARCHAR |
| phone | VARCHAR |
| address | TEXT |
| university | VARCHAR |
| speciality | VARCHAR |
| diploma | VARCHAR |
| cv_file_path | VARCHAR |
| skills | TEXT |
| languages | TEXT |

---

# 5.2 internship_applications

## Description

Stores internship requests.

---

## Structure

| Column | Type |
|-|-|
| application_id | UUID PK |
| candidate_id | UUID FK |
| reference | VARCHAR UNIQUE |
| status | VARCHAR |
| submitted_online | BOOLEAN |
| submission_date | DATE |

---

Statuses:


DRAFT

SUBMITTED

UNDER_REVIEW

ACCEPTED

REJECTED


---

# 5.3 internships

## Description

Main internship entity.

---

## Structure

| Column | Type |
|-|-|
| internship_id | UUID PK |
| candidate_id | UUID FK |
| reference | VARCHAR UNIQUE |
| start_date | DATE |
| end_date | DATE |
| status | VARCHAR |

---

Statuses:


PLANNED

ACTIVE

COMPLETED

CANCELLED

ARCHIVED


---

# 5.4 internship_assignments

## Description

Handles internship allocation.

---

## Structure

| Column | Type |
|-|-|
| assignment_id | UUID PK |
| internship_id | UUID FK |
| department_id | UUID FK |
| supervisor_id | UUID FK |
| assigned_by | UUID FK |
| assignment_date | DATE |
| status | VARCHAR |

---

# 6. Workflow Engine Tables

---

# 6.1 workflows

## Description

Represents administrative workflows.

---

## Structure

| Column | Type |
|-|-|
| workflow_id | UUID PK |
| name | VARCHAR |
| status | VARCHAR |
| entity_type | VARCHAR |
| entity_id | UUID |

---

# 6.2 workflow_steps

## Description

Workflow execution steps.

---

## Structure

| Column | Type |
|-|-|
| workflow_step_id | UUID PK |
| workflow_id | UUID FK |
| name | VARCHAR |
| sequence | INTEGER |

---

# 6.3 workflow_actions

## Description

Stores validation and approval actions.

---

## Structure

| Column | Type |
|-|-|
| action_id | UUID PK |
| workflow_step_id | UUID FK |
| performed_by | UUID FK |
| type | VARCHAR |
| decision | VARCHAR |
| comment | TEXT |
| remarks | TEXT |
| ip_address | VARCHAR |
| performed_at | TIMESTAMP |

---

# 7. Internship Companion Tables

---

# 7.1 internship_journals

| Column | Type |
|-|-|
| journal_id | UUID PK |
| internship_id | UUID FK |
| created_date | DATE |

---

# 7.2 journal_entries

| Column | Type |
|-|-|
| entry_id | UUID PK |
| journal_id | UUID FK |
| title | VARCHAR |
| description | TEXT |
| status | VARCHAR |
| entry_date | DATE |

---

# 7.3 tasks

| Column | Type |
|-|-|
| task_id | UUID PK |
| internship_id | UUID FK |
| title | VARCHAR |
| description | TEXT |
| status | VARCHAR |
| due_date | DATE |

---

# 7.4 deliverables

| Column | Type |
|-|-|
| deliverable_id | UUID PK |
| internship_id | UUID FK |
| candidate_id | UUID FK |
| title | VARCHAR |
| description | TEXT |
| status | VARCHAR |
| storage_key | VARCHAR |
| bucket | VARCHAR |
| object_id | VARCHAR |
| checksum | VARCHAR |
| mime_type | VARCHAR |
| size | BIGINT |
| version | INTEGER |
| submitted_date | DATE |
| validated_at | TIMESTAMP |

---

# 7.5 evaluations

| Column | Type |
|-|-|
| evaluation_id | UUID PK |
| internship_id | UUID FK |
| supervisor_id | UUID FK |
| type | VARCHAR |
| evaluation_date | DATE |
| feedback | TEXT |

---

# 7.6 evaluation_criteria

| Column | Type |
|-|-|
| criterion_id | UUID PK |
| name | VARCHAR |
| description | TEXT |
| weight | DOUBLE |
| max_score | DOUBLE |

---

# 7.7 evaluation_scores

| Column | Type |
|-|-|
| score_id | UUID PK |
| evaluation_id | UUID FK |
| criterion_id | UUID FK |
| score | DOUBLE |
| comment | TEXT |

---

# 7.8 comments

| Column | Type |
|-|-|
| comment_id | UUID PK |
| author_id | UUID FK |
| content | TEXT |
| created_at | TIMESTAMP |
| target_type | VARCHAR |
| target_id | UUID |

---

# 8. Document Management Tables

---

# 8.1 documents

## Description

Central document metadata table.

---

| Column | Type |
|-|-|
| document_id | UUID PK |
| reference | VARCHAR |
| type | VARCHAR |
| storage_key | VARCHAR |
| bucket | VARCHAR |
| object_id | VARCHAR |
| checksum | VARCHAR |
| mime_type | VARCHAR |
| size | BIGINT |
| version | INTEGER |
| generated_automatically | BOOLEAN |
| created_date | DATE |

---

# 8.2 application_documents

| Column | Type |
|-|-|
| application_document_id | UUID PK |
| application_id | UUID FK |
| file_name | VARCHAR |
| mandatory | BOOLEAN |

---

# 9. Communication Tables

---

# 9.1 notifications

| Column | Type |
|-|-|
| notification_id | UUID PK |
| title | VARCHAR |
| message | TEXT |
| type | VARCHAR |
| priority | VARCHAR |
| related_entity_type | VARCHAR |
| related_entity_id | UUID |
| sent_at | TIMESTAMP |
| created_at | TIMESTAMP |

---

# 9.2 notification_recipients

| Column | Type |
|-|-|
| recipient_id | UUID PK |
| notification_id | UUID FK |
| recipient_type | VARCHAR |
| user_id | UUID |
| read | BOOLEAN |
| read_at | TIMESTAMP |

---

# 10. Financial Management Tables

---

# 10.1 payments

| Column | Type |
|-|-|
| payment_id | UUID PK |
| internship_id | UUID FK |
| approved_by | UUID FK |
| reference | VARCHAR |
| amount | DECIMAL |
| currency | VARCHAR |
| status | VARCHAR |
| payment_method | VARCHAR |
| payment_date | DATE |
| approved_at | TIMESTAMP |

---

# 11. Audit Tables

---

# 11.1 audit_logs

## Description

Stores all important system changes.

---

| Column | Type |
|-|-|
| audit_id | UUID PK |
| user_id | UUID FK |
| action | VARCHAR |
| entity_name | VARCHAR |
| entity_id | UUID |
| old_value | JSONB |
| new_value | JSONB |
| created_at | TIMESTAMP |

---

# 12. Final Database Structure Summary


Total main tables:


users
roles
permissions
role_permissions
refresh_tokens
sessions

departments
employees
supervisors

candidates
internship_applications
internships
internship_assignments

workflows
workflow_steps
workflow_actions

internship_journals
journal_entries
tasks
deliverables
evaluations
evaluation_criteria
evaluation_scores
comments

documents
application_documents

notifications
notification_recipients

payments

audit_logs



---

# Conclusion

This table design represents the complete persistence model of the STEG Internship Management Platform.

It provides:

- Clear domain separation.
- Strong relational consistency.
- Complete traceability.
- Support for all three client applications.
- Scalability for future digital transformation modules.