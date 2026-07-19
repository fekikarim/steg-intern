# Backend Repositories

## 1. Purpose

This document defines the repository layer architecture of the STEG Internship Management Platform backend.

The repository layer is responsible for:

- Database communication.
- Entity persistence.
- Data retrieval.
- Query execution.
- Database abstraction.

Repositories provide a clean separation between:

- Business logic.
- Data access logic.

---

# 2. Repository Architecture

The backend follows a layered architecture:

```

Controllers

```
    |
```

Services

```
    |
```

Repositories

```
    |
```

JPA Entities

```
    |
```

PostgreSQL Database

```

Repositories are implemented using:

```

Spring Data JPA

````

---

# 3. Repository Principles

Repositories must respect the following principles:

---

## 3.1 Data Access Only

Repositories must only handle:

- CRUD operations.
- Queries.
- Persistence.

They must not contain:

- Business rules.
- Workflow decisions.
- Authorization logic.

Example:

Good:

```java
findByEmail(String email)
````

Bad:

```java
approveInternship()
```

---

## 3.2 Repository Per Aggregate

Each main domain aggregate should have its own repository.

Example:

```
User

↓

UserRepository
```

```
Internship

↓

InternshipRepository
```

---

## 3.3 Use Interfaces

Repositories should be interfaces.

Example:

```java
public interface UserRepository 
        extends JpaRepository<User, UUID> {

}
```

Spring provides the implementation automatically.

---

# 4. Repository Naming Convention

Pattern:

```
<EntityName>Repository
```

Examples:

```
UserRepository

InternshipRepository

DocumentRepository
```

Location:

```
backend/src/main/java/com/steg/platform/repository
```

---

# 5. Identity Management Repositories

# 5.1 UserRepository

Entity:

```
User
```

Purpose:

Manages platform users.

Operations:

```java
findByEmail()

existsByEmail()

findByStatus()

findByRole()
```

Example queries:

```sql
SELECT *
FROM users
WHERE email = ?
```

---

# 5.2 RoleRepository

Entity:

```
Role
```

Purpose:

Stores system roles.

Operations:

```java
findByName()

existsByName()
```

---

# 5.3 PermissionRepository

Entity:

```
Permission
```

Purpose:

Manages permissions.

Operations:

```java
findByCode()

existsByCode()
```

---

# 5.4 RefreshTokenRepository

Entity:

```
RefreshToken
```

Purpose:

Manages authentication refresh tokens.

Operations:

```java
findByToken()

deleteByUser()

findActiveTokens()
```

---

# 5.5 SessionRepository

Entity:

```
Session
```

Purpose:

Tracks user sessions.

Operations:

```java
findByUserId()

deleteExpiredSessions()
```

---

# 5.6 AuditLogRepository

Entity:

```
AuditLog
```

Purpose:

Stores system activity history.

Operations:

```java
findByUserId()

findByEntityName()

findByDateRange()
```

---

# 6. Organization Management Repositories

# 6.1 DepartmentRepository

Entity:

```
Department
```

Purpose:

Manages STEG departments.

Operations:

```java
findByCode()

findByName()
```

---

# 6.2 EmployeeRepository

Entity:

```
Employee
```

Purpose:

Manages employees.

Operations:

```java
findByEmployeeNumber()

findByDepartment()
```

---

# 6.3 SupervisorRepository

Entity:

```
Supervisor
```

Purpose:

Manages internship supervisors.

Operations:

```java
findAvailableSupervisors()

findByDepartment()
```

---

# 7. Internship Management Repositories

# 7.1 CandidateRepository

Entity:

```
Candidate
```

Purpose:

Stores candidate information.

Operations:

```java
findByEmail()

findByNationalId()

findByUniversity()
```

---

# 7.2 InternshipApplicationRepository

Entity:

```
InternshipApplication
```

Purpose:

Manages internship requests.

Operations:

```java
findByStatus()

findByCandidate()

findPendingApplications()
```

---

# 7.3 InternshipRepository

Entity:

```
Internship
```

Purpose:

Manages internship lifecycle.

Operations:

```java
findByReference()

findByStatus()

findActiveInternships()

findByCandidate()
```

---

# 7.4 InternshipAssignmentRepository

Entity:

```
InternshipAssignment
```

Purpose:

Stores internship assignments.

Operations:

```java
findByInternship()

findBySupervisor()

findByDepartment()
```

---

# 8. Workflow Repositories

# 8.1 WorkflowRepository

Entity:

```
Workflow
```

Purpose:

Stores workflow instances.

Operations:

```java
findByStatus()

findByEntity()
```

---

# 8.2 WorkflowStepRepository

Entity:

```
WorkflowStep
```

Purpose:

Stores workflow steps.

Operations:

```java
findByWorkflow()

findBySequence()
```

---

# 8.3 WorkflowActionRepository

Entity:

```
WorkflowAction
```

Purpose:

Stores workflow actions.

Operations:

```java
findByWorkflowStep()

findByUser()

findHistory()
```

---

# 9. Internship Companion Repositories

# 9.1 InternshipJournalRepository

Entity:

```
InternshipJournal
```

Purpose:

Stores internship journals.

Operations:

```java
findByInternship()
```

---

# 9.2 JournalEntryRepository

Entity:

```
JournalEntry
```

Purpose:

Stores daily journal entries.

Operations:

```java
findByJournal()

findByStatus()

findPendingValidation()
```

---

# 9.3 TaskRepository

Entity:

```
Task
```

Purpose:

Stores internship tasks.

Operations:

```java
findByInternship()

findByStatus()

findByDueDate()
```

---

# 9.4 DeliverableRepository

Entity:

```
Deliverable
```

Purpose:

Manages submitted work.

Operations:

```java
findByInternship()

findByStatus()

findPendingValidation()
```

---

# 9.5 EvaluationRepository

Entity:

```
Evaluation
```

Purpose:

Stores internship evaluations.

Operations:

```java
findByInternship()

findBySupervisor()

findByType()
```

---

# 9.6 EvaluationCriterionRepository

Entity:

```
EvaluationCriterion
```

Purpose:

Stores evaluation criteria.

Operations:

```java
findActiveCriteria()
```

---

# 9.7 EvaluationScoreRepository

Entity:

```
EvaluationScore
```

Purpose:

Stores evaluation results.

Operations:

```java
findByEvaluation()
```

---

# 9.8 CommentRepository

Entity:

```
Comment
```

Purpose:

Stores user comments.

Operations:

```java
findByTarget()

findByAuthor()
```

---

# 10. Document Management Repositories

# 10.1 DocumentRepository

Entity:

```
Document
```

Purpose:

Central document storage metadata.

Operations:

```java
findByReference()

findByType()

findByEntity()
```

---

# 10.2 ApplicationDocumentRepository

Entity:

```
ApplicationDocument
```

Purpose:

Manages candidate uploaded documents.

Operations:

```java
findByApplication()

findMandatoryDocuments()
```

---

# 11. Communication Repositories

# 11.1 NotificationRepository

Entity:

```
Notification
```

Purpose:

Stores notifications.

Operations:

```java
findByUser()

findUnreadNotifications()

findRecentNotifications()
```

---

# 11.2 NotificationRecipientRepository

Entity:

```
NotificationRecipient
```

Purpose:

Manages notification recipients.

Operations:

```java
findByRecipient()

markAsRead()
```

---

# 12. Financial Repositories

# 12.1 PaymentRepository

Entity:

```
Payment
```

Purpose:

Manages internship payments.

Operations:

```java
findByReference()

findByStatus()

findByInternship()

findPendingPayments()
```

---

# 13. Dashboard and Reporting Repositories

These repositories provide optimized queries for dashboards.

---

## DashboardRepository

Purpose:

Aggregated statistics.

Examples:

```java
countActiveInternships()

countPendingApplications()

calculateMonthlyPayments()
```

---

## ReportRepository

Purpose:

Complex reporting queries.

Examples:

```java
internshipStatistics()

departmentStatistics()

paymentStatistics()
```

---

# 14. Custom Queries

For complex business requirements, repositories may contain custom queries.

Technologies:

* JPQL
* Native SQL
* Criteria API

Example:

```java
@Query("""
SELECT i
FROM Internship i
WHERE i.status = 'ACTIVE'
""")
List<Internship> findActiveInternships();
```

---

# 15. Pagination Support

Large datasets must support pagination.

Example:

```java
Page<Internship> findAll(Pageable pageable);
```

Used for:

* Candidates.
* Applications.
* Internships.
* Payments.
* Documents.

---

# 16. Sorting and Filtering

Repositories should support:

* Sorting.
* Filtering.
* Searching.

Example:

```
Applications

Filter:
Status = UNDER_REVIEW

Sort:
Submission Date DESC
```

---

# 17. Transaction Rules

Repositories do not manage business transactions.

Transactions belong to:

```
Service Layer
```

Example:

```java
@Transactional
public void acceptApplication()
```

---

# 18. Database Performance Considerations

Repositories must consider:

* Proper indexing.
* Query optimization.
* Avoiding N+1 problems.
* Lazy loading strategy.
* Pagination.

---

# 19. Testing Strategy

Repository tests must verify:

## CRUD Operations

* Create.
* Read.
* Update.
* Delete.

---

## Custom Queries

Verify:

* Returned data.
* Filtering.
* Sorting.

---

## Integration Testing

Using:

* Spring Boot Test.
* Testcontainers.
* PostgreSQL test database.

---

# 20. Repository Security Rules

Repositories must never expose:

* Password hashes unnecessarily.
* Sensitive documents without authorization.
* Unauthorized personal data.

Security checks remain in:

```
Controller

+

Service Layer
```

---

# 21. Future Improvements

Possible extensions:

* Database read replicas.
* Advanced search engine integration.
* Elasticsearch indexing.
* Data warehouse repositories.
* Analytics-specific repositories.

---

# 22. Conclusion

The repository layer provides a clean and maintainable data access abstraction for the STEG Internship Management Platform.

By separating persistence operations from business logic, the backend remains scalable, testable, and easier to evolve while maintaining strong domain consistency.