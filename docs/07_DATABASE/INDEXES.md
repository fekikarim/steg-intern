# Database Indexes Documentation

## 1. Overview

This document defines the indexing strategy of the PostgreSQL database for the **Intelligent Internship Management and Administrative Workflow Platform of STEG**.

Indexes are designed to:

- Improve query performance.
- Optimize search operations.
- Accelerate dashboard loading.
- Improve filtering and sorting operations.
- Support scalability with increasing amounts of internship data.
- Maintain efficient access for all platform applications.

The indexing strategy is based on:

- Expected business queries.
- User navigation patterns.
- Backend service requirements.
- Administrative reporting needs.


---

# 2. Indexing Principles


## 2.1 Primary Keys

All tables automatically receive indexes on their primary keys.

Example:

```sql
PRIMARY KEY (user_id)
```

Generated PostgreSQL index:

```sql
users_pkey
```

Purpose:

Fast entity lookup.
Referential integrity optimization.

## 2.2 Foreign Key Indexing

Foreign keys are indexed because they are frequently used for:

Joins.
Filtering.
Relationship navigation.

Example:

internship_id
candidate_id
department_id

## 2.3 Unique Indexes

Fields requiring uniqueness use unique indexes.

Examples:

Email.
References.
Employee numbers.
Document identifiers.


## 3. Identity and Access Management Indexes

### 3.1 users Table

Email Authentication Index

```sql
CREATE UNIQUE INDEX idx_users_email
ON users(email);
```

Purpose:

Login authentication.
Prevent duplicate accounts.
Status Index

```sql
CREATE INDEX idx_users_status
ON users(status);
```

Used for:

Active users filtering.
Account management.
Role Index

```sql
CREATE INDEX idx_users_role_id
ON users(role_id);
```

Used for:

Permission resolution.
Role-based queries.

### 3.2 roles Table

Role Name Index

```sql
CREATE UNIQUE INDEX idx_roles_name
ON roles(name);
```

Purpose:

Fast role lookup.
Avoid duplicate roles.

### 3.3 permissions Table

Permission Code Index

```sql
CREATE UNIQUE INDEX idx_permissions_code
ON permissions(code);
```

Purpose:

Fast permission validation.

### 3.4 refresh_tokens Table

User Token Lookup

```sql
CREATE INDEX idx_refresh_tokens_user_id
ON refresh_tokens(user_id);
```

Purpose:

Retrieve active user tokens.
Token Search

```sql
CREATE INDEX idx_refresh_tokens_token
ON refresh_tokens(token);
```

Purpose:

Refresh token validation.

### 3.5 sessions Table

User Sessions

```sql
CREATE INDEX idx_sessions_user_id
ON sessions(user_id);
```

Purpose:

Session management.


## 4. Organization Management Indexes

### 4.1 departments Table

Department Code

```sql
CREATE UNIQUE INDEX idx_departments_code
ON departments(code);
```

Purpose:

Department identification.
Department Name

```sql
CREATE INDEX idx_departments_name
ON departments(name);
```

### 4.2 employees Table

Employee Number

```sql
CREATE UNIQUE INDEX idx_employees_number
ON employees(employee_number);
```

Purpose:

Internal STEG employee lookup.
Department Relation

```sql
CREATE INDEX idx_employees_department_id
ON employees(department_id);
```

User Relation

```sql
CREATE UNIQUE INDEX idx_employees_user_id
ON employees(user_id);
```

### 4.3 supervisors Table

Employee Relation

```sql
CREATE UNIQUE INDEX idx_supervisors_employee_id
ON supervisors(employee_id);
```

Purpose:

Retrieve supervisor profile quickly.


## 5. Internship Management Indexes

### 5.1 candidates Table

Candidate Email

```sql
CREATE INDEX idx_candidates_email
ON candidates(contact_email);
```

National ID

```sql
CREATE UNIQUE INDEX idx_candidates_national_id
ON candidates(national_id);
```

Purpose:

Candidate identification.
University Search

