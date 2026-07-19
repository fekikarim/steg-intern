# STEG Enterprise Portal
## Back Office Specifications

**Project:** Smart Internship & Administrative Workflow Platform  
**Module:** Enterprise Back Office  
**Company:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Framework:** Angular (Latest LTS)  
**Architecture:** Enterprise Management System  
**Version:** 1.0  
**Status:** Functional Specifications

---

# Table of Contents

1. Introduction
2. Project Vision
3. Objectives
4. Business Problems
5. Proposed Solution
6. Target Users
7. Technology Stack
8. Functional Scope
9. User Roles
10. Core Business Modules
11. Core Business Services
12. Business Rules
13. Functional Requirements
14. Workflow Engine
15. Dashboard
16. Reporting & Analytics
17. Non-Functional Requirements
18. Security
19. System Architecture
20. Application Flow
21. Quality Attributes
22. UI/UX Guidelines
23. Audit & Logging
24. Notifications
25. Error Handling
26. Future Improvements
27. Things To Avoid
28. Conclusion

---

# 1. Introduction

The STEG Enterprise Portal is the internal administrative application of the Smart Internship & Administrative Workflow Platform.

It is designed exclusively for STEG employees responsible for managing internship applications, administrative validation processes, document generation, reporting, workflow automation and internship lifecycle management.

Unlike the public Student Portal, this platform centralizes every internal operation related to internships while ensuring traceability, security, performance and scalability.

The portal aims to replace traditional paper-based administrative procedures with a centralized digital workflow.

---

# 2. Project Vision

The objective of the Enterprise Portal is to become the central administrative platform for internship management at STEG.

Instead of exchanging paper documents between departments, every administrative operation becomes a secured digital workflow.

The portal is also designed to become the foundation for future administrative digitalization projects inside STEG.

Future modules may include:

- Leave Management
- Purchase Requests
- Internal Approvals
- Employee Requests
- Internal Document Management
- Asset Requests

The internship module represents Version 1 of this enterprise platform.

---

# 3. Objectives

Main objectives:

- Centralize internship management.
- Replace manual administrative workflows.
- Reduce paper consumption.
- Improve traceability.
- Automate repetitive tasks.
- Accelerate validation procedures.
- Improve communication between departments.
- Generate official documents automatically.
- Provide real-time dashboards.
- Produce decision-support reports.
- Offer a secure and scalable architecture.

---

# 4. Business Problems

Current situation:

- Paper-based workflows.
- Multiple manual signatures.
- Administrative delays.
- Difficult document tracking.
- Duplicate information.
- Manual data entry.
- No centralized monitoring.
- Time-consuming approvals.
- Heavy administrative workload.
- Lack of workflow visibility.

The Enterprise Portal addresses these issues through digital transformation and workflow automation.

---

# 5. Proposed Solution

The solution consists of an enterprise web application developed with Angular.

The application communicates exclusively with a centralized Spring Boot backend through secured REST APIs.

All business rules remain inside the backend.

The Angular application is responsible only for presentation, interaction and user experience.

The platform manages the complete internship lifecycle from application reception until internship completion and certificate generation.

---

# 6. Target Users

Primary Users

- Human Resources (HR)
- Internship Managers
- Supervisors
- Accounting Department
- Finance Department
- Directors
- Administrators

Secondary Users

- Department Managers
- Secretaries
- Administrative Staff

---

# 7. Technology Stack

Frontend

- Angular
- TypeScript

UI

- Angular Material
- Tailwind CSS

State Management

- NgRx

Communication

- REST API
- RxJS
- HttpClient

Authentication

- JWT
- Refresh Tokens

Validation

- Reactive Forms

Charts

- ApexCharts

Icons

- Material Icons
- Lucide Icons

PDF

- PDF Viewer

Deployment

- Docker
- Nginx

Version Control

- Git
- GitHub

---

# 8. Functional Scope

Included

- Authentication
- Internship Management
- Workflow Management
- User Management
- Supervisor Management
- Document Management
- Dashboard
- Reporting
- Statistics
- Audit Logs
- Notification Center
- Role Management
- Certificate Generation
- Payment Tracking
- Search Engine
- System Configuration

