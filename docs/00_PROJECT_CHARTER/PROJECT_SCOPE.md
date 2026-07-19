# PROJECT_SCOPE.md

Version: 1.0
Status: Approved
Project: STEG Smart Internship & Administrative Workflow Platform

---

# 1. Purpose

This document defines the scope of the project.

It clearly specifies:

- what the project will achieve,
- what is included,
- what is excluded,
- the boundaries of the system,
- and the responsibilities of the platform.

This document acts as the contractual definition of the project scope and serves as a reference throughout the development lifecycle.

---

# 2. Project Overview

The project consists of designing and developing an intelligent digital platform that modernizes the management of internships and administrative workflows within the Société Tunisienne de l'Électricité et du Gaz (STEG).

Instead of relying on paper documents, emails and manual procedures, the platform centralizes all internship-related operations into one secure information system.

The solution is composed of three client applications sharing one centralized backend:

- Public Front Office (Next.js)
- Internal Back Office (Angular)
- Internship Companion Mobile Application (Flutter)

All applications communicate with the same Spring Boot REST API and share a PostgreSQL database.

---

# 3. Business Scope

The platform covers the complete internship lifecycle.

This includes:

- Internship applications
- Candidate management
- Internship validation
- Assignment of supervisors
- Assignment to departments
- Administrative workflows
- Internship monitoring
- Daily journals
- Tasks
- Deliverables
- Evaluations
- Document generation
- Notification management
- Internship compensation management
- Administrative reporting

---

# 4. Functional Scope

The project includes the following functional domains.

## 4.1 Candidate Management

The platform allows candidates to:

- Create an application
- Upload required documents
- Track application status
- Receive notifications
- Consult internship information

---

## 4.2 Internship Management

The platform manages:

- Internship creation
- Internship lifecycle
- Internship assignment
- Department assignment
- Supervisor assignment
- Internship status
- Internship history

---

## 4.3 Workflow Management

The system provides a generic workflow engine capable of managing:

- Application approval
- Administrative validation
- Payment validation
- Multi-step approval processes
- Workflow history
- Complete audit trail

---

## 4.4 Internship Companion

The mobile application provides:

- Daily journal
- Journal validation
- Tasks
- Deliverables
- Supervisor comments
- Internship progress tracking
- Evaluations
- Notifications

---

## 4.5 Document Management

The platform manages:

- CV
- Motivation letter
- University convention
- Internship convention
- Assignment letter
- Internship certificate
- Administrative documents

Documents are securely stored using object storage rather than the local server filesystem.

---

## 4.6 Communication

The platform includes a notification system supporting:

- Email notifications
- Push notifications
- In-app notifications

Notifications may target:

- Individual users
- Departments
- Roles
- Broadcast announcements

---

## 4.7 Financial Management

The system manages internship compensation by supporting:

- Payment creation
- Approval workflow
- Payment validation
- Payment tracking
- Payment history

---

# 5. Technical Scope

The platform includes the following technical architecture.

## Front Office

Technology:

- Next.js

Responsibilities:

- Internship applications
- Public portal
- Candidate authentication
- Candidate dashboard

---

## Back Office

Technology:

- Angular

Responsibilities:

- Administration
- HR operations
- Supervisor management
- Financial management
- Reporting
- Workflow management

---

## Mobile Application

Technology:

- Flutter

Responsibilities:

- Internship companion
- Daily monitoring
- Notifications
- Deliverables
- Journal management

---

## Backend

Technology:

- Spring Boot 3

Responsibilities:

- Business logic
- REST APIs
- Security
- Workflow engine
- Validation
- Notification services
- Document services

---

## Database

Technology:

- PostgreSQL

Responsibilities:

- Persistent storage
- Transactions
- Referential integrity
- Business data

---

# 6. Included Features

The following features are included within the scope of this project.

✓ Authentication

✓ Authorization (RBAC)

✓ JWT Authentication

✓ Refresh Tokens

✓ Internship applications

✓ Internship lifecycle

✓ Candidate management

✓ Employee management

✓ Supervisor assignment

✓ Workflow engine

✓ Daily journal

✓ Deliverables

✓ Evaluations

✓ Tasks

✓ Notifications

✓ Payment management

✓ Document management

✓ Reporting dashboard

✓ Audit logging

✓ Mobile application

✓ REST API

✓ Swagger documentation

✓ Responsive interfaces

---

# 7. Out of Scope

The following features are intentionally excluded from the initial version.

- Electronic signature
- OCR document recognition
- AI assistant
- Offline synchronization
- Biometric authentication
- ERP integration
- National identity verification
- SMS gateway
- Multi-language support beyond planned interfaces
- External university integration
- Government service integration
- Multi-tenant deployment

These features may be considered in future versions.

---

# 8. System Boundaries

The platform is responsible for:

- internship management,
- administrative workflow automation,
- document management,
- user authentication,
- evaluation,
- internship monitoring,
- reporting,
- payment tracking.

The platform does not replace:

- existing accounting systems,
- HR ERP,
- payroll software,
- university management systems.

Instead, it complements these systems by digitalizing the internship process.

---

# 9. Target Users

The platform serves the following actors.

- Candidate
- Intern
- Supervisor
- HR Manager
- Finance Manager
- Director
- Administrator

Each actor accesses only the functionalities permitted by the authorization system.

---

# 10. Expected Deliverables

The project will produce:

- Complete software architecture
- REST API
- PostgreSQL database
- Angular Back Office
- Next.js Front Office
- Flutter mobile application
- UML documentation
- Technical documentation
- Deployment documentation
- User documentation

---

# 11. Scope Validation

The project scope is considered complete when:

- all functional requirements are implemented,
- all major workflows operate successfully,
- authentication and authorization are secure,
- documentation is complete,
- and the system satisfies the objectives defined in the Project Charter and the Cahier des Charges.

Any feature not explicitly described in this document shall be considered outside the scope of Version 1.0 unless approved through a formal project change.