```sql
CREATE INDEX idx_candidates_university
ON candidates(university);
```

### 5.2 internship_applications Table

Application Reference

```sql
CREATE UNIQUE INDEX idx_applications_reference
ON internship_applications(reference);
```

Candidate Applications

```sql
CREATE INDEX idx_applications_candidate_id
ON internship_applications(candidate_id);
```

Purpose:

Retrieve candidate history.
Application Status

```sql
CREATE INDEX idx_applications_status
ON internship_applications(status);
```

Purpose:

HR dashboard filtering.
Submission Date

```sql
CREATE INDEX idx_applications_submission_date
ON internship_applications(submission_date);
```

Purpose:

Chronological processing.

### 5.3 internships Table

Internship Reference

```sql
CREATE UNIQUE INDEX idx_internships_reference
ON internships(reference);
```

Candidate Internship History

```sql
CREATE INDEX idx_internships_candidate_id
ON internships(candidate_id);
```

Internship Status

```sql
CREATE INDEX idx_internships_status
ON internships(status);
```

Purpose:

Active internship monitoring.
Date Range Queries

```sql
CREATE INDEX idx_internships_dates
ON internships(start_date,end_date);
```

Purpose:

Planning.
Calendar views.

### 5.4 internship_assignments Table

Internship Assignment

```sql
CREATE INDEX idx_assignments_internship_id
ON internship_assignments(internship_id);
```

Supervisor Assignment

```sql
CREATE INDEX idx_assignments_supervisor_id
ON internship_assignments(supervisor_id);
```

Purpose:

Supervisor dashboard.
Department Assignment

```sql
CREATE INDEX idx_assignments_department_id
ON internship_assignments(department_id);
```


## 6. Workflow Engine Indexes

### 6.1 workflows Table

Entity Tracking

```sql
CREATE INDEX idx_workflows_entity
ON workflows(entity_type,entity_id);
```

Purpose:

Retrieve workflow history.
Workflow Status

```sql
CREATE INDEX idx_workflows_status
ON workflows(status);
```

### 6.2 workflow_steps Table

Workflow Steps

```sql
CREATE INDEX idx_workflow_steps_workflow_id
ON workflow_steps(workflow_id);
```

Step Ordering

```sql
CREATE INDEX idx_workflow_steps_sequence
ON workflow_steps(workflow_id,sequence);
```

### 6.3 workflow_actions Table

Workflow History

```sql
CREATE INDEX idx_workflow_actions_step_id
ON workflow_actions(step_id);
```

User Actions

```sql
CREATE INDEX idx_workflow_actions_user_id
ON workflow_actions(performed_by);
```

Action Date

```sql
CREATE INDEX idx_workflow_actions_date
ON workflow_actions(performed_at);
```


## 7. Internship Companion Indexes

### 7.1 journal_entries

Journal Retrieval

```sql
CREATE INDEX idx_journal_entries_journal_id
ON journal_entries(journal_id);
```

Entry Date

```sql
CREATE INDEX idx_journal_entries_date
ON journal_entries(entry_date);
```

### 7.2 tasks

Internship Tasks

```sql
CREATE INDEX idx_tasks_internship_id
ON tasks(internship_id);
```

Task Status

```sql
CREATE INDEX idx_tasks_status
ON tasks(status);
```

### 7.3 deliverables

Internship Deliverables

```sql
CREATE INDEX idx_deliverables_internship_id
ON deliverables(internship_id);
```

Deliverable Status

```sql
CREATE INDEX idx_deliverables_status
ON deliverables(status);
```

Purpose:

Supervisor validation dashboard.

### 7.4 evaluations

Internship Evaluation

```sql
CREATE INDEX idx_evaluations_internship_id
ON evaluations(internship_id);
```

Supervisor Evaluation

```sql
CREATE INDEX idx_evaluations_supervisor_id
ON evaluations(supervisor_id);
```


## 8. Document Management Indexes

### 8.1 documents

Document Reference

