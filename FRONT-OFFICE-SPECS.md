# STEG Talent Portal
## Front Office Specifications

**Project:** Smart Internship & Administrative Workflow Platform  
**Module:** Public Front Office  
**Company:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Framework:** Next.js (Latest LTS)  
**Architecture:** Enterprise Web Application  
**Version:** 1.0  
**Status:** Functional Specifications

---

# Table of Contents

1. Introduction
2. Project Vision
3. Objectives
4. Problems Solved
5. Proposed Solution
6. Target Users
7. Technology Stack
8. Functional Scope
9. Functional Modules
10. Core Business Services
11. Business Rules
12. Functional Requirements
13. Non-Functional Requirements
14. Security
15. Architecture
16. Application Flow
17. User Journey
18. Quality Attributes
19. UI/UX Guidelines
20. Notifications
21. Error Handling
22. Future Improvements
23. Things To Avoid
24. Conclusion

---

# 1. Introduction

The STEG Talent Portal is the public-facing application of the Smart Internship & Administrative Workflow Platform.

Its purpose is to provide students with a modern, secure, intuitive and centralized platform where they can apply for internships, upload required documents, monitor the progress of their applications and communicate with STEG without relying on paper-based procedures.

The application serves as the digital entry point into the internship management ecosystem while remaining completely separated from the internal administrative platform.

This separation ensures scalability, maintainability and security.

---

# 2. Project Vision

The vision of this project is to modernize the internship application process by replacing manual administrative procedures with an intelligent digital platform.

Instead of requiring students to physically travel to STEG multiple times simply to submit documents and inquire about application status, the portal centralizes the entire application lifecycle.

The platform is designed to provide transparency, accessibility and simplicity while reducing administrative workload.

---

# 3. Objectives

The main objectives are:

- Digitize internship applications.
- Reduce paper usage.
- Reduce unnecessary travel.
- Improve communication.
- Centralize candidate information.
- Improve applicant experience.
- Accelerate application processing.
- Simplify document submission.
- Improve workflow transparency.
- Build a scalable architecture for future recruitment modules.

---

# 4. Problems Solved

The platform addresses several existing challenges.

Current Problems

- Paper-based internship applications.
- Manual document collection.
- Multiple administrative visits.
- No centralized tracking.
- Lack of application visibility.
- Repeated submission of documents.
- Administrative delays.
- Communication difficulties.
- Lost or misplaced documents.

Proposed Solution

- Online internship applications.
- Secure document upload.
- Real-time application tracking.
- Centralized candidate database.
- Digital communication.
- Automated notifications.
- Secure authentication.
- Complete workflow integration.

---

# 5. Proposed Solution

The proposed solution consists of a modern public web portal developed using Next.js.

The portal communicates exclusively with the Spring Boot backend through secured REST APIs.

Students never interact directly with the database.

All business logic remains inside the backend.

---

# 6. Target Users

Primary Users

- Engineering Students
- University Students
- Internship Applicants

Secondary Users

- Universities
- Educational Institutions

The portal does NOT provide administrative functionality.

All administrative operations remain inside the Angular Enterprise Portal.

---

# 7. Technology Stack

Frontend

- Next.js
- React
- TypeScript

Styling

- Tailwind CSS
- Shadcn UI
- Framer Motion (minimal)

Authentication

- JWT
- Refresh Token

Communication

- REST API
- Axios

Validation

- Zod
- React Hook Form

State Management

- TanStack Query
- Zustand

Charts

- Recharts

Icons

- Lucide Icons

Notifications

- Sonner

Deployment

- Docker
- Nginx

Version Control

- Git
- GitHub

---

# 8. Functional Scope

Included

- Student authentication
- Candidate profile
- Internship application
- Document upload
- Notifications
- Dashboard
- Profile management
- Status tracking
- Download generated documents

Excluded

- Internship approval
- HR management
- User administration
- Financial management
- Reports
- Statistics
- Workflow configuration

Those belong to the Angular Back Office.

---

# 9. Functional Modules

## Authentication Module

Features

- Login
- Register
- Forgot Password
- Reset Password
- Email Verification
- JWT Authentication
- Logout

---

## Candidate Profile Module

Features

- Personal Information
- Academic Information
- Contact Information
- University Information
- CV
- Skills
- Languages

---

## Internship Application Module

Features

- Create Application
- Edit Draft
- Submit Application
- Upload Documents
- Delete Draft
- Save Progress

---

## Documents Module

Required Documents

- CV
- Motivation Letter
- University Convention
- Transcript
- National ID

Features

- Upload
- Preview
- Replace
- Delete
- Download

---

## Dashboard Module

Dashboard displays

- Current Status
- Pending Tasks
- Missing Documents
- Notifications
- Internship Timeline

---

## Notification Module

Notifications

- Application received
- Documents accepted
- Documents rejected
- Interview scheduled
- Internship accepted
- Internship rejected
- Internship started
- Certificate available

---

## Tracking Module

Student can track

Application Submitted

↓

Under Review

↓

Department Review

↓

Supervisor Assignment

↓

Accepted

↓

Internship Started

↓

Completed

↓

Certificate Available

---

# 10. Core Business Services

Candidate Service

Authentication Service

Application Service

Document Service

Notification Service

Timeline Service

Profile Service

File Storage Service

---

# 11. Business Rules

A student may have only one active application.

Required documents must be uploaded before submission.

Applications become read-only after submission.

Documents can only be modified before validation.

Each uploaded document receives a unique identifier.

Every action must be logged.

Deleted documents are archived.

Students cannot modify validated applications.

---

# 12. Functional Requirements

Authentication

FR-01 Register

FR-02 Login

FR-03 Logout

FR-04 Password Recovery

Candidate

FR-05 Manage Profile

FR-06 Update Contact Information

FR-07 Upload Profile Photo

Applications

FR-08 Create Application

FR-09 Save Draft

FR-10 Submit

FR-11 Cancel Draft

Documents

FR-12 Upload Files

FR-13 Replace Files

FR-14 Download Files

FR-15 Delete Draft Files

Notifications

FR-16 Receive Notifications

FR-17 Read Notifications

Tracking

FR-18 Track Application

FR-19 View Timeline

Profile

FR-20 Manage Account

---

# 13. Non Functional Requirements

Availability

99% uptime

Performance

Response time below 2 seconds

Security

JWT Authentication

Accessibility

WCAG compliant

Scalability

Support thousands of users

Reliability

Automatic backups

Maintainability

Clean Architecture

Responsiveness

Desktop

Tablet

Mobile

---

# 14. Security

Authentication

JWT

Refresh Token

Authorization

Role Based Access

Passwords

Encrypted

Input

Validated

Files

Virus scanning ready

HTTPS

Required

Rate Limiting

Enabled

CSRF Protection

Enabled

XSS Protection

Enabled

Audit Logging

Enabled

Sensitive Data

Encrypted

Never expose

IDs

Tokens

Server Errors

Internal Paths

---

# 15. Architecture

```text
Student

↓

Next.js Front Office

↓

REST API

↓

Spring Boot

↓

PostgreSQL

↓

Angular Enterprise Portal
```

The frontend never communicates directly with PostgreSQL.

All communication goes through secured REST APIs.

---

# 16. Application Flow

Landing Page

↓

Register

↓

Verify Email

↓

Login

↓

Complete Profile

↓

Upload Documents

↓

Create Internship Request

↓

Submit

↓

Track Status

↓

Receive Notifications

↓

Download Documents

---

# 17. User Journey

Student

↓

Visits Website

↓

Creates Account

↓

Completes Profile

↓

Uploads Documents

↓

Submits Internship Request

↓

Receives Confirmation

↓

Tracks Progress

↓

Accepted

↓

Downloads Assignment Letter

↓

Starts Internship

↓

Downloads Certificate

---

# 18. Quality Attributes

The application must be

Secure

Fast

Reliable

Responsive

Accessible

Maintainable

Scalable

Modular

Professional

User Friendly

Modern

Stable

---

# 19. UI/UX Guidelines

Design Principles

Minimal

Modern

Professional

Accessible

Consistent

Responsive

Simple

Readable

Use

Cards

Progress Indicators

Status Badges

Timeline

Dashboard Widgets

Avoid

Complex animations

Visual clutter

Hidden actions

Confusing navigation

---

# 20. Notifications

Channels

In-App

Email

Events

Application Submitted

Document Missing

Document Approved

Application Accepted

Application Rejected

Certificate Ready

Internship Started

Internship Completed

---

# 21. Error Handling

User Friendly Messages

Validation Errors

Connection Errors

Session Expiration

Unauthorized Access

File Upload Errors

Unexpected Errors

Never expose stack traces.

Never expose SQL errors.

Never expose backend implementation details.

---

# 22. Future Improvements

AI CV Analysis

OCR

Recommendation Engine

Internship Matching

Chatbot

Calendar Integration

Digital Signature

QR Verification

Online Interview Scheduling

University Integration

Mobile Application

---

# 23. Things To Avoid

Never expose administrative functionality.

Never allow direct database access.

Never trust client-side validation.

Never store passwords.

Never expose JWT secrets.

Never expose server errors.

Never duplicate business logic.

Never upload unrestricted file types.

Never allow unlimited upload sizes.

Never disable HTTPS.

Never bypass authentication.

Never hardcode credentials.

Never mix public and administrative features.

Never allow privilege escalation.

Never create inconsistent UI.

Never ignore accessibility.

Never ignore responsive design.

Never trust browser inputs.

Never forget audit logging.

Never break REST conventions.

Never skip input validation.

Never expose internal IDs unnecessarily.

---

# 24. Conclusion

The STEG Talent Portal represents the public gateway of the Smart Internship & Administrative Workflow Platform.

Its mission is to modernize the relationship between students and STEG by replacing traditional paper-based procedures with a secure, scalable and user-friendly digital experience.

The application is intentionally focused on candidate-facing services, while all administrative responsibilities remain isolated within the Angular Enterprise Portal. This separation of concerns improves security, maintainability and long-term scalability.

Designed according to modern software engineering principles, the platform provides a robust foundation for future enhancements such as recruitment management, AI-assisted document processing, university integrations and additional digital administrative services, making it a key component of STEG's digital transformation strategy.