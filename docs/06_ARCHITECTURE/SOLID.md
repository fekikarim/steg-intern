# SOLID Principles

## 1. Purpose

This document defines how the **SOLID principles** are applied within the **STEG Intelligent Internship Management Platform**.

SOLID principles are fundamental object-oriented design principles that help create software that is:

- Maintainable.
- Flexible.
- Testable.
- Extensible.
- Easier to evolve.

The platform applies these principles mainly in:

- Spring Boot backend.
- Angular / Next.js frontend services.
- Flutter mobile architecture.

---

# 2. Overview of SOLID Principles

SOLID represents five principles:

| Principle | Meaning |
|-|-|
| S | Single Responsibility Principle |
| O | Open/Closed Principle |
| L | Liskov Substitution Principle |
| I | Interface Segregation Principle |
| D | Dependency Inversion Principle |

---

# 3. Single Responsibility Principle (SRP)

## Definition

A class should have only one reason to change.

A component must focus on one responsibility only.

---

# 3.1 Application in Backend

Bad design:

```

InternshipService

* Create internship
* Generate PDF
* Send emails
* Save files
* Validate permissions

```

Problem:

The service becomes responsible for multiple domains.

---

Better design:

```

InternshipService

```
    |
```

Handles internship business rules

DocumentService

```
    |
```

Generates documents

NotificationService

```
    |
```

Sends notifications

AuthorizationService

```
    |
```

Checks permissions

```

---

# 3.2 Example Structure

```

internship

├── InternshipService

├── InternshipValidator

├── InternshipMapper

└── InternshipRepository

```

Each component has a specific responsibility.

---

# 3.3 Benefits

- Easier maintenance.
- Smaller classes.
- Better testing.
- Lower coupling.

---

# 4. Open/Closed Principle (OCP)

## Definition

Software entities should be:

```

Open for extension

Closed for modification

```

New features should be added without modifying existing stable code.

---

# 4.1 Example: Notification System

Initial implementation:

```

NotificationService

```
|
```

if EMAIL

else PUSH

else IN_APP

```

Problem:

Adding new channels requires modifying existing code.

---

Better implementation:

```

NotificationStrategy

```
    |
```

---

EmailNotification

PushNotification

InAppNotification

```

Adding:

```

SMSNotification

```

does not require changing existing strategies.

---

# 4.2 Application Areas

Applied to:

- Notification providers.
- Document generators.
- Payment methods.
- Workflow actions.

---

# 4.3 Benefits

- Safer evolution.
- Reduced regression risks.
- Easier feature addition.

---

# 5. Liskov Substitution Principle (LSP)

## Definition

Objects of a parent type should be replaceable with objects of child types without breaking the application.

---

# 5.1 Example: Employee Hierarchy

The platform contains:

```

Employee

```
|
```

---

Supervisor

HRManager

FinanceManager

Director

Administrator

```

Any employee should behave correctly wherever an Employee object is expected.

---

Example:

```

Employee employee;

employee.getDepartment();
employee.getName();

```

Works for:

```

Supervisor

HRManager

Director

```

---

# 5.2 Avoiding Violations

Bad example:

```

Employee

calculatePayment()

```

because not every employee has the same payment logic.

---

Better:

```

Employee

```
    |
```

PaymentEligibleEmployee

```

or handled by:

```

PaymentService

```

---

# 5.3 Benefits

- Reliable inheritance.
- Better polymorphism.
- Cleaner domain modeling.

---

# 6. Interface Segregation Principle (ISP)

## Definition

A class should not depend on methods it does not use.

Prefer small and specific interfaces.

---

# 6.1 Bad Design

Large interface:

```

PlatformUserService

* createUser()

* approveInternship()

* generatePayment()

* evaluateIntern()

* sendNotification()

```

Problem:

Every implementation depends on unnecessary methods.

---

# 6.2 Better Design

Separate interfaces:

```

UserManagementService

InternshipApprovalService

PaymentApprovalService

EvaluationService

NotificationService

```

---

# 6.3 Application Example

Instead of:

```

DocumentManager

```

containing:

```

upload()

generate()

validate()

delete()

notify()

```

Use:

```

DocumentUploader

DocumentGenerator

DocumentValidator

```

---

# 6.4 Benefits

- Cleaner contracts.
- Easier implementation.
- Reduced dependencies.

---

# 7. Dependency Inversion Principle (DIP)

## Definition

High-level modules should not depend on low-level modules.

Both should depend on abstractions.

---

# 7.1 Backend Example

Bad design:

```

InternshipService

```
    |
```

PostgreSQLRepository

```

The business layer directly depends on database technology.

---

Better:

```

InternshipService

```
    |
```

InternshipRepository Interface

```
    |
```

---

PostgreSQLRepository

MongoRepository

```

---

# 7.2 Example

Service:

```

public class InternshipService {

private final InternshipRepository repository;

}

```

The service does not know:

- PostgreSQL.
- Hibernate.
- Database details.

---

# 7.3 Benefits

- Easier replacement of technologies.
- Better unit testing.
- Reduced coupling.

---

# 8. SOLID Application by Layer

## Backend

| Layer | SOLID Application |
|-|-|
| Controllers | Single responsibility |
| Services | Business isolation |
| Repositories | Dependency inversion |
| DTOs | Separation of concerns |
| Interfaces | Interface segregation |
| Strategies | Open/closed principle |

---

# 9. SOLID in Frontend

## Component Responsibility

Each component should manage one UI responsibility.

Example:

Bad:

```

InternshipPage

* Fetch data
* Validate forms
* Generate reports
* Handle notifications

```

---

Better:

```

InternshipPage

```
    |
```

InternshipService

```
    |
```

InternshipCard

```
    |
```

ValidationService

```

---

# 10. SOLID in Mobile Application

Flutter architecture:

```

Presentation Layer

```
    |
```

Use Cases

```
    |
```

Repository Interfaces

```
    |
```

Data Sources

```

---

Applied principles:

## SRP

Each screen handles only UI.

## DIP

Business logic depends on repository abstractions.

## ISP

Small interfaces for each feature.

---

# 11. SOLID and Clean Architecture

The platform follows:

```

```
            Frameworks

                |

          Adapters

                |

          Use Cases

                |

          Entities
```

```

Dependencies point inward.

---

Example:

```

Controller

```
↓
```

Service Interface

```
↓
```

Domain Model

```
↓
```

Repository Interface

```

---

# 12. SOLID and Domain Driven Design

The domain model respects SOLID principles.

Examples:

## Internship Aggregate

Responsible for:

- Internship state.
- Lifecycle rules.

Not responsible for:

- Sending emails.
- Generating PDFs.
- Database operations.

---

## Workflow Aggregate

Responsible for:

- Workflow transitions.
- Validation rules.

Not responsible for:

- User interfaces.
- Notifications.

---

# 13. Common SOLID Violations To Avoid

## God Classes

Avoid:

```

ApplicationManager.java

2000+ lines

```

---

## Fat Controllers

Controllers should not contain business logic.

---

## Direct Database Access

Avoid:

```

Controller

```
    |
```

Repository

```

---

## Excessive Inheritance

Prefer:

```

Composition over inheritance

```

---

## Hard-Coded Logic

Avoid:

```

if(role == "ADMIN")

```

everywhere.

Use:

```

Permission system

```

---

# 14. Testing Benefits

SOLID improves testing.

Example:

Before:

```

Service

```
    |
```

Real Database

```

Hard to test.

---

After:

```

Service

```
    |
```

Mock Repository

```

Easy unit testing.

---

# 15. Development Guidelines

Developers should:

- Keep classes focused.
- Prefer interfaces for important boundaries.
- Avoid unnecessary inheritance.
- Separate business rules from technical details.
- Design components for extension.
- Maintain low coupling.

---

# 16. Conclusion

Applying SOLID principles ensures that the STEG Intelligent Internship Management Platform remains:

- Clean.
- Flexible.
- Maintainable.
- Testable.
- Scalable.

Combined with Clean Architecture and Domain-Driven Design, SOLID provides the foundation for building an enterprise-level digital platform capable of evolving with future STEG requirements.