# Backend Services

## 1. Purpose

This document defines the service layer architecture of the STEG Internship Management Platform backend.

The service layer represents the application logic between:

- REST Controllers
- Domain Business Rules
- Persistence Layer

Its responsibility is to:

- Execute business operations.
- Coordinate multiple domain objects.
- Apply validations.
- Manage transactions.
- Communicate with repositories.
- Trigger external operations.
- Maintain consistency across the system.

---

# 2. Service Layer Architecture

The backend follows a layered architecture:

```

REST Controllers

```
    |
```

Service Layer

```
    |
```

Domain Models

```
    |
```

Repository Layer

```
    |
```

PostgreSQL Database

```

---

# 3. Service Design Principles

Services must follow:

## Single Responsibility

Each service manages one business domain.

Example:

```

InternshipService

≠

PaymentService

```

---

## Business Logic Centralization

Business rules must exist inside services.

Avoid:

- Business logic in controllers.
- Duplicate logic in frontend applications.
- Direct repository manipulation from controllers.

---

## Transaction Management

Services manage transactional operations.

Example:

Accepting an application:

```

Application Update

*

Internship Creation

*

Workflow Creation

*

Notification Sending

```

All operations must succeed together.

---

# 4. Service Naming Convention

Services use:

```

<Entity>Service

```

Examples:

```

UserService

InternshipService

DocumentService

```

Implementation:

```

UserService.java

UserServiceImpl.java

```

---

# 5. Authentication Services

## 5.1 AuthService

Purpose:

Handles user authentication operations.

Responsibilities:

- Login.
- Logout.
- Token generation.
- Refresh token management.
- Authentication validation.

Main operations:

```

login()

logout()

refreshToken()

validateCredentials()

```

---

## 5.2 PasswordService

Purpose:

Handles password management.

Responsibilities:

- Password hashing.
- Password verification.
- Password reset.
- Password policy validation.

Operations:

```

hashPassword()

verifyPassword()

changePassword()

```

---

# 6. User Management Services

## 6.1 UserService

Purpose:

Manages platform users.

Responsibilities:

- Create users.
- Update users.
- Disable accounts.
- Retrieve users.
- Manage user status.

Operations:

```

createUser()

updateUser()

activateUser()

lockUser()

findUserById()

```

---

## 6.2 RoleService

Purpose:

Manages roles.

Responsibilities:

- Create roles.
- Assign roles.
- Remove roles.
- Retrieve permissions.

Operations:

```

createRole()

assignRole()

removeRole()

```

---

## 6.3 PermissionService

Purpose:

Manages permissions.

Responsibilities:

- Permission creation.
- Permission validation.
- Permission assignment.

Operations:

```

createPermission()

checkPermission()

```

---

# 7. Candidate Services

## 7.1 CandidateService

Purpose:

Manages candidate lifecycle.

Responsibilities:

- Candidate registration.
- Candidate information updates.
- Candidate search.
- Candidate account linking.

Operations:

```

createCandidate()

updateCandidate()

findCandidate()

linkAccount()

```

---

# 8. Internship Application Services

## 8.1 InternshipApplicationService

Purpose:

Manages internship requests.

Responsibilities:

- Create applications.
- Submit applications.
- Review applications.
- Change application status.

Operations:

```

createApplication()

submitApplication()

reviewApplication()

acceptApplication()

rejectApplication()

```

---

## 8.2 ApplicationValidationService

Purpose:

Validates application completeness.

Checks:

- Required information.
- Required documents.
- Candidate eligibility.

Operations:

```

validateApplication()

checkDocuments()

checkInformation()

```

---

# 9. Internship Services

## 9.1 InternshipService

Purpose:

Handles internship lifecycle.

Responsibilities:

- Create internships.
- Update internship status.
- Retrieve internship details.
- Complete internships.

Operations:

```

createInternship()

activateInternship()

completeInternship()

cancelInternship()

```

---

## 9.2 AssignmentService

Purpose:

Handles internship assignments.

Responsibilities:

- Assign department.
- Assign supervisor.
- Update assignments.

Operations:

```

createAssignment()

assignSupervisor()

changeDepartment()

```

---

# 10. Workflow Services

## 10.1 WorkflowService

Purpose:

Manages business workflows.

Responsibilities:

- Create workflows.
- Start workflows.
- Execute transitions.
- Track workflow state.

Operations:

```

createWorkflow()

startWorkflow()

completeWorkflow()

```

---

## 10.2 WorkflowActionService

Purpose:

Handles workflow actions.

Responsibilities:

- Approvals.
- Validations.
- Decisions.
- Comments.

Operations:

```

executeAction()

approve()

reject()

returnForCorrection()

```

---

# 11. Document Services

## 11.1 DocumentService

Purpose:

Central document management.

Responsibilities:

- Upload documents.
- Download documents.
- Delete documents.
- Manage versions.

Operations:

```

uploadDocument()

downloadDocument()

deleteDocument()

createVersion()

```

---

## 11.2 DocumentGenerationService

Purpose:

Generates administrative documents.

Generated documents:

- Internship convention.
- Assignment letter.
- Internship certificate.

Operations:

```

generateConvention()

generateAssignmentLetter()

generateCertificate()

```

---

# 12. Internship Companion Services

## 12.1 JournalService

Purpose:

Manages internship journals.

Responsibilities:

- Create journal entries.
- Submit entries.
- Validate entries.

Operations:

```

createEntry()

submitEntry()

validateEntry()

```

---

## 12.2 TaskService

Purpose:

Manages internship tasks.

Operations:

```

createTask()

assignTask()

updateTaskStatus()

```

---

## 12.3 DeliverableService

Purpose:

Manages internship deliverables.

Responsibilities:

- Upload deliverables.
- Validate submissions.
- Track versions.

Operations:

```

submitDeliverable()

validateDeliverable()

rejectDeliverable()

```

---

# 13. Evaluation Services

## 13.1 EvaluationService

Purpose:

Handles internship evaluations.

Responsibilities:

- Create evaluations.
- Calculate scores.
- Store feedback.

Operations:

```

createEvaluation()

updateEvaluation()

calculateScore()

```

---

## 13.2 EvaluationCriterionService

Purpose:

Manages evaluation criteria.

Operations:

```

createCriterion()

updateCriterion()

deleteCriterion()

```

---

# 14. Financial Services

## 14.1 PaymentService

Purpose:

Manages internship payments.

Responsibilities:

- Create payments.
- Validate payments.
- Track payment status.

Operations:

```

createPayment()

validatePayment()

markAsPaid()

```

---

# 15. Notification Services

## 15.1 NotificationService

Purpose:

Central notification management.

Responsibilities:

- Create notifications.
- Send notifications.
- Track reading status.

Operations:

```

createNotification()

sendNotification()

markAsRead()

```

---

## 15.2 NotificationChannelService

Purpose:

Handles notification channels.

Supported channels:

```

IN_APP

EMAIL

PUSH

```

---

# 16. Email Services

## 16.1 EmailService

Purpose:

Handles email communication.

Responsibilities:

- Send emails.
- Manage templates.
- Handle failures.

Operations:

```

sendEmail()

sendTemplateEmail()

```

---

# 17. File Storage Services

## 17.1 FileStorageService

Purpose:

Manages physical file storage.

Responsibilities:

- Store files.
- Retrieve files.
- Delete files.
- Validate files.

Operations:

```

uploadFile()

downloadFile()

deleteFile()

```

---

# 18. Dashboard Services

## 18.1 DashboardService

Purpose:

Provides role-specific dashboard data.

Operations:

```

getHRDashboard()

getSupervisorDashboard()

getDirectorDashboard()

getInternDashboard()

```

---

# 19. Reporting Services

## 19.1 ReportService

Purpose:

Generates business reports.

Reports:

- Internship statistics.
- Payment reports.
- Activity reports.

Operations:

```

generateReport()

exportReport()

```

---

# 20. Audit Services

## 20.1 AuditLogService

Purpose:

Tracks important system operations.

Responsibilities:

- Create audit entries.
- Retrieve history.
- Monitor changes.

Operations:

```

logAction()

getHistory()

```

---

# 21. Service Communication Rules

Services may communicate with:

Allowed:

```

Service

↓

Service

↓

Repository

```

Example:

```

InternshipApplicationService

calls

WorkflowService

```

---

Not allowed:

```

Controller

↓

Repository

```

or

```

Frontend

↓

Database

```

---

# 22. Exception Handling

Services throw business exceptions.

Examples:

```

UserNotFoundException

InvalidApplicationStatusException

UnauthorizedOperationException

DocumentUploadException

PaymentValidationException

```

---

# 23. Logging Rules

Services must log:

- Important operations.
- Errors.
- Security events.
- External communication failures.

Avoid logging:

- Passwords.
- Tokens.
- Sensitive personal information.

---

# 24. Testing Strategy

Every service must include:

## Unit Tests

Validate:

- Business rules.
- State transitions.
- Calculations.

---

## Integration Tests

Validate:

- Repository interaction.
- Transactions.
- External services.

---

# 25. Future Extensions

Possible future services:

- AI Assistant Service.
- OCR Document Service.
- Electronic Signature Service.
- Advanced Workflow Engine.
- External STEG Integration Service.

---

# 26. Conclusion

The service layer is the operational core of the STEG Internship Management Platform backend.

By separating business operations into dedicated services, the platform achieves:

- Maintainability.
- Scalability.
- Reusability.
- Strong business rule consistency.
- Easier testing and evolution.