Excluded

- Student registration
- Public internship portal
- Recruitment management
- Employee management
- Procurement

These may become future modules.

---

# 9. User Roles

## Administrator

Full platform administration.

Permissions

- Manage users
- Manage roles
- Configure platform
- Access all modules

---

## Human Resources

Responsible for:

- Internship applications
- Candidate validation
- Internship creation
- Assignment management
- Certificate management

---

## Supervisor

Responsible for:

- Internship supervision
- Student follow-up
- Internship evaluation
- Internship approval

---

## Finance

Responsible for:

- Internship payments
- Indemnity management
- Financial validation

---

## Accounting

Responsible for:

- Payment processing
- Financial tracking

---

## Director

Responsible for:

- Dashboard
- Reports
- Statistics
- Decision making

---

# 10. Core Business Modules

## Authentication Module

- Login
- Logout
- Session Management
- Password Reset

---

## User Management

- Employees
- Roles
- Permissions
- Departments

---

## Internship Management

- Internship creation
- Internship assignment
- Internship monitoring
- Internship completion

---

## Candidate Management

- Review applications
- Accept
- Reject
- Request additional documents

---

## Supervisor Management

- Assign supervisors
- Manage workload
- Internship follow-up

---

## Workflow Engine

- Approval workflow
- Validation steps
- Workflow history
- Status management

---

## Document Management

- Upload
- Download
- Archive
- Certificate generation
- Assignment letters
- Internship agreements

---

## Payment Management

- Indemnities
- Validation
- Payment tracking

---

## Dashboard

- KPIs
- Recent Activities
- Pending Tasks
- Statistics

---

## Reporting

- PDF Reports
- Excel Reports
- Statistics
- Charts

---

## Notification Center

- Email notifications
- Internal notifications
- Workflow alerts

---

## Audit Logs

- User activities
- Workflow history
- Security events

---

## Search Engine

Global search by

- Student
- CIN
- Department
- Supervisor
- Internship
- Date
- Status

---

## Settings

- Platform configuration
- Email templates
- Workflow configuration
- System parameters

---

# 11. Core Business Services

Authentication Service

User Service

Role Service

Permission Service

Internship Service

Candidate Service

Workflow Service

Notification Service

Dashboard Service

Reporting Service

Document Service

Certificate Service

Payment Service

Search Service

Audit Service

Statistics Service

Configuration Service

---

# 12. Business Rules

Every internship requires an assigned supervisor.

An internship cannot start before approval.

Certificates cannot be generated before internship completion.

Payments require HR validation.

Every workflow action is logged.

Every approval includes:

- User
- Date
- Time
- Status
- Comment

Applications remain archived permanently.

Deleted records are soft deleted.

Every sensitive action requires authorization.

---

# 13. Functional Requirements

Authentication

- Login
- Logout
- Session Management

Users

- Create
- Edit
- Disable
- Manage Roles

Internships

- Create
- Update
- Assign
- Close

Candidates

- Accept
- Reject
- Request Documents

Workflow

- Approve
- Reject
- Return
- Archive

Documents

- Upload
- Generate
- Archive
- Download

Reports

- Generate PDF
- Generate Excel

Dashboard

- KPIs
- Charts
- Statistics

Search

- Global Search
- Filters
- Sorting

Notifications

- Send
- Receive
- Mark as Read

---

# 14. Workflow Engine

The workflow engine is the core of the platform.

Example:

Application Submitted

↓

HR Validation

↓

Department Assignment

↓

Supervisor Approval

↓

Internship Started

↓

Internship Completed

↓

Certificate Generated

↓

Payment Validation

↓

Archived

Each transition records:

- Timestamp
- Responsible User
- Status
- Comment

---

# 15. Dashboard

Each role has a personalized dashboard.

Dashboard Components

- KPIs
- Pending Approvals
- Internship Statistics
- Department Statistics
- Payment Overview
- Recent Activities
- Notifications
- Workflow Status
- Quick Actions

---

# 16. Reporting & Analytics

Reports

- Internship Report
- Department Report
- Supervisor Report
- Payment Report
- Activity Report

Analytics

