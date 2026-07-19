# Microservices Architecture

## 1. Purpose

This document defines the microservices evolution strategy of the **STEG Intelligent Internship Management Platform**.

The initial implementation follows a **Modular Monolith Architecture** to ensure simplicity, consistency, and efficient development.

However, the system is designed with clear domain boundaries that allow future migration toward a microservices architecture when business requirements, scalability needs, or organizational constraints justify this evolution.

---

# 2. Current Architecture Decision

## Initial Approach

The first version of the platform uses:

```

Modular Monolith

Spring Boot Application

*

PostgreSQL Database

```

Advantages:

- Easier deployment.
- Lower infrastructure complexity.
- Faster development.
- Strong transactional consistency.
- Simplified maintenance.

---

# 3. Future Microservices Vision

The platform can evolve into:

```

```
                API Gateway

                     |
```

---

|          |          |          |             |

Auth     User     Internship  Workflow   Document

Service  Service  Service     Service    Service

|          |          |          |             |

Database  Database Database  Database   Storage

```

Each service becomes responsible for one business domain.

---

# 4. Microservices Principles

The future architecture follows:

- Domain-driven boundaries.
- Independent deployment.
- Independent scaling.
- Service ownership.
- API-based communication.
- Event-driven communication when required.

---

# 5. Proposed Microservices

## 5.1 Authentication Service

### Responsibility

Manages identity and security.

Responsibilities:

- User authentication.
- JWT generation.
- Refresh tokens.
- Sessions.
- Password management.

Main entities:

```

User

Role

Permission

RefreshToken

Session

```

---

Communication:

```

All services

```
    |
```

Authentication Service

```

---

# 5.2 User Management Service

## Responsibility

Manages platform users and organizational profiles.

Responsibilities:

- Employees.
- Candidates.
- Roles.
- Permissions.

Entities:

```

Employee

Candidate

Department

```

---

# 5.3 Internship Management Service

## Responsibility

Core business service.

Responsibilities:

- Internship lifecycle.
- Internship assignments.
- Supervisor assignment.
- Internship status management.

Entities:

```

Internship

InternshipAssignment

InternshipApplication

```

---

# 5.4 Workflow Service

## Responsibility

Centralized administrative workflow engine.

Responsibilities:

- Approval processes.
- Validation steps.
- Decision tracking.
- Workflow execution.

Entities:

```

Workflow

WorkflowStep

WorkflowAction

```

---

Example:

```

Internship Application

```
    |
```

HR Validation

```
    |
```

Supervisor Assignment

```
    |
```

Final Approval

```

---

# 5.5 Document Management Service

## Responsibility

Manages all platform documents.

Responsibilities:

- Upload.
- Storage.
- Versioning.
- Document generation.
- Verification.

Entities:

```

Document

ApplicationDocument

Certificate

```

---

Storage:

```

Object Storage

*

Metadata Database

```

---

# 5.6 Notification Service

## Responsibility

Central notification system.

Channels:

```

Email

Push Notification

In-App Notification

```

Responsibilities:

- Notification creation.
- Delivery.
- Tracking.
- User preferences.

---

Communication:

```

Other Services

```
    |
```

Notification Service

```
    |
```

External Providers

```

---

# 5.7 Evaluation Service

## Responsibility

Manages internship evaluations.

Responsibilities:

- Evaluation criteria.
- Scores.
- Feedback.
- Supervisor evaluations.

Entities:

```

Evaluation

EvaluationCriterion

EvaluationScore

```

---

# 5.8 Payment Service

## Responsibility

Handles internship indemnities.

Responsibilities:

- Payment creation.
- Validation.
- Approval.
- Payment status.

Entity:

```

Payment

```

---

# 5.9 Audit Service

## Responsibility

Centralized traceability.

Responsibilities:

- Record system actions.
- Track modifications.
- Maintain compliance logs.

Entity:

```

AuditLog

```

---

# 6. Communication Between Services

Two communication approaches are possible.

---

# 6.1 Synchronous Communication

Using:

```

REST APIs

or

gRPC

```

Example:

```

Internship Service

```
    |
```

Authentication Service

```
    |
```

Validate User

```

---

Used for:

- Immediate responses.
- Validation.
- Data retrieval.

---

# 6.2 Asynchronous Communication

Using:

```

Message Broker

Example:

RabbitMQ

Kafka

```

Example:

```

Internship Created Event

```
    |
```

Notification Service

```
    |
```

Send Notification

```

---

Used for:

- Notifications.
- Background processing.
- Long operations.

---

# 7. Event-Driven Architecture

Future events:

```

UserCreated

InternshipCreated

ApplicationSubmitted

WorkflowCompleted

DocumentGenerated

PaymentValidated

```

---

Example:

```

Application Submitted

```
    |
```

Event Published

```
    |
```

---

|                          |

Workflow Service      Notification Service

```

---

# 8. Database Strategy

Possible approaches:

## Current

Single database:

```

PostgreSQL

All modules

```

---

## Microservices Future

Database per service:

```

Auth Database

User Database

Internship Database

Document Database

Payment Database

```

Benefits:

- Service independence.
- Better scalability.
- Data ownership.

---

# 9. API Gateway

The API Gateway becomes the single entry point.

Responsibilities:

- Request routing.
- Authentication verification.
- Rate limiting.
- Logging.
- Load balancing.

Architecture:

```

Client Applications

```
    |
```

API Gateway

```
    |
```

Microservices

```

---

# 10. Service Discovery

For large deployments:

Possible solutions:

```

Eureka

Consul

Kubernetes Service Discovery

```

Purpose:

- Locate services.
- Manage dynamic instances.

---

# 11. Configuration Management

Centralized configuration:

Possible solutions:

```

Spring Cloud Config

Environment Variables

Secrets Management

```

Managed configurations:

- Database connections.
- API keys.
- Security settings.

---

# 12. Security in Microservices

Security mechanisms:

## Authentication

Centralized:

```

Authentication Service

```

---

## Authorization

Each service validates:

```

JWT Token

*

Permissions

```

---

## Communication Security

Required:

- HTTPS.
- Service authentication.
- Secure internal communication.

---

# 13. Deployment Architecture

Possible production architecture:

```

```
             Users

               |

          Load Balancer

               |

          API Gateway

               |
```

---

|       |        |        |        |

Auth   User   Internship Workflow Document

```
               |

          PostgreSQL

               |

      Monitoring Infrastructure
```

```

---

# 14. Containerization

Recommended technologies:

```

Docker

*

Docker Compose

*

Kubernetes (future)

```

Each service becomes a container.

Example:

```

auth-service-container

internship-service-container

document-service-container

```

---

# 15. Monitoring and Observability

Future implementation:

## Logging

```

ELK Stack

or

Grafana Loki

```

---

## Metrics

```

Prometheus

*

Grafana

```

---

## Tracing

```

OpenTelemetry

```

---

# 16. Migration Strategy

The migration should follow the **Strangler Pattern**.

Steps:

## Phase 1

Maintain modular monolith.

---

## Phase 2

Extract independent modules.

Example:

```

Notification Service

Document Service

```

---

## Phase 3

Extract business-critical services.

Example:

```

Internship Service

Workflow Service

```

---

## Phase 4

Complete microservices ecosystem.

---

# 17. When To Adopt Microservices

Migration is recommended when:

- User volume increases significantly.
- Independent scaling is required.
- Teams need autonomous deployment.
- Processing workloads become heavy.
- System integrations multiply.

---

# 18. Risks and Challenges

Microservices introduce:

## Complexity

More deployments and configurations.

---

## Distributed Transactions

Requires:

- Eventual consistency.
- Saga pattern.

---

## Monitoring Requirements

Requires:

- Central logging.
- Distributed tracing.

---

## Infrastructure Cost

Requires:

- More servers.
- Container orchestration.

---

# 19. Design Decision

For the STEG internship project:

```

Recommended Implementation:

Modular Monolith

*

Microservices Ready Architecture

```

Reason:

- Appropriate for project scope.
- Easier development.
- Strong maintainability.
- Future scalability.

---

# 20. Conclusion

The STEG platform is architected to support future microservices evolution without requiring a complete redesign.

The current modular monolith approach provides simplicity and reliability, while clear domain separation ensures that business modules can progressively become independent services when scalability and organizational needs require it.