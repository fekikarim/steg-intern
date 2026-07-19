# Requirements Prioritization

## STEG Smart Internship & Administrative Workflow Platform

**Document Type:** Requirements Management Specification  
**Version:** 1.0  
**Status:** Approved  
**Project:** Conception et Développement d’une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG

---

# 1. Introduction

## 1.1 Purpose

This document defines the prioritization strategy applied to the requirements of the STEG Smart Internship & Administrative Workflow Platform.

The objective is to ensure that development efforts focus first on the functionalities providing the highest business value while maintaining a progressive and controlled implementation approach.

This prioritization is used for:

- Sprint planning.
- Development sequencing.
- MVP definition.
- Risk reduction.
- Resource allocation.

---

# 2. Prioritization Methodology

The project follows the **MoSCoW prioritization method**.

Requirements are classified into four categories:

| Priority | Meaning | Description |
|-|-|-|
| MUST HAVE | Critical | Required for the platform to function |
| SHOULD HAVE | Important | Provides significant value but not blocking |
| COULD HAVE | Optional | Improves experience but can be delayed |
| WON'T HAVE (Currently) | Deferred | Not included in the current version |

---

# 3. MVP Definition

The first operational version of the platform must allow STEG to:


Manage internship applications
↓
Approve internship requests
↓
Create internship records
↓
Assign supervisors
↓
Follow internship progress
↓
Manage documents


The MVP focuses on replacing manual paper-based processes with a complete digital workflow.

---

# 4. Global Requirement Priorities

| ID | Requirement | Priority |
|-|-|-|
| RQ-01 | User authentication | MUST HAVE |
| RQ-02 | Role-based authorization | MUST HAVE |
| RQ-03 | Candidate application management | MUST HAVE |
| RQ-04 | Document upload management | MUST HAVE |
| RQ-05 | Internship lifecycle management | MUST HAVE |
| RQ-06 | Supervisor assignment | MUST HAVE |
| RQ-07 | Workflow approval engine | MUST HAVE |
| RQ-08 | Administrative back office | MUST HAVE |
| RQ-09 | Internship mobile companion | MUST HAVE |
| RQ-10 | Notifications | SHOULD HAVE |
| RQ-11 | Automatic document generation | SHOULD HAVE |
| RQ-12 | Payment management | SHOULD HAVE |
| RQ-13 | Dashboards and statistics | SHOULD HAVE |
| RQ-14 | Advanced reporting | COULD HAVE |
| RQ-15 | AI-based recommendations | COULD HAVE |
| RQ-16 | External university integration | WON'T HAVE (Currently) |

---

# 5. Identity & Access Management Priorities

## MUST HAVE

| Feature | Description |
|-|-|
| User authentication | Secure login system |
| Password encryption | Secure credential storage |
| JWT authentication | API security mechanism |
| Role management | User permission control |
| Permission management | Fine-grained authorization |
| Audit logging | Security traceability |

---

## SHOULD HAVE

| Feature | Description |
|-|-|
| Session management | Track active connections |
| Refresh token mechanism | Secure long sessions |
| Account locking | Protection against abuse |

---

## COULD HAVE

| Feature | Description |
|-|-|
| Multi-factor authentication | Additional security layer |
| Single Sign-On | Enterprise authentication integration |

---

# 6. Internship Application Management Priorities

## MUST HAVE

| Feature | Description |
|-|-|
| Candidate creation | Store applicant information |
| Online application | Digital internship request |
| Application status tracking | Follow request evolution |
| Required document upload | Complete application file |

---

## SHOULD HAVE

| Feature | Description |
|-|-|
| Automatic email confirmation | Candidate feedback |
| Application filtering | HR productivity improvement |

---

## COULD HAVE

| Feature | Description |
|-|-|
| CV automatic analysis | AI candidate analysis |
| Recommendation engine | Candidate ranking |

---

# 7. Internship Management Priorities

## MUST HAVE

| Feature | Description |
|-|-|
| Internship creation | Create accepted internships |
| Internship lifecycle | Manage status evolution |
| Supervisor assignment | Assign internship supervisors |
| Department association | Organizational structure |

---

## SHOULD HAVE

| Feature | Description |
|-|-|
| Internship history | Track modifications |
| Internship calendar | Visual planning |

---

## COULD HAVE

| Feature | Description |
|-|-|
| Automatic scheduling | Intelligent planning |

---

# 8. Workflow Engine Priorities

## MUST HAVE

| Feature | Description |
|-|-|
| Workflow creation | Start business processes |
| Workflow steps | Define approval stages |
| Approval actions | Validate operations |
| Workflow history | Complete traceability |

---

## SHOULD HAVE

| Feature | Description |
|-|-|
| Dynamic workflow configuration | Create workflows without coding |
| Workflow templates | Reusable processes |

