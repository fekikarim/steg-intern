# System Architecture

## 1. Purpose

This document defines the overall architecture of the **STEG Intelligent Internship Management Platform**.

The objective is to describe the global structure of the system, the interaction between components, architectural decisions, and the principles guiding the development of the platform.

The system is designed to provide:

- Centralized internship management.
- Digital administrative workflows.
- Secure communication between applications.
- Scalable and maintainable architecture.
- Future extensibility toward other STEG administrative processes.

---

# 2. System Overview

The platform is composed of three client applications sharing a common backend ecosystem.

Architecture overview:

```

```
                     Users

                       |

    ------------------------------------------------

    |                      |                       |
```

Next.js Front Office   Angular Back Office    Flutter Mobile App

```
    |                      |                       |

    ------------------------------------------------

                       |

              Spring Boot REST API

                       |

    ------------------------------------------------

    |                      |                       |
```

PostgreSQL Database   File Storage System   Notification Services

```

---

# 3. Architectural Style

The platform follows a:

```

Layered Clean Architecture

*

Domain Driven Design Principles

*

Modular Monolith Architecture

```

The initial implementation uses a modular backend architecture rather than distributed microservices.

---

# 4. Main Architectural Components

## 4.1 Front Office Application

Technology:

```

Next.js

```

Purpose:

Public portal dedicated to candidates.

Responsibilities:

- Candidate registration.
- Internship applications.
- Document upload.
- Application tracking.
- Public information access.

---

## 4.2 Back Office Application

Technology:

```

Angular

```

Purpose:

Internal STEG administration portal.

Responsibilities:

- Internship management.
- Candidate management.
- Workflow processing.
- User administration.
- Reports and dashboards.

---

## 4.3 Mobile Application

Technology:

```

Flutter

```

Application:

```

Internship Companion

```

Purpose:

Operational internship follow-up.

Responsibilities:

- Journal management.
- Task tracking.
- Deliverables.
- Notifications.
- Supervisor monitoring.

---

## 4.4 Backend API

Technology:

```

Spring Boot 3

```

The backend represents the core of the platform.

Responsibilities:

- Business logic.
- Authentication.
- Authorization.
- Data management.
- Workflow execution.
- Document generation.
- Notifications.

---

## 4.5 Database

Technology:

```

PostgreSQL

```

Responsibilities:

- Persistent data storage.
- Transaction management.
- Referential integrity.
- Business data management.

---

# 5. Backend-Centric Architecture

All applications communicate exclusively with the backend.

```

Client Applications

```
    |
```

REST API

```
    |
```

Business Layer

```
    |
```

Database

```

Benefits:

- Single source of truth.
- Centralized security.
- Consistent business rules.
- Easier maintenance.

---

# 6. Communication Architecture

Communication protocols:

## Client → Backend

```

HTTPS

REST API

JSON

```

---

## Backend → Database

```

JPA / Hibernate

SQL

```

---

## Backend → External Services

Examples:

```

Email Service

Push Notification Service

File Storage

```

---

# 7. Backend Internal Architecture

The backend follows a layered structure:

```

Controller Layer

```
    |
```

Service Layer

```
    |
```

Domain Layer

```
    |
```

Repository Layer

```
    |
```

Database

```

---

## Controller Layer

Responsibilities:

- Receive HTTP requests.
- Validate input.
- Return responses.

Examples:

```

REST Controllers
DTO Mapping
Exception Handling

```

---

## Service Layer

Responsibilities:

- Execute business operations.
- Coordinate workflows.
- Apply business rules.

---

## Domain Layer

Contains:

- Entities.
- Value objects.
- Domain rules.
- Enumerations.

---

## Repository Layer

Responsibilities:

- Database access.
- Query execution.
- Persistence operations.

---

# 8. Domain Modules

The backend is organized around business modules.

Main modules:

```

Authentication

User Management

Candidate Management

Internship Management

Workflow Engine

Document Management

Notification Management

Evaluation Management

Payment Management

Audit Management

```

---

# 9. Data Flow Example

## Internship Application

```

Candidate

|

Next.js Front Office

|

REST API

|

Application Service

|

Database

|

Workflow Engine

|

HR Validation

```

---

# 10. Security Architecture

Security is applied at every layer.

Security mechanisms:

```

JWT Authentication

Refresh Tokens

RBAC Authorization

HTTPS

Input Validation

Audit Logs

```

---

# 11. Scalability Strategy

The architecture supports future growth.

Possible evolutions:

```

Current:

Modular Monolith

Future:

Microservices Architecture

```

Potential extracted services:

- Notification Service.
- Document Service.
- Workflow Service.
- Reporting Service.

---

# 12. Availability Strategy

The system should support:

- Database backup.
- Error recovery.
- Logging.
- Monitoring.
- Graceful failures.

---

# 13. File Management Architecture

Documents are not stored directly inside the database.

Architecture:

```

Application

```
    |
```

File Service

```
    |
```

Object Storage

```
    |
```

Database Metadata

```

Stored metadata:

- File reference.
- Storage key.
- MIME type.
- Size.
- Version.

---

# 14. Notification Architecture

Notifications are handled asynchronously.

Example:

```

Business Event

```
    |
```

Notification Service

```
    |
```

Push / Email / In-App

```
    |
```

User

```

---

# 15. Workflow Architecture

The workflow engine manages administrative processes.

Example:

Internship approval:

```

Submitted

```
    |
```

HR Review

```
    |
```

Department Validation

```
    |
```

Director Approval

```
    |
```

Accepted

```

---

# 16. Deployment Architecture

Possible deployment:

```

```
             Internet

                |

          Reverse Proxy

                |

    -------------------------

    |                       |
```

Frontend Servers        Backend Server

```
                            |

                     PostgreSQL Server

                            |

                     File Storage
```

```

---

# 17. Development Architecture

Tools:

## Version Control

```

Git

GitHub

```

---

## API Documentation

```

Swagger / OpenAPI

```

---

## UI Design

```

Figma

```

---

## Modeling

```

Visual Paradigm

StarUML

```

---

# 18. Architectural Principles

The system follows:

## Separation of Concerns

Each layer has a specific responsibility.

---

## Low Coupling

Modules should communicate through defined interfaces.

---

## High Cohesion

Each module focuses on a clear business capability.

---

## Security by Design

Security is integrated from the beginning.

---

## Evolution Capability

The architecture supports future expansion.

---

# 19. Technology Summary

| Layer | Technology |
|---|---|
| Front Office | Next.js |
| Back Office | Angular |
| Mobile | Flutter |
| Backend | Spring Boot 3 |
| Database | PostgreSQL |
| API | REST |
| Authentication | JWT + Refresh Token |
| Authorization | RBAC |
| Documentation | Swagger/OpenAPI |
| Version Control | Git/GitHub |
| Design | Figma |
| UML | Visual Paradigm / StarUML |

---

# 20. Conclusion

The system architecture of the STEG Internship Management Platform provides a robust foundation for digital transformation.

By combining multiple specialized client applications with a centralized Spring Boot backend and a secure PostgreSQL data layer, the platform ensures consistency, scalability, maintainability, and future evolution toward a complete digital administrative ecosystem.