- Active Internships
- Monthly Applications
- Internship Duration
- Department Distribution
- Acceptance Rate
- Completion Rate

Export

- PDF
- Excel

---

# 17. Non-Functional Requirements

Availability

99.9%

Performance

Response <2 seconds

Scalability

Enterprise Ready

Accessibility

WCAG

Maintainability

Modular Architecture

Reliability

High

Security

Enterprise Grade

Responsiveness

Desktop First

---

# 18. Security

Authentication

JWT

Refresh Tokens

Authorization

RBAC

Password Hashing

BCrypt

HTTPS

Mandatory

Audit Logs

Mandatory

Input Validation

Mandatory

File Validation

Mandatory

Rate Limiting

Enabled

CSRF Protection

Enabled

XSS Protection

Enabled

CORS Policy

Configured

Sensitive Data

Encrypted

Session Timeout

Enabled

Role Isolation

Enabled

No direct database access.

---

# 19. System Architecture

```
Angular Enterprise Portal

↓

REST API

↓

Spring Boot

↓

Business Services

↓

PostgreSQL

↓

Audit Logs
```

Angular never communicates directly with the database.

Business logic remains exclusively inside Spring Boot.

---

# 20. Application Flow

Login

↓

Dashboard

↓

Pending Tasks

↓

Internship Management

↓

Workflow Validation

↓

Document Generation

↓

Reports

↓

Archive

---

# 21. Quality Attributes

The platform must be

Secure

Reliable

Scalable

Maintainable

Fast

Professional

Accessible

Modular

Extensible

Responsive

Auditable

Enterprise Ready

---

# 22. UI/UX Guidelines

Design Principles

Simple

Modern

Professional

Minimal

Consistent

Accessible

Readable

Features

Large tables

Filters

Advanced Search

Status Badges

Charts

Dashboard Widgets

Progress Indicators

Responsive Layout

Avoid

Complex animations

Hidden features

Confusing navigation

Visual overload

---

# 23. Audit & Logging

Every critical action must be logged.

Log Information

- User
- Date
- Time
- Module
- Action
- Entity
- Status
- IP Address

Logs cannot be modified by users.

---

# 24. Notifications

Channels

- Internal Notifications
- Email

Events

- New Application
- Workflow Approval
- Workflow Rejection
- Missing Documents
- Certificate Generated
- Payment Pending
- Internship Completed

---

# 25. Error Handling

Provide user-friendly error messages.

Handle

- Validation Errors
- Permission Errors
- Authentication Errors
- Session Expiration
- Network Errors
- File Errors

Never expose

- Stack Traces
- SQL Errors
- Internal APIs
- Server Paths

---

# 26. Future Improvements

- Mobile Application
- AI Assistant
- OCR
- Digital Signature
- QR Verification
- Microsoft 365 Integration
- Calendar Synchronization
- Advanced Analytics
- Configurable Workflow Builder
- Electronic Archive
- Multi-language Support

---

# 27. Things To Avoid

Never place business logic inside Angular.

Never duplicate backend validations.

Never expose administrative APIs.

Never trust client-side validation.

Never hardcode credentials.

Never expose JWT secrets.

Never disable HTTPS.

Never store passwords.

Never allow unauthorized access.

Never expose server errors.

Never mix public and administrative features.

Never bypass RBAC.

Never skip audit logging.

Never allow unrestricted uploads.

Never perform destructive operations without confirmation.

Never ignore accessibility.

Never create inconsistent UI components.

Never create tightly coupled modules.

Never violate REST principles.

Never bypass the workflow engine.

---

# 28. Conclusion

The STEG Enterprise Portal is the central administrative component of the Smart Internship & Administrative Workflow Platform.

It replaces fragmented paper-based procedures with a secure, centralized and workflow-driven enterprise system capable of managing the complete internship lifecycle.

Designed according to modern software engineering principles, the platform emphasizes modularity, security, maintainability and scalability. By separating business logic from presentation and integrating advanced workflow management, reporting, audit logging and role-based access control, it establishes a strong foundation for STEG's digital transformation.

Beyond internship management, the architecture is intentionally extensible, enabling future integration of additional administrative modules while preserving consistency, performance and long-term maintainability.