# Non-Functional Requirements

## STEG Smart Internship & Administrative Workflow Platform

**Project:** Digital Platform for Internship Management and Administrative Workflow Automation  
**Version:** 1.0  
**Document Type:** Non-Functional Requirements Specification  

**Related Documents:**

- Functional Requirements Specification
- Product Vision
- System Architecture
- Domain Master Class Diagram
- Security Architecture
- Deployment Strategy


---

# 1. Introduction

## 1.1 Purpose

This document defines the non-functional requirements of the STEG Smart Internship & Administrative Workflow Platform.

Unlike functional requirements that describe **what the system does**, non-functional requirements define **how the system must operate** in terms of:

- Security
- Performance
- Reliability
- Scalability
- Maintainability
- Availability
- Usability
- Compatibility
- Evolution capability


These requirements ensure that the platform is not only operational but also production-ready, secure, maintainable, and adaptable for future needs.


---

# 2. Quality Attributes Overview

The platform shall respect the following quality attributes:

| Category | Objective |
|---|---|
| Security | Protect sensitive internship and employee information |
| Performance | Provide fast response times and efficient processing |
| Availability | Ensure continuous access to critical services |
| Reliability | Guarantee consistent and correct operations |
| Scalability | Support increasing users and data volume |
| Maintainability | Facilitate future development and maintenance |
| Usability | Provide intuitive interfaces for all actors |
| Portability | Support deployment in different environments |
| Evolvability | Allow future features and integrations |


---

# 3. Security Requirements

## NFR-SEC-001 Secure Authentication

The platform shall implement secure authentication mechanisms.

Requirements:

- Passwords must never be stored in plain text.
- Passwords must be hashed using secure algorithms.
- Authentication must use token-based security.
- Sessions must expire automatically.

Expected implementation:

- JWT Access Token
- Refresh Token
- Secure password hashing (BCrypt/Argon2)


Related domain:

- User
- RefreshToken
- Session


---

## NFR-SEC-002 Authorization and Access Control

The platform shall enforce Role-Based Access Control (RBAC).

Every protected operation must verify:

- User identity
- User role
- Required permission


Examples:

A student cannot:

- Access another student's internship information.
- Modify supervisor evaluations.

A supervisor cannot:

- Modify financial payments.


Related domain:

- Role
- Permission
- User


---

## NFR-SEC-003 Data Protection

Sensitive information must be protected.

Protected data includes:

- Candidate personal information
- Employee information
- Documents
- Evaluations
- Payment information


Security measures:

- HTTPS communication
- Database access protection
- Secure file storage
- Input validation
- Protection against injection attacks


---

## NFR-SEC-004 Auditability

Critical business actions must be traceable.

The system shall record:

- User responsible
- Action performed
- Date/time
- Modified entity
- Previous state
- New state


Related entity:

- AuditLog


---

## NFR-SEC-005 File Security

Uploaded documents shall respect security constraints.

Requirements:

- File type validation
- File size limitation
- Malware scanning capability
- Secure object storage
- Access authorization before download


---

# 4. Performance Requirements

## NFR-PERF-001 Response Time

The system should provide acceptable response times.

Target:

| Operation | Maximum Response Time |
|-|-|
| Authentication | < 2 seconds |
| Standard API requests | < 1 second |
| Dashboard loading | < 3 seconds |
| Document upload | Depends on file size/network |


---

## NFR-PERF-002 Efficient Database Access

The system shall optimize database operations.

Requirements:

- Proper indexing
- Optimized queries
- Avoid unnecessary database calls
- Pagination for large datasets


Examples:

- Internship list pagination
- Candidate search optimization
- Notification history pagination


---

## NFR-PERF-003 Concurrent Users

The platform shall support multiple simultaneous users.

Expected users:

- Candidates
- Interns
- Supervisors
- HR agents
- Financial agents
- Directors
- Administrators


The architecture must allow horizontal scaling when needed.


---

# 5. Availability Requirements

## NFR-AVL-001 System Availability

The platform should remain accessible during normal working periods.

Target:

- High availability architecture
- Minimal downtime
- Automated recovery mechanisms


---

## NFR-AVL-002 Fault Recovery

The system shall recover from failures.

Required mechanisms:

- Database backup
- Error logging
- Service monitoring
- Recovery procedures


---

# 6. Reliability Requirements

## NFR-REL-001 Data Consistency

The system must guarantee consistency of business data.

Examples:

- A payment cannot be marked as paid before validation.
- An internship cannot have multiple active supervisors.
- A rejected application cannot create an active internship.


Business rules must be enforced at:

- Application layer
- Database layer when necessary


---

## NFR-REL-002 Transaction Management

Critical operations must be transactional.

Examples:

- Internship creation
- Workflow validation
- Payment processing
- Document generation


Implementation expectation:

Spring Transaction Management.


---

# 7. Scalability Requirements

## NFR-SCAL-001 Application Scalability

The architecture must support future growth.

The system should allow:

- Adding more users
- Increasing internship records
- Adding new departments
- Adding new workflows


Architecture principles:

- Modular backend
- Stateless APIs
- Independent frontend applications
- Containerized deployment


---

## NFR-SCAL-002 Database Scalability

The database design must support:

- Large internship history
- Document metadata
- Audit records
- Notification history


Required practices:

- Proper normalization
- Index optimization
- Archiving strategy


---

# 8. Maintainability Requirements

## NFR-MAIN-001 Clean Architecture

The implementation shall follow clean software engineering principles.

Required practices:

- Separation of concerns
- Layered architecture
- Domain-driven design principles
- Clear module boundaries


Expected backend structure:


domain
application
infrastructure
presentation



---

## NFR-MAIN-002 Code Quality

The project shall maintain high code quality.

Requirements:

- Meaningful naming conventions
- Documentation of complex logic
- Code review process
- Static analysis tools


---

## NFR-MAIN-003 Documentation

The project must maintain complete technical documentation.

Required documentation:

- Architecture documentation
- API documentation
- Database documentation
- Deployment documentation
- User documentation


---

# 9. Usability Requirements

## NFR-USA-001 User Experience

Interfaces shall be intuitive and adapted to each actor.

The platform shall provide:

- Clear navigation
- Responsive design
- Simple workflows
- Error explanations


---

## NFR-USA-002 Multi-Platform Experience

The system shall provide:

- Web experience for candidates
- Administrative web interface
- Mobile experience for interns


Supported platforms:

- Desktop browsers
- Mobile devices


---

# 10. Portability Requirements

## NFR-PORT-001 Deployment Portability

The application should run in different environments.

Supported environments:

- Development
- Testing
- Production


The deployment must support:

- Containerization
- Environment configuration
- Externalized secrets


---

## NFR-PORT-002 Technology Independence

Business logic must not depend strongly on infrastructure details.

Examples:

- Database technology changes should have limited impact.
- Storage provider changes should not affect business logic.


---

# 11. Evolvability Requirements

## NFR-EVO-001 Future Feature Integration

The architecture must allow adding:

Examples:

- AI internship assistant
- Automatic document analysis
- Advanced analytics
- External university integrations
- Electronic signatures


---

## NFR-EVO-002 Modular Context Boundaries

Each bounded context must remain independent.

Contexts:

- Identity & Access Management
- Organization
- Internship Management
- Workflow Engine
- Internship Companion
- Document Management
- Communication
- Financial Management


Dependencies must follow the defined architecture rules.


---

# 12. API Requirements

## NFR-API-001 REST Standards

The backend API shall respect REST principles.

Requirements:

- Clear resource naming
- HTTP standard methods
- Proper status codes
- API versioning capability


---

## NFR-API-002 API Documentation

All APIs shall be documented.

Expected tools:

- OpenAPI
- Swagger UI


Documentation must include:

- Endpoints
- Parameters
- Responses
- Authentication requirements


---

# 13. Mobile Application Requirements

## NFR-MOB-001 Offline Capability

The mobile application should support limited offline usage.

Examples:

- Draft journal entries
- Temporary task updates
- Local caching


Synchronization must occur when connectivity returns.


---

# 14. Monitoring Requirements

## NFR-MON-001 Application Monitoring

The system shall provide monitoring capabilities.

Tracked information:

- Errors
- Performance metrics
- User activity
- Service health


---

## NFR-MON-002 Logging Strategy

The application shall implement structured logging.

Logs must include:

- Timestamp
- Severity
- Component
- Error details
- Correlation identifier


---

# 15. Compliance Requirements

## NFR-COMP-001 Data Privacy

The system shall respect data privacy principles.

Requirements:

- Limited access to personal information
- Secure storage
- Controlled data sharing


---

## NFR-COMP-002 Administrative Traceability

Administrative operations must remain traceable.

Examples:

- Internship acceptance
- Document validation
- Payment approval
- Evaluation submission


---

# 16. Architecture Constraints

The implementation shall respect the approved technology architecture:

## Frontend Applications

| Application | Technology |
|-|-|
| Public Portal | Next.js |
| Administration Portal | Angular |
| Mobile Application | Flutter |


## Backend

| Component | Technology |
|-|-|
| API | Spring Boot |
| Database | PostgreSQL |
| API Documentation | Swagger/OpenAPI |


---

# 17. Summary

These non-functional requirements define the expected quality level of the STEG Smart Internship Platform.

They guarantee that the solution will be:

- Secure
- Reliable
- Scalable
- Maintainable
- Production-ready
- Adaptable for future evolution


All technical implementation choices must respect these requirements.