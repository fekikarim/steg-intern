# Clean Architecture

## 1. Purpose

This document defines the **Clean Architecture approach** adopted for the **STEG Intelligent Internship Management Platform**.

The objective is to design a system where:

- Business rules remain independent from technical details.
- The application is easy to maintain.
- Components are highly testable.
- Future technologies can be replaced without major changes.
- The platform can evolve toward enterprise-scale requirements.

Clean Architecture is applied mainly to:

- Spring Boot Backend.
- Flutter Mobile Application.
- Frontend applications through similar separation principles.

---

# 2. Clean Architecture Overview

Clean Architecture organizes software into concentric layers.

The main rule:

```

Dependencies always point inward.

```id="8f6s7v"

Meaning:

Outer layers depend on inner layers.

Inner layers know nothing about outer layers.

---

# 3. Architecture Diagram

```

```
                Frameworks & Drivers

    -------------------------------------

    Web Controllers
    REST API
    Database
    File Storage
    External Services


    -------------------------------------

          Interface Adapters


    Controllers
    Presenters
    Repositories Implementation
    Mappers


    -------------------------------------

              Application Layer


    Use Cases
    Application Services
    Business Workflows


    -------------------------------------

                Domain Layer


    Entities
    Value Objects
    Business Rules
```

```id="8m0s5y"

---

# 4. Dependency Rule

The dependency direction:

```

Frameworks

```
↓
```

Adapters

```
↓
```

Use Cases

```
↓
```

Entities

```id="5x6w8a"

The domain layer must never depend on:

- Spring Boot.
- Hibernate.
- PostgreSQL.
- Flutter.
- External APIs.

---

# 5. Layer Description

---

# 5.1 Domain Layer (Enterprise Business Rules)

## Responsibility

Contains the core business logic of the platform.

This layer represents STEG business concepts.

---

Contains:

```

Entities

Value Objects

Domain Rules

Domain Events

```id="x8p3qj"

---

Examples:

```

Internship

Candidate

Workflow

Payment

Document

```id="h1j2kf"

---

The domain layer defines:

- Internship lifecycle.
- Validation rules.
- Status transitions.
- Business constraints.

---

Example:

Internship status transition:

```

PLANNED

```
↓
```

ACTIVE

```
↓
```

COMPLETED

```id="4az7zr"

Invalid transitions are rejected by domain rules.

---

# 5.2 Application Layer (Use Cases)

## Responsibility

Coordinates application operations.

It defines what the system does.

---

Contains:

```

Use Cases

Application Services

DTO Contracts

Commands

Queries

```id="4c1eqp"

---

Examples:

```

SubmitInternshipApplicationUseCase

AssignSupervisorUseCase

GenerateInternshipCertificateUseCase

ValidateDeliverableUseCase

```id="abk2eg"

---

The application layer:

- Uses domain entities.
- Executes business workflows.
- Does not know database details.

---

Example:

```

SubmitApplicationUseCase

1. Validate candidate data

2. Create application

3. Save application

4. Start workflow

5. Send notification

```id="5ajywp"

---

# 5.3 Interface Adapter Layer

## Responsibility

Converts data between external systems and internal use cases.

---

Contains:

```

Controllers

Repositories Implementation

Mappers

Presenters

```id="k2qu9h"

---

Example:

REST Controller:

```

HTTP Request

```
    |
```

Controller

```
    |
```

Use Case

```
    |
```

Response DTO

```id="d9y3w7"

---

Responsibilities:

- Handle HTTP requests.
- Convert DTOs.
- Format responses.
- Communicate with external systems.

---

# 5.4 Frameworks and Infrastructure Layer

## Responsibility

Contains technical implementations.

---

Examples:

```

Spring Boot

PostgreSQL

JPA/Hibernate

JWT

Email Provider

File Storage

```id="7qj1e5"

---

This layer implements interfaces defined by inner layers.

---

Example:

Domain defines:

```

DocumentStorageRepository

```id="5o4x9d"

Infrastructure provides:

```

MinioDocumentStorageService

or

LocalStorageService

```id="i9t5r0"

---

# 6. Backend Clean Architecture Structure

Recommended Spring Boot structure:

```

backend

└── src/main/java/com/steg/platform

```
├── domain

│
│   ├── entities
│   ├── valueobjects
│   ├── enums
│   └── exceptions


├── application

│
│   ├── usecases
│   ├── services
│   ├── commands
│   └── queries


├── interfaces

│
│   ├── controllers
│   ├── dto
│   ├── mappers
│   └── presenters


├── infrastructure

    ├── persistence

    ├── security

    ├── storage

    ├── email

    └── configuration
```

```id="2g2w6f"

---

# 7. Example: Internship Creation Flow

## Request

User creates internship.

---

## Flow

```

Angular / Next.js

```
    |
```

REST Controller

```
    |
```

CreateInternshipUseCase

```
    |
```

Internship Entity

```
    |
```

InternshipRepository Interface

```
    |
```

JPA Repository Implementation

```
    |
```

PostgreSQL

```id="u7x2e5"

---

Responsibilities:

| Layer | Responsibility |
|-|-|
| Controller | Receive request |
| Use Case | Execute operation |
| Entity | Apply business rules |
| Repository | Persist data |
| Database | Store information |

---

# 8. Repository Dependency Inversion

A key Clean Architecture concept:

The domain defines interfaces.

Example:

```

domain

InternshipRepository

(interface)

```id="9x3v4a"

---

Infrastructure implements:

```

JpaInternshipRepository

(implementation)

```id="c4x7s1"

---

Result:

The business layer does not depend on PostgreSQL.

---

# 9. Clean Architecture with Spring Boot

Spring Boot components mapping:

| Clean Layer | Spring Component |
|-|-|
| Domain | Entities, Rules |
| Application | Services, Use Cases |
| Adapter | Controllers, DTOs |
| Infrastructure | Repositories, Configurations |

---

# 10. Clean Architecture with Flutter

The mobile application follows a similar structure.

Architecture:

```

Presentation Layer

```
    |
```

Domain Layer

```
    |
```

Data Layer

```id="7y3z2q"

---

## Presentation

Contains:

```

Pages

Widgets

Controllers

```id="y0m3w4"

---

## Domain

Contains:

```

Entities

Use Cases

Repository Interfaces

```id="s2n8v5"

---

## Data

Contains:

```

API Clients

Local Storage

Repository Implementations

```id="q9k4pd"

---

# 11. Clean Architecture and SOLID

Clean Architecture naturally applies SOLID.

Examples:

## Dependency Inversion

Use cases depend on interfaces.

---

## Single Responsibility

Each layer has a specific role.

---

## Open/Closed

New infrastructure can be added without changing business logic.

---

# 12. Benefits for STEG Platform

## Maintainability

Business rules remain centralized.

---

## Scalability

New modules can be added:

Examples:

```

Leave Management

Internal Requests

Purchasing Workflow

```id="8h2k5m"

without redesigning the system.

---

## Testability

Business logic can be tested without:

- Database.
- API.
- External services.

---

## Technology Independence

Possible future changes:

```

PostgreSQL

```
    →
```

Another Database

Spring Boot

```
    →
```

Another Backend Framework

```id="x7m3p9"

without affecting the domain.

---

# 13. Testing Strategy

Clean Architecture enables:

## Domain Tests

Test:

- Business rules.
- Entity behavior.

---

## Use Case Tests

Test:

- Application workflows.

---

## Adapter Tests

Test:

- API contracts.

---

## Infrastructure Tests

Test:

- Database integration.

---

# 14. Common Mistakes To Avoid

## Business Logic in Controllers

Avoid:

```

Controller

```
|
Business Rules
```

```id="r8w4kf"

---

## Database Entities as Domain Models

Avoid coupling:

```

JPA Entity

=

Business Entity

```id="n4m7sd"

---

## Framework Dependency in Domain

Avoid:

```

@Entity

inside

domain layer

```id="b5k2za"

---

## Fat Services

Avoid:

```

One Service

handles everything

```id="v2m8cx"

---

# 15. Evolution Toward Microservices

Clean Architecture prepares the platform for future extraction.

Example:

Current:

```

Internship Module

inside

Monolith

```id="j6s9wd"

Future:

```

Internship Microservice

with

same domain logic

```id="p4w8cz"

---

# 16. Implementation Guidelines

Developers should:

- Keep domain logic pure.
- Use interfaces between layers.
- Avoid unnecessary dependencies.
- Keep infrastructure replaceable.
- Write tests for business rules.
- Maintain clear module boundaries.

---

# 17. Conclusion

Clean Architecture provides the foundation for building a robust and scalable STEG digital platform.

By separating business rules from technical implementation, the system becomes:

- Easier to maintain.
- Easier to test.
- More secure.
- More adaptable.
- Ready for future evolution toward microservices.

This architecture ensures that the platform can support current internship management requirements while remaining flexible enough to integrate future administrative digital services within STEG.