```sql
CREATE UNIQUE INDEX idx_documents_reference
ON documents(reference);
```

Document Type

```sql
CREATE INDEX idx_documents_type
ON documents(type);
```

Storage Lookup

```sql
CREATE INDEX idx_documents_storage_object
ON documents(object_id);
```

### 8.2 application_documents

Application Documents

```sql
CREATE INDEX idx_application_documents_application_id
ON application_documents(application_id);
```

Document Type Filter

```sql
CREATE INDEX idx_application_documents_type
ON application_documents(document_type);
```

### 8.3 internship_documents

Internship Documents

```sql
CREATE INDEX idx_internship_documents_internship_id
ON internship_documents(internship_id);
```

Document Type Filter

```sql
CREATE INDEX idx_internship_documents_type
ON internship_documents(document_type);
```


## 9. Academic Verification Indexes

### 9.1 academic_certifications

Certification Search

```sql
CREATE INDEX idx_certifications_name
ON academic_certifications(name);
```

### 9.2 academic_records

Student Records

```sql
CREATE INDEX idx_academic_records_student_id
ON academic_records(student_id);
```

### 9.3 student_verification_requests

Request Status

```sql
CREATE INDEX idx_verification_requests_status
ON student_verification_requests(status);
```

Student Filter

```sql
CREATE INDEX idx_verification_requests_student_id
ON student_verification_requests(student_id);
```

Verification Date

```sql
CREATE INDEX idx_verification_requests_date
ON student_verification_
```

```sql
CREATE UNIQUE INDEX idx_employees_number
ON employees(employee_number);
```

Purpose:

Internal STEG employee lookup.
Department Relation
```sql
CREATE INDEX idx_employees_department_id
ON employees(department_id);
```
User Relation
```sql
CREATE UNIQUE INDEX idx_employees_user_id
ON employees(user_id);
```

### 4.3 supervisors Table

Employee Relation

```sql
CREATE UNIQUE INDEX idx_supervisors_employee_id
ON supervisors(employee_id);
```

Purpose:

Retrieve supervisor profile quickly.

## 5. Internship Management Indexes

### 5.1 candidates Table

Candidate Email
```sql
CREATE INDEX idx_candidates_email
ON candidates(contact_email);
```

Purpose:

Candidate search.
National ID
```sql
CREATE UNIQUE INDEX idx_candidates_national_id
ON candidates(national_id);
```

Purpose:

Candidate identification.
University Search
```
CREATE INDEX idx_candidates_university
ON candidates(university);
```

### 5.2 internship_applications Table

Application Reference
```sql
CREATE UNIQUE INDEX idx_applications_reference
ON internship_applications(reference);
```

Candidate Applications
```sql
CREATE INDEX idx_applications_candidate_id
ON internship_applications(candidate_id);
```

Purpose:

Retrieve candidate history.
Application Status
```sql
CREATE INDEX idx_applications_status
ON internship_applications(status);
```

Purpose:

HR dashboard filtering.
Submission Date
```sql
CREATE INDEX idx_applications_submission_date
ON internship_applications(submission_date);
```

Purpose:

Chronological processing.

### 5.3 internships Table

Internship Reference
```sql
CREATE UNIQUE INDEX idx_internships_reference
ON internships(reference);
```

Candidate Internship History
```sql
CREATE INDEX idx_internships_candidate_id
ON internships(candidate_id);
```

Internship Status
```sql
CREATE INDEX idx_internships_status
ON internships(status);
```

Purpose:

Active internship monitoring.
Date Range Queries
```sql
CREATE INDEX idx_internships_dates
ON internships(start_date,end_date);
```

Purpose:

Planning.
Calendar views.

### 5.4 internship_assignments Table

Internship Assignment
```sql
CREATE INDEX idx_assignments_internship_id
ON internship_assignments(internship_id);
```

Supervisor Assignment
```sql
CREATE INDEX idx_assignments_supervisor_id
ON internship_assignments(supervisor_id);
```

```sql
CREATE INDEX idx_assignments_supervisor_id
ON internship_assignments(supervisor_id);
```

Purpose:

Supervisor dashboard.
Department Assignment
```sql
CREATE INDEX idx_assignments_department_id
ON internship_assignments(department_id);
```

## 6. Workflow Engine Indexes

### 6.1 workflows Table

Entity Tracking
```sql
CREATE INDEX idx_workflows_entity
ON workflows(entity_type,entity_id);
```

Purpose:

Retrieve workflow history.

Workflow Status
```sql
CREATE INDEX idx_workflows_status
ON workflows(status);
```

### 6.2 workflow_steps Table

Workflow Steps
```sql
CREATE INDEX idx_workflow_steps_workflow_id
ON workflow_steps(workflow_id);
```

Step Ordering
```sql
CREATE INDEX idx_workflow_steps_sequence
ON workflow_steps(workflow_id,sequence);
```

### 6.3 workflow_actions Table

Workflow History
```sql
CREATE INDEX idx_workflow_actions_step_id
ON workflow_actions(workflow_step_id);
```

User Actions
```sql
CREATE INDEX idx_workflow_actions_user_id
ON workflow_actions(performed_by);
```

Action Date
```sql
CREATE INDEX idx_workflow_actions_date
ON workflow_actions(performed_at);
```

## 7. Internship Companion Indexes

### 7.1 journal_entries

Journal Retrieval
```sql
CREATE INDEX idx_journal_entries_journal_id
ON journal_entries(journal_id);
```

Entry Date
```sql
CREATE INDEX idx_journal_entries_date
ON journal_entries(entry_date);
```

### 7.2 tasks

Internship Tasks
```sql
CREATE INDEX idx_tasks_internship_id
ON tasks(internship_id);
```

Task Status
```sql
CREATE INDEX idx_tasks_status
ON tasks(status);
```

### 7.3 deliverables

Internship Deliverables
```sql
CREATE INDEX idx_deliverables_internship_id
ON deliverables(internship_id);
```

Deliverable Status
```sql
CREATE INDEX idx_deliverables_status
ON deliverables(status);
```

Purpose:

Supervisor validation dashboard.

### 7.4 evaluations

Internship Evaluation
```sql
CREATE INDEX idx_evaluations_internship_id
ON evaluations(internship_id);
```

Supervisor Evaluation
```sql
CREATE INDEX idx_evaluations_supervisor_id
ON evaluations(supervisor_id);
```

## 8. Document Management Indexes

### 8.1 documents

Document Reference
```sql
CREATE UNIQUE INDEX idx_documents_reference
ON documents(reference);
```

Document Type
```sql
CREATE INDEX idx_documents_type
ON documents(type);
```

Storage Lookup
```sql
CREATE INDEX idx_documents_storage_object
ON documents(object_id);
```

### 8.2 application_documents

Application Documents
```sql
CREATE INDEX idx_application_documents_application_id
ON application_documents(application_id);
```

## 9. Communication Indexes

### 9.1 notifications

Related Entity Lookup
```sql
CREATE INDEX idx_notifications_entity
ON notifications(related_entity_type,related_entity_id);
```

Creation Date
```sql
CREATE INDEX idx_notifications_created_at
ON notifications(created_at);
```

Purpose:

Recent notifications retrieval.

### 9.2 notification_recipients

User Notifications
```sql
CREATE INDEX idx_notification_recipients_user
ON notification_recipients(user_id);
```

Unread Notifications
```sql
CREATE INDEX idx_notification_unread
ON notification_recipients(user_id,read);
```

Purpose:

Notification badge counter.

## 10. Financial Management Indexes

### 10.1 payments

Internship Payments
```sql
CREATE INDEX idx_payments_internship_id
ON payments(internship_id);
```

Payment Status
```sql
CREATE INDEX idx_payments_status
ON payments(status);
```

Purpose:

Financial dashboard.
Payment Reference
```sql
CREATE UNIQUE INDEX idx_payments_reference
ON payments(reference);
```

## 11. Audit Indexes

### 11.1 audit_logs

User Activity
```sql
CREATE INDEX idx_audit_logs_user_id
ON audit_logs(user_id);
```

Entity History
```sql
CREATE INDEX idx_audit_logs_entity
ON audit_logs(entity_name,entity_id);
```

Purpose:

Track changes to any entity.
Date Range
```sql
CREATE INDEX idx_audit_logs_date
ON audit_logs(created_at);
```

## 12. Analytics Indexes

### 12.1 internship_analytics

Time-based Analysis
```sql
CREATE INDEX idx_internship_analytics_date
ON internship_analytics(date);
```

## 13. Search-Specific Indexes

### 13.1 Comprehensive Search Indexes

Application Search
```sql
CREATE INDEX idx_search_applications
ON internship_applications(reference,candidate_id,status);
```

Internship Search
```sql
CREATE INDEX idx_search_internships
ON internships(reference,candidate_id,status);
```

All Entities Search
```sql
CREATE INDEX idx_search_all_entities
ON (
    SELECT reference, 'application' AS entity_type, created_at
    FROM internship_applications
    UNION ALL
    SELECT reference, 'internship' AS entity_type, created_at
    FROM internships
    UNION ALL
    SELECT reference, 'assignment' AS entity_type, created_at
    FROM internship_assignments
    UNION ALL
    SELECT reference, 'document' AS entity_type, created_at
    FROM documents
    UNION ALL
    SELECT reference, 'payment' AS entity_type, created_at
    FROM payments
);
```

## 14. Hybrid Search Indexes (PostgreSQL Full-Text Search)

### 14.1 Text Search Configurations

Configuration
```sql
CREATE TEXT SEARCH CONFIGURATION french_unigram (
    PARSER = 'default',
    DICTIONARY = french_stem,
    DICTIONARY = french_unigram,
    DICTIONARY = english_stem
);
```

Purpose:

Faster full-text search.

### 14.2 Application Search Index

Application Text Search
```sql
CREATE INDEX idx_search_applications_tsv
ON internship_applications
USING GIN (to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(status,'')));
```

Purpose:

Fast text search on applications.

### 14.3 Internship Search Index

Internship Text Search
```sql
CREATE INDEX idx_search_internships_tsv
ON internships
USING GIN (to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(status,'')));
```

Purpose:

Fast text search on internships.

### 14.4 Combined Search Index

Combined Text Search
```sql
CREATE INDEX idx_search_all_entities_tsv
ON (
    SELECT to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(status,'')) AS tsv
    FROM internship_applications
    UNION ALL
    SELECT to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(status,'')) AS tsv
    FROM internships
    UNION ALL
    SELECT to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(status,'')) AS tsv
    FROM internship_assignments
    UNION ALL
    SELECT to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(type,'')) AS tsv
    FROM documents
    UNION ALL
    SELECT to_tsvector('french_unigram', COALESCE(reference,'') || ' ' || COALESCE(status,'')) AS tsv
    FROM payments
);
```

Purpose:

Unified text search.

## 15. Materialized View Indexes

### 15.1 Internship Statistics View

Statistics Summary
```sql
CREATE INDEX idx_stats_internships_department
ON internship_statistics(department_id);
```

Date Range Statistics
```sql
CREATE INDEX idx_stats_internships_date
ON internship_statistics(date);
```

### 15.2 HR Dashboard View

HR Dashboard Index
```sql
CREATE INDEX idx_hr_dashboard_date
ON hr_dashboard(date);
```

### 15.3 Supervisor Dashboard View

Supervisor Dashboard Index
```sql
CREATE INDEX idx_supervisor_dashboard_supervisor
ON supervisor_dashboard(supervisor_id);
```

## 16. Multi-Criteria Search Indexes

### 16.1 Application Multi-Search

Application Advanced Search
```sql
CREATE INDEX idx_app_search_multi
ON internship_applications(reference,candidate_id,status,submission_date,department_id);
```

### 16.2 Internship Multi-Search

Internship Advanced Search
```sql
CREATE INDEX idx_intern_search_multi
ON internships(reference,candidate_id,status,start_date,end_date,department_id);
```

## 17. Document Search Indexes

### 17.1 Document Search
```sql
CREATE INDEX idx_doc_search
ON documents(reference,type,object_id);
```

## 18. All Databases Indexes Summary

### Database_General

Core Tables
```sql
CREATE INDEX idx_applications_status ON internship_applications(status);
```

```sql
CREATE INDEX idx_applications_candidate_id ON internship_applications(candidate_id);
```

```sql
CREATE INDEX idx_applications_reference ON internship_applications(reference);
```

```sql
CREATE INDEX idx_applications_submission_date ON internship_applications(submission_date);
```

```sql
CREATE INDEX idx_internships_candidate_id ON internships(candidate_id);
```

```sql
CREATE INDEX idx_internships_department_id ON internships(department_id);
```

```sql
CREATE INDEX idx_internships_reference ON internships(reference);
```

```sql
CREATE INDEX idx_internships_start_date_end_date ON internships(start_date,end_date);
```

```sql
CREATE INDEX idx_assignments_internship_id ON internship_assignments(internship_id);
```

```sql
CREATE INDEX idx_assignments_supervisor_id ON internship_assignments(supervisor_id);
```

```sql
CREATE INDEX idx_assignments_department_id ON internship_assignments(department_id);
```

```sql
CREATE INDEX idx_workflows_entity ON workflows(entity_type,entity_id);
```

```sql
CREATE INDEX idx_
CREATE INDEX idx_notification_recipients_user
ON notification_recipients(user_id);
```

Unread Notifications
```sql
CREATE INDEX idx_notification_unread
ON notification_recipients(user_id,read);
```


Purpose:

Notification badge counter.

## 10. Financial Management Indexes

### 10.1 payments

Internship Payments
```sql
CREATE INDEX idx_payments_internship_id
ON payments(internship_id);
```

Payment Status
```sql
CREATE INDEX idx_payments_status
ON payments(status);
```

Purpose:

Financial dashboard.
```

Payment Reference
```sql
CREATE UNIQUE INDEX idx_payments_reference
ON payments(reference);
```

## 11. Audit Indexes

### 11.1 audit_logs

User Activity
```sql
CREATE INDEX idx_audit_logs_user_id
ON audit_logs(user_id);
```

Entity History
```sql
CREATE INDEX idx_audit_logs_entity
ON audit_logs(entity_name,entity_id);
```

Date Filtering
```sql
CREATE INDEX idx_audit_logs_created_at
ON audit_logs(created_at);
```

## 12. Composite Index Strategy

Composite indexes are created for frequent multi-condition searches.

Examples:

Internship Dashboard

Query:

Find active internships in a department

Index:

```sql
CREATE INDEX idx_internship_dashboard
ON internships(status,start_date);
```

Candidate Processing

Query:

Pending applications ordered by date

Index:

```sql
CREATE INDEX idx_pending_applications
ON internship_applications(status,submission_date);
```

Notification Center

Query:

Unread notifications of a user

Index:
```sql
CREATE INDEX idx_user_unread_notifications
ON notification_recipients(user_id,read);
```

## 13. Index Maintenance

Regular maintenance tasks:
```sql
VACUUM ANALYZE;
```

```sql
REINDEX;
```

Monitoring:

Slow queries.
Index usage.
Database growth.

## 14. Indexing Considerations

Indexes must be balanced.

Advantages:

Faster reads.
Better search performance.

Costs:

Additional storage.
Slower INSERT/UPDATE operations.

Only business-critical fields receive indexes.

# Conclusion

The indexing strategy provides optimized database performance while maintaining scalability.

It supports:

Authentication.
Internship management.
Administrative workflows.
Dashboards.
Mobile application synchronization.
Reporting.

This document serves as the reference before implementing PostgreSQL migrations.