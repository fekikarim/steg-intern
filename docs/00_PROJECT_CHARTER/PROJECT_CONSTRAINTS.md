# PROJECT_CONSTRAINTS.md

Version: 1.0  
Status: Approved  
Project: STEG Smart Internship & Administrative Workflow Platform

---

# 1. Purpose

This document defines the constraints that govern the design, development, deployment, and maintenance of the STEG Smart Internship & Administrative Workflow Platform.

Project constraints represent mandatory conditions that must be respected throughout the software development lifecycle. They influence architectural decisions, technology selection, implementation strategies, and project planning.

Unlike project risks, which are uncertain future events, constraints are fixed limitations or requirements that must always be considered.

---

# 2. Functional Constraints

## FC-01 — Compliance with Business Processes

The platform shall respect the existing internship management procedures defined by STEG.

Digital workflows must automate administrative operations without altering the organization's official approval process.

---

## FC-02 — Complete Internship Lifecycle

The system shall support the entire internship lifecycle, including:

- Internship application
- Administrative review
- Internship assignment
- Daily internship monitoring
- Evaluations
- Deliverables
- Administrative documents
- Internship completion
- Payment management

---

## FC-03 — Role-Based Operations

Each operation shall be accessible only to authorized actors according to their responsibilities.

Supported user profiles include:

- Candidate
- Intern
- Supervisor
- HR Manager
- Finance Manager
- Director
- Administrator

---

## FC-04 — Workflow Validation

Administrative decisions shall follow predefined workflow steps.

No sensitive operation (approval, validation, assignment, payment) may bypass the workflow engine.

---

# 3. Technical Constraints

## TC-01 — Mandatory Technology Stack

The project shall be developed using the technologies defined in the project specification.

| Layer | Technology |
|--------|------------|
| Front Office | Next.js |
| Back Office | Angular |
| Mobile | Flutter |
| Backend | Spring Boot 3 |
| Database | PostgreSQL |
| API | REST |
| Authentication | JWT + Refresh Token |
| Authorization | RBAC |
| Documentation | Swagger / OpenAPI |
| Version Control | Git & GitHub |

The selected technologies shall remain consistent throughout Version 1.0 unless formally approved.

---

## TC-02 — Shared Backend

All client applications shall communicate with a single centralized backend.

Business logic must never be duplicated across clients.

The backend remains the single source of truth for all business operations.

---

## TC-03 — Modular Architecture

The software architecture shall remain modular and organized into independent bounded contexts following Domain-Driven Design (DDD) principles.

Each module must own its business logic while interacting with other modules through well-defined interfaces.

---

## TC-04 — API-First Communication

Communication between all applications shall occur exclusively through documented REST APIs.

Direct database access from client applications is strictly prohibited.

---

## TC-05 — Object Storage

Uploaded documents and deliverables shall be stored using object storage rather than the server's local filesystem.

The application database stores only metadata describing each stored file.

---

# 4. Security Constraints

## SC-01 — Authentication

Every authenticated user shall be verified using JWT Access Tokens combined with Refresh Tokens.

Anonymous users may access only public functionalities.

---

## SC-02 — Authorization

Authorization shall be implemented using Role-Based Access Control (RBAC).

Every request must be verified before executing any protected business operation.

---

## SC-03 — HTTPS Communication

All communications between clients and backend services shall be encrypted using HTTPS.

Unencrypted communication is not permitted in production environments.

---

## SC-04 — Password Protection

User passwords shall never be stored in plain text.

Passwords must be securely hashed using industry-standard cryptographic algorithms.

---

## SC-05 — Auditability

Critical business operations shall be recorded within the audit logging system.

The audit trail must include:

- User
- Timestamp
- Action
- Target entity
- Previous state
- New state

This ensures complete traceability of administrative activities.

---

## SC-06 — Data Privacy

Personal information shall be processed according to applicable data protection principles.

Access to sensitive information shall be restricted to authorized users only.

---

# 5. Data Constraints

## DC-01 — Data Integrity

The database shall enforce referential integrity between related entities.

Business rules shall prevent inconsistent or orphaned records.

---

## DC-02 — Transaction Consistency

Critical business operations shall execute within transactional boundaries to preserve database consistency.

Partial updates must never leave the system in an invalid state.

---

## DC-03 — Unique Business References

Business entities requiring official references (applications, internships, payments, documents) shall use unique identifiers.

Duplicate references are prohibited.

---

## DC-04 — Monetary Precision

Financial values shall use decimal precision.

Floating-point data types shall never be used for monetary calculations.

---

# 6. Performance Constraints

The platform shall provide acceptable response times under normal operating conditions.

Performance optimization should focus on:

- Efficient database queries
- Optimized REST communication
- Pagination of large datasets
- Lazy loading where appropriate
- Appropriate indexing strategies

---

# 7. Maintainability Constraints

The software shall remain maintainable throughout its lifecycle.

Development must follow established engineering practices including:

- Clean Architecture
- SOLID Principles
- Separation of Concerns
- Domain-Driven Design
- Layered Architecture
- Meaningful naming conventions
- Comprehensive documentation

Business logic must remain independent from presentation technologies.

---

# 8. Documentation Constraints

Every significant architectural decision shall be documented.

The project documentation shall remain synchronized with the implementation throughout development.

Documentation is considered part of the deliverable and not an optional artifact.

---

# 9. Project Constraints

The project is developed within the context of an engineering internship.

The following constraints therefore apply:

- Limited project duration
- Academic evaluation requirements
- Continuous validation with the internship supervisor
- Progressive delivery of project artifacts
- Compliance with the approved Cahier des Charges

---

# 10. Future Evolution Constraints

Version 1.0 shall not compromise future extensibility.

Architectural decisions must facilitate future integration of features such as:

- Electronic signatures
- OCR
- Artificial Intelligence
- Offline synchronization
- Enterprise integrations
- Additional administrative modules

Future extensions should require minimal modification to the existing architecture.

---

# 11. Assumptions

The project is developed under the following assumptions:

- Users have access to modern web browsers.
- Internet connectivity is available for online operations.
- PostgreSQL is available as the primary relational database.
- The selected technology stack remains supported throughout the project.
- STEG administrative procedures remain generally stable during Version 1.0 development.

---

# 12. Constraint Compliance

Every architectural, functional, and technical decision made during the project shall be evaluated against the constraints defined in this document.

No implementation should violate these constraints unless a formal architectural review justifies an approved exception.

Compliance with these constraints is mandatory to ensure the platform remains secure, maintainable, scalable, and aligned with both the project objectives and the long-term vision.