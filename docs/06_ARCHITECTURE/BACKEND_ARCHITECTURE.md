# Backend Architecture

## 1. Purpose

This document defines the backend architecture of the **STEG Intelligent Internship Management Platform**.

The backend represents the core system responsible for:

- Executing business logic.
- Managing application data.
- Securing access.
- Exposing REST APIs.
- Processing workflows.
- Managing documents.
- Handling notifications.
- Supporting future system evolution.

The backend is implemented using:

```

Spring Boot 3

```

and follows clean architecture principles combined with domain-driven design concepts.

---

# 2. Backend Vision

The backend acts as a centralized business platform shared by:

```

Next.js Front Office

Angular Back Office

Flutter Mobile Application

```

All applications communicate exclusively through the backend.

Architecture:

```

Client Applications

```
    |
```

Spring Boot REST API

```
    |
```

Business Logic

```
    |
```

Data Access Layer

```
    |
```

PostgreSQL Database

```

---

# 3. Architectural Style

The backend follows:

```

Modular Monolith Architecture

*

Layered Architecture

*

Clean Architecture Principles

*

Domain Driven Design

```

The first version is designed as a modular monolith to simplify:

- Deployment.
- Maintenance.
- Development.
- Data consistency.

The architecture allows future migration toward microservices if required.

---

# 4. Backend Technology Stack

| Component | Technology |
|---|---|
| Framework | Spring Boot 3 |
| Language | Java |
| API Style | REST API |
| Security | Spring Security |
| Authentication | JWT + Refresh Token |
| Authorization | RBAC |
| Persistence | Spring Data JPA |
| ORM | Hibernate |
| Database | PostgreSQL |
| Migration | Flyway / Liquibase |
| Validation | Jakarta Validation |
| Documentation | Swagger / OpenAPI |
| Testing | JUnit + Mockito |

---

# 5. Backend High-Level Architecture

The backend is organized into multiple layers:

```

```
                REST API Layer

                      |

                Application Layer

                      |

                 Domain Layer

                      |

              Infrastructure Layer

                      |

                PostgreSQL Database
```

```

---

# 6. Package Architecture

Recommended structure:

```

com.steg.platform

│
├── auth
│
├── user
│
├── candidate
│
├── internship
│
├── workflow
│
├── document
│
├── notification
│
├── evaluation
│
├── payment
│
├── audit
│
├── common
│
└── infrastructure

```

Each module is independent and contains its own:

```

Controller

Service

Repository

Entity

DTO

Mapper

Exception

```

---

# 7. Backend Layers

## 7.1 Controller Layer

Purpose:

Expose REST endpoints.

Responsibilities:

- Receive HTTP requests.
- Validate input.
- Call application services.
- Return API responses.

Example:

```

InternshipController

POST /api/internships

GET /api/internships/{id}

```

---

# 7.2 DTO Layer

DTOs are used to separate:

```

External API Models

from

Internal Domain Models

```

Benefits:

- Security.
- Cleaner APIs.
- Avoid exposing entities.
- Easier evolution.

Example:

```

InternshipRequestDTO

InternshipResponseDTO

```

---

# 7.3 Service Layer

The service layer contains business operations.

Responsibilities:

- Execute use cases.
- Apply business rules.
- Coordinate modules.
- Manage transactions.

Example:

```

InternshipService

createInternship()

assignSupervisor()

completeInternship()

```

---

# 7.4 Domain Layer

Contains core business concepts.

Examples:

```

User

Candidate

Internship

Workflow

Payment

Evaluation

```

Responsibilities:

- Business rules.
- Entity behavior.
- Domain constraints.

---

# 7.5 Repository Layer

Responsible for persistence.

Technology:

```

Spring Data JPA

```

Responsibilities:

- Database queries.
- Entity persistence.
- Data retrieval.

Example:

```

InternshipRepository

findByStatus()

findBySupervisor()

```

---

# 7.6 Infrastructure Layer

Contains technical implementations.

Examples:

```

Email Service

File Storage

Notification Provider

Security Configuration

Database Configuration

```

---

# 8. Backend Modules

## 8.1 Authentication Module

Responsibilities:

- Login.
- Registration.
- JWT generation.
- Refresh token management.
- Session management.

Entities:

```

User

Role

Permission

RefreshToken

Session

```

---

# 8.2 User Management Module

Responsibilities:

- Manage platform users.
- Manage roles.
- Manage permissions.

Actors:

```

Administrator

HR Manager

Supervisor

Finance Manager

```

---

# 8.3 Candidate Management Module

Responsibilities:

- Candidate accounts.
- Internship applications.
- Uploaded documents.
- Application status.

Main entities:

```

Candidate

InternshipApplication

ApplicationDocument

```

---

# 8.4 Internship Management Module

Core business module.

Responsibilities:

- Create internships.
- Assign departments.
- Assign supervisors.
- Track internship lifecycle.

Entities:

```

Internship

InternshipAssignment

```

---

# 8.5 Workflow Engine Module

Purpose:

Manage administrative approval processes.

Responsibilities:

- Create workflows.
- Execute steps.
- Track approvals.
- Record decisions.

Entities:

```

Workflow

WorkflowStep

WorkflowAction

```

---

# 8.6 Document Management Module

Responsibilities:

- Store documents.
- Generate PDFs.
- Manage versions.
- Verify documents.

Examples:

```

Internship Convention

Assignment Letter

Internship Certificate

```

---

# 8.7 Notification Module

Responsibilities:

- Create notifications.
- Send messages.
- Manage recipients.

Channels:

```

Push Notification

Email

In-App Notification

```

---

# 8.8 Evaluation Module

Responsibilities:

- Internship evaluations.
- Criteria management.
- Scoring.

Entities:

```

Evaluation

EvaluationCriterion

EvaluationScore

```

---

# 8.9 Payment Module

Responsibilities:

- Internship indemnities.
- Payment tracking.
- Validation workflow.

Entity:

```

Payment

```

---

# 8.10 Audit Module

Responsibilities:

- Track important operations.
- Maintain traceability.

Example:

```

User updated internship status

Old value: ACTIVE

New value: COMPLETED

```

---

# 9. API Architecture

The backend exposes REST APIs.

Base URL:

```

/api/v1

```

Example:

```

GET

/api/v1/internships

```

---

# 10. API Organization

Example:

```

/api/v1/auth

/api/v1/users

/api/v1/candidates

/api/v1/internships

/api/v1/documents

/api/v1/workflows

/api/v1/notifications

```

---

# 11. Exception Handling

Global exception handling:

```

@RestControllerAdvice

````

Standard response:

```json
{
 "timestamp": "2026-07-20",
 "status": 400,
 "error": "VALIDATION_ERROR",
 "message": "Invalid internship data"
}
````

---

# 12. Validation Strategy

Input validation uses:

```
Jakarta Validation
```

Examples:

```java
@NotBlank

@Email

@NotNull

@Size
```

Validation occurs before business processing.

---

# 13. Transaction Management

Business operations requiring consistency use:

```
@Transactional
```

Example:

Creating internship:

```
Create Internship

+

Create Assignment

+

Start Workflow
```

must succeed or fail together.

---

# 14. Background Processing

The backend supports asynchronous jobs.

Examples:

* Sending notifications.
* Generating PDFs.
* Synchronization tasks.
* Reminder emails.

Technologies:

```
Spring Scheduler

Spring Async
```

---

# 15. File Storage Architecture

Files are separated from database storage.

Architecture:

```
Document Metadata

        |

Storage Service

        |

Object Storage
```

Database stores:

* File reference.
* Storage key.
* Metadata.

---

# 16. Security Architecture

Security mechanisms:

## Authentication

```
JWT Access Token

+

Refresh Token
```

---

## Authorization

```
RBAC

Role

Permission
```

---

## Protection

Includes:

* HTTPS.
* Password hashing.
* Input validation.
* Audit logging.
* Rate limiting.

---

# 17. Logging

Backend logs:

* Requests.
* Errors.
* Security events.
* Important operations.

Tools:

```
SLF4J

Logback
```

---

# 18. Testing Architecture

## Unit Tests

Test:

* Services.
* Business rules.
* Validators.

---

## Integration Tests

Test:

* API endpoints.
* Database communication.
* Security.

---

## Repository Tests

Test:

* Queries.
* Persistence behavior.

---

# 19. Performance Considerations

The backend should optimize:

* Database queries.
* Pagination.
* Lazy loading.
* Caching.
* Async operations.

---

# 20. Future Evolution

Possible improvements:

* Extract microservices.
* Add API Gateway.
* Add message broker.
* Implement event-driven architecture.
* Add distributed caching.

---

# 21. Conclusion

The backend architecture provides a secure, scalable, and maintainable foundation for the STEG Internship Management Platform.

By combining Spring Boot modular architecture, clean separation of responsibilities, centralized business logic, and strong security mechanisms, the backend supports current internship management needs while remaining ready for future digital transformation initiatives.