---

## COULD HAVE

| Feature | Description |
|-|-|
| AI workflow optimization | Intelligent process improvement |

---

# 9. Internship Companion Mobile Application Priorities

## MUST HAVE

| Feature | Description |
|-|-|
| Internship consultation | Access internship information |
| Daily journal | Track internship activities |
| Task management | Follow assigned work |
| Deliverable submission | Upload project results |
| Supervisor validation | Digital follow-up |

---

## SHOULD HAVE

| Feature | Description |
|-|-|
| Push notifications | Real-time communication |
| Offline mode | Work without connection |

---

## COULD HAVE

| Feature | Description |
|-|-|
| AI assistant | Internship guidance |
| Voice journal | Faster activity recording |

---

# 10. Document Management Priorities

## MUST HAVE

| Feature | Description |
|-|-|
| Secure file storage | Store internship documents |
| Document association | Link files to entities |
| Document retrieval | Access documents |
| Metadata management | Document information |

---

## SHOULD HAVE

| Feature | Description |
|-|-|
| Automatic generation | Generate official documents |
| Version management | Track modifications |

---

## COULD HAVE

| Feature | Description |
|-|-|
| OCR extraction | Automatic document reading |
| Digital signature | Electronic approval |

---

# 11. Communication Priorities

## SHOULD HAVE

| Feature | Description |
|-|-|
| Notification creation | Inform users |
| Email notifications | External communication |
| In-app notifications | Platform communication |

---

## COULD HAVE

| Feature | Description |
|-|-|
| SMS notifications |
| Chat system |
| Automated reminders |

---

# 12. Financial Management Priorities

## SHOULD HAVE

| Feature | Description |
|-|-|
| Payment records | Manage internship payments |
| Payment validation workflow | Financial approval |
| Payment history | Tracking |

---

## COULD HAVE

| Feature | Description |
|-|-|
| Accounting integration |
| Automatic financial reports |

---

# 13. Frontend Application Priorities

## Next.js Front Office

## MUST HAVE

- Internship information pages.
- Candidate registration.
- Application submission.
- Document upload.
- Application tracking.

---

## Angular Back Office

## MUST HAVE

- Authentication.
- Dashboard.
- Candidate management.
- Internship management.
- Workflow management.

---

# 14. Backend Priorities

## MUST HAVE

| Feature | Priority |
|-|-|
| Spring Boot REST API | MUST HAVE |
| PostgreSQL database | MUST HAVE |
| JWT security | MUST HAVE |
| Business services | MUST HAVE |
| Data validation | MUST HAVE |

---

## SHOULD HAVE

- API documentation with Swagger.
- Global exception handling.
- Logging system.
- Monitoring.

---

# 15. Database Priorities

## MUST HAVE

Required entities:


User
Role
Permission

Candidate
InternshipApplication
Internship
InternshipAssignment

Department
Employee

Workflow
WorkflowStep
WorkflowAction

Document

Task
JournalEntry
Deliverable
Evaluation

Notification

Payment


---

# 16. Development Priority Order

The recommended implementation order is:


PHASE 1
Foundation Layer

Project setup
Database configuration
Security architecture
Authentication
User management

PHASE 2
Core Internship Management

Candidate management
Application workflow
Internship lifecycle
Supervisor assignment

PHASE 3
Administrative Automation

Workflow engine
Document management
Notification system

PHASE 4
Internship Companion

Mobile authentication
Journal
Tasks
Deliverables
Evaluations

PHASE 5
Advanced Features

Payments
Dashboards
Reports
AI improvements

---

# 17. Technical Priority Dependencies

The implementation follows dependency order:


Identity & Access Management
|
↓
Organization Management
|
↓
Internship Management
|
--------------------
| | |
Workflow Documents Communication
|
↓
Financial Management

Internship Management
|
↓
Mobile Companion


---

# 18. Deferred Features

The following features are intentionally postponed:

| Feature | Reason |
|-|-|
| AI candidate recommendation | Requires historical data |
| University API integration | External dependency |
| Blockchain certification | Not required |
| Advanced analytics | Requires production data |
| Chat system | Not core requirement |

---

# 19. Priority Review Rules

Priorities may be updated when:

- Business requirements change.
- Supervisor feedback introduces new needs.
- Technical constraints appear.
- Implementation risks are identified.

Any priority modification must be documented.

---

# 20. Conclusion

This prioritization strategy ensures that the STEG Smart Internship Platform is developed progressively while delivering maximum business value.

The implementation focuses first on:

1. Digitalizing internship management.
2. Replacing manual administrative processes.
3. Securing access and workflows.
4. Providing complete internship monitoring.

Advanced features will be introduced after the stable delivery of the core platform.