# Design Patterns

## 1. Purpose

This document defines the software design patterns used in the **STEG Intelligent Internship Management Platform**.

The objective of applying design patterns is to:

- Improve code maintainability.
- Reduce complexity.
- Promote reusable solutions.
- Ensure clean separation of responsibilities.
- Facilitate future evolution of the platform.

The system applies patterns across:

- Backend.
- Frontend.
- Mobile application.
- Database access.
- Security.
- Integration layers.

---

# 2. Design Pattern Strategy

The platform follows:

```

Object-Oriented Design Principles

*

SOLID Principles

*

Clean Architecture

*

Domain Driven Design

```

Design patterns are applied only when they solve real architectural problems.

---

# 3. Backend Design Patterns

The backend uses Spring Boot and follows enterprise-level patterns.

---

# 3.1 Layered Architecture Pattern

## Purpose

Separates the system into independent layers.

Architecture:

```

Controller Layer

```
    |
```

Service Layer

```
    |
```

Repository Layer

```
    |
```

Database Layer

```

---

## Usage

Applied throughout the backend.

Example:

```

InternshipController

```
    |
```

InternshipService

```
    |
```

InternshipRepository

```
    |
```

PostgreSQL

```

---

## Benefits

- Clear responsibilities.
- Easier testing.
- Better maintainability.

---

# 3.2 Repository Pattern

## Purpose

Abstracts database operations from business logic.

Structure:

```

Service

```
|
```

Repository Interface

```
|
```

JPA Repository

```
|
```

Database

```

---

## Example

```

InternshipRepository

```

Responsibilities:

- Save internship.
- Search internships.
- Update internship status.

---

## Benefits

- Database independence.
- Easier unit testing.
- Cleaner business logic.

---

# 3.3 Service Layer Pattern

## Purpose

Encapsulates business operations.

Example:

```

InternshipService

```

Handles:

- Internship creation.
- Assignment rules.
- Workflow triggering.

---

## Benefits

Avoids placing business logic inside:

- Controllers.
- Entities.
- Repositories.

---

# 3.4 DTO Pattern (Data Transfer Object)

## Purpose

Separates API models from database entities.

Flow:

```

Entity

```
|
```

Mapper

```
|
```

DTO

```
|
```

REST Response

```

---

Example:

Entity:

```

Internship

```

DTO:

```

InternshipResponseDTO

```

---

Benefits:

- Security.
- API flexibility.
- Prevents entity exposure.

---

# 3.5 Mapper Pattern

## Purpose

Converts between objects.

Example:

```

InternshipEntity

```
    |
```

InternshipMapper

```
    |
```

InternshipDTO

```

---

Possible implementation:

- MapStruct.
- Manual mapping.

---

# 3.6 Dependency Injection Pattern

## Purpose

Provides dependencies externally instead of creating them manually.

Spring Boot example:

```

@Service

@Repository

@Component

```

---

Example:

```

InternshipService

receives

InternshipRepository

```

---

Benefits:

- Loose coupling.
- Easier testing.
- Better flexibility.

---

# 3.7 Factory Pattern

## Purpose

Creates objects dynamically depending on requirements.

---

## Usage Example

Document generation.

Different document types:

```

Internship Convention

Assignment Letter

Internship Certificate

```

Factory:

```

DocumentFactory

```

returns the correct generator.

---

Benefits:

- Avoids large conditional blocks.
- Simplifies future additions.

---

# 3.8 Strategy Pattern

## Purpose

Allows interchangeable business algorithms.

---

## Usage Example

Notification sending:

```

NotificationStrategy

```
    |
```

---

EmailStrategy

PushStrategy

InAppStrategy

```

---

Benefits:

- Easy addition of new notification channels.
- Cleaner code.

---

# 3.9 Observer Pattern

## Purpose

Allows objects to react automatically to events.

---

## Usage Example

Internship lifecycle events:

```

Internship Accepted

```
    |
```

Observers

```
    |
```

---

Notification Service

Audit Service

```

---

Benefits:

- Loose coupling.
- Event-driven capabilities.

---

# 3.10 Template Method Pattern

## Purpose

Defines common workflow steps while allowing customization.

---

## Usage Example

Document generation:

Common process:

```

Validate Data

Generate Content

Create PDF

Store Document

```

Different documents customize generation details.

---

# 3.11 Builder Pattern

## Purpose

Creates complex objects step by step.

---

## Usage Example

Creating notifications:

```

Notification.builder()

.title()

.message()

.priority()

.build()

```

---

Benefits:

- Cleaner object creation.
- Better readability.

---

# 3.12 Specification Pattern

## Purpose

Builds dynamic database queries.

---

## Usage Example

Internship filtering:

```

Status = ACTIVE

*

Department = IT

*

Supervisor = X

```

---

Benefits:

- Flexible search.
- Avoids many repository methods.

---

# 4. Security Design Patterns

---

# 4.1 Authentication Filter Pattern

## Purpose

Intercepts requests before controllers.

Flow:

```

HTTP Request

```
    |
```

JWT Filter

```
    |
```

Validate Token

```
    |
```

Controller

```

---

Used for:

- JWT validation.
- User identification.

---

# 4.2 Role-Based Access Control Pattern

## Purpose

Controls access based on roles.

Example:

```

ADMIN

HR_MANAGER

SUPERVISOR

FINANCE_MANAGER

```

---

Implementation:

```

Spring Security

*

Permissions

```

---

# 5. Frontend Design Patterns

---

# 5.1 Component-Based Pattern

## Purpose

Builds interfaces using reusable components.

Example:

```

InternshipCard

DocumentTable

StatusBadge

```

---

Benefits:

- Reusability.
- Consistency.
- Easier maintenance.

---

# 5.2 Container / Presentational Pattern

## Purpose

Separates logic from UI.

Structure:

```

Container Component

```
    |
```

Business Logic

```
    |
```

Presentational Component

```
    |
```

UI

```

---

Benefits:

- Cleaner components.
- Easier testing.

---

# 5.3 State Management Pattern

## Purpose

Centralizes application state.

Examples:

```

Authentication State

User Profile

Internship Data

```

Technologies:

Angular:

```

Services

Signals

RxJS

```

Next.js:

```

Hooks

Context API

```

---

# 5.4 Facade Pattern

## Purpose

Provides simplified access to complex frontend services.

Example:

```

InternshipFacade

```
    |
```

---

API Service

State Management

Cache

```

---

Benefits:

- Cleaner components.
- Reduced coupling.

---

# 6. Mobile Design Patterns

---

# 6.1 MVVM Pattern

## Purpose

Separates UI from application logic.

Architecture:

```

View

|

ViewModel

|

Model

```

---

Flutter example:

```

JournalPage

```
    |
```

JournalController

```
    |
```

JournalRepository

```

---

# 6.2 Repository Pattern

Used to abstract:

- Remote API.
- Local database.
- Cache.

Architecture:

```

Use Case

```
|
```

Repository

```
|
```

---

API

Local Storage

```

---

# 6.3 Dependency Injection Pattern

Used for:

- Services.
- Repositories.
- Controllers.

Possible tools:

```

GetIt

Riverpod

Bloc Providers

```

---

# 6.4 Adapter Pattern

## Purpose

Converts incompatible interfaces.

---

## Usage Example

Different storage systems:

```

Local Storage Adapter

```
    |
```

SQLite

```
    |
```

Hive

```

---

# 7. Database Patterns

---

# 7.1 Active Record Avoidance

The project avoids putting database logic inside entities.

Preferred approach:

```

Entity

*

Repository

*

Service

```

---

# 7.2 Unit Of Work Pattern

## Purpose

Maintains consistency during transactions.

Example:

Creating internship:

```

Create Internship

*

Create Assignment

*

Start Workflow

```

All operations succeed or rollback together.

---

# 7.3 Database Migration Pattern

## Purpose

Controls database evolution.

Tools:

```

Flyway

or

Liquibase

```

---

Example:

```

V1_Create_Users_Table

V2_Create_Internships_Table

V3_Add_Workflow

```

---

# 8. Integration Patterns

---

# 8.1 API Gateway Pattern

Future microservices architecture:

```

Clients

|

API Gateway

|

Services

```

Responsibilities:

- Routing.
- Security.
- Rate limiting.

---

# 8.2 Event-Driven Pattern

Used for asynchronous operations.

Example:

```

Application Submitted

```
    |
```

Event

```
    |
```

Notification Service

```

---

# 8.3 Adapter Pattern

Used for external integrations.

Examples:

```

Email Provider

Storage Provider

Notification Provider

```

---

# 9. Patterns Summary

| Pattern | Usage |
|-|-|
| Layered Architecture | Backend organization |
| Repository | Database abstraction |
| Service Layer | Business logic |
| DTO | API data transfer |
| Mapper | Object conversion |
| Dependency Injection | Loose coupling |
| Factory | Dynamic object creation |
| Strategy | Interchangeable behaviors |
| Observer | Event reactions |
| Builder | Complex object creation |
| Specification | Dynamic queries |
| MVVM | Mobile architecture |
| Facade | Frontend simplification |
| Adapter | External integrations |
| Unit Of Work | Transactions |

---

# 10. Design Pattern Guidelines

Developers should:

- Prefer simplicity over unnecessary abstraction.
- Apply patterns only when they solve a problem.
- Keep business logic independent from frameworks.
- Avoid excessive coupling.
- Maintain consistency across modules.

---

# 11. Conclusion

The STEG Internship Management Platform uses proven design patterns to build a professional and maintainable software architecture.

The combination of Repository, Service Layer, DTO, Dependency Injection, Strategy, Observer, MVVM, and other patterns ensures that the system remains scalable, testable, and ready for future evolution.