# STEG Internship Companion
## Mobile Application Specifications

**Project:** Smart Internship & Administrative Workflow Platform  
**Module:** Mobile Application (Internship Companion)  
**Company:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Framework:** Flutter (Latest Stable)  
**Architecture:** Cross-Platform Enterprise Mobile Application  
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
9. User Roles
10. Core Business Modules
11. Core Business Services
12. Business Rules
13. Functional Requirements
14. Internship Timeline
15. Dashboard
16. Notifications
17. Offline Synchronization
18. Non-Functional Requirements
19. Security
20. Mobile Architecture
21. Application Flow
22. Quality Attributes
23. UI/UX Guidelines
24. Error Handling
25. Future Improvements
26. Things To Avoid
27. Conclusion

---

# 1. Introduction

The STEG Internship Companion is the mobile component of the Smart Internship & Administrative Workflow Platform.

Unlike the Front Office, which manages internship applications before the internship begins, and the Back Office, which is dedicated to internal administrative operations, the mobile application accompanies interns and supervisors throughout the entire internship period.

Its objective is to simplify communication, improve internship monitoring, facilitate daily reporting and provide continuous visibility over internship progress.

The application shares the same backend, business rules and database as the web applications, ensuring complete consistency across the platform.

---

# 2. Project Vision

The Internship Companion aims to become the daily digital workspace for interns and supervisors.

Instead of relying on notebooks, emails or paper documents to monitor internship activities, every important interaction becomes digital.

The application provides a collaborative environment where interns can report their progress while supervisors can monitor, validate and evaluate internship activities in real time.

---

# 3. Objectives

Main objectives

- Digitize internship follow-up.
- Improve communication.
- Eliminate paper internship journals.
- Facilitate supervisor monitoring.
- Centralize internship deliverables.
- Improve internship traceability.
- Simplify internship evaluation.
- Increase student autonomy.
- Support real-time collaboration.
- Build a scalable mobile architecture.

---

# 4. Problems Solved

Current Problems

- Paper internship journals.
- No centralized internship follow-up.
- Difficult communication.
- Missing internship history.
- Manual evaluation.
- Scattered deliverables.
- Delayed supervisor feedback.
- Lack of reminders.
- No internship timeline.

Proposed Solution

- Digital internship journal.
- Daily or weekly reporting.
- Task management.
- Internship timeline.
- Supervisor comments.
- Mobile notifications.
- Deliverable management.
- Progress tracking.
- Centralized communication.

---

# 5. Proposed Solution

The application is developed using Flutter and communicates exclusively with the centralized Spring Boot REST API.

All internship information remains synchronized with the enterprise platform.

The application serves as the operational companion throughout the internship lifecycle.

---

# 6. Target Users

Primary Users

- Interns
- Internship Supervisors

Secondary Users

- HR (read-only future version)

The application does not provide administrative management functions.

Administrative operations remain inside the Angular Enterprise Portal.

---

# 7. Technology Stack

Framework

- Flutter

Language

- Dart

Architecture

- Clean Architecture

State Management

- Riverpod

Networking

- Dio

Authentication

- JWT
- Refresh Token

Local Storage

- Hive

Offline Database

- Drift (SQLite)

Notifications

- Firebase Cloud Messaging

File Picker

- file_picker

Media

- image_picker

PDF

- syncfusion_flutter_pdfviewer

Charts

- fl_chart

Calendar

- table_calendar

Deployment

- Android
- iOS

Version Control

- Git
- GitHub

---

# 8. Functional Scope

Included

- Authentication
- Internship dashboard
- Daily journal
- Weekly journal
- Timeline
- Internship planning
- Task management
- Deliverable management
- Notifications
- Supervisor comments
- Progress monitoring
- File uploads
- Document downloads

Excluded

- Internship application
- HR management
- User administration
- Workflow configuration
- Financial management

---

# 9. User Roles

## Intern

Responsibilities

- Manage internship journal.
- Complete assigned tasks.
- Upload deliverables.
- Follow internship progress.
- Receive notifications.
- View supervisor comments.
- Download documents.

---

## Supervisor

Responsibilities

- Monitor interns.
- Validate journals.
- Comment activities.
- Validate deliverables.
- Evaluate interns.
- Track internship progress.

---

# 10. Core Business Modules

## Authentication

- Login
- Logout
- Session Management

---

## Dashboard

Displays

- Internship Progress
- Current Tasks
- Pending Deliverables
- Notifications
- Calendar
- Timeline

---

## Internship Journal

Features

- Daily Entry
- Weekly Entry
- Rich Text Notes
- Images
- Attachments
- Draft Mode
- Submission
- History

---

## Task Management

Features

- Assigned Tasks
- Personal Tasks
- Completed Tasks
- Due Dates
- Priorities

---

## Internship Timeline

Displays

- Internship Start
- Weekly Milestones
- Deliverables
- Meetings
- Validation Dates
- Internship End

---

## Deliverable Management

Features

- Upload Deliverables
- Replace Deliverables
- View History
- Download Files
- Validation Status

---

## Comments

Features

- Supervisor Feedback
- Validation Comments
- Recommendations
- Internship Guidance

---

## Evaluation

Supervisor can

- Evaluate Progress
- Evaluate Skills
- Leave Feedback
- Validate Internship

Intern can

- View Evaluation
- View Feedback

---

## Documents

Available Documents

- Assignment Letter
- Internship Convention
- Internship Certificate
- Evaluation Sheet
- Final Report Template

---

## Notifications

Receive

- New Tasks
- New Comments
- Journal Validation
- Deliverable Validation
- Meeting Reminder
- Internship Reminder
- Certificate Available

---

# 11. Core Business Services

Authentication Service

Journal Service

Task Service

Timeline Service

Deliverable Service

Notification Service

Comment Service

Evaluation Service

Calendar Service

Document Service

Synchronization Service

Profile Service

---

# 12. Business Rules

Only authenticated users may access the application.

Each journal entry belongs to one internship.

Journal entries become read-only after supervisor validation.

Deliverables may be updated until validated.

Every validation is logged.

Every uploaded file receives a unique identifier.

Supervisors may only access assigned interns.

Completed internships become archived.

Every action is synchronized with the backend.

---

# 13. Functional Requirements

Authentication

- Login
- Logout
- Session Recovery

Internship Journal

- Create Journal
- Edit Draft
- Submit
- View History

Tasks

- View Tasks
- Complete Tasks
- Personal To-Do

Deliverables

- Upload
- Replace
- Download
- View Validation

Timeline

- View Internship Timeline
- View Milestones

Comments

- View Feedback
- Supervisor Comments

Evaluation

- View Evaluation

Notifications

- Receive
- Read
- Archive

Documents

- Download Official Documents

Profile

- View Profile
- Update Contact Information

---

# 14. Internship Timeline

Example

Internship Started

↓

Daily Journal

↓

Weekly Journal

↓

Task Completion

↓

Deliverable Upload

↓

Supervisor Validation

↓

Evaluation

↓

Internship Completed

↓

Certificate Available

---

# 15. Dashboard

Intern Dashboard

- Internship Progress
- Completion Percentage
- Pending Tasks
- Deliverables
- Notifications
- Calendar
- Today's Activities
- Recent Feedback

Supervisor Dashboard

- Assigned Interns
- Pending Validations
- Deliverables Waiting
- Upcoming Meetings
- Internship Progress
- Evaluation Status

---

# 16. Notifications

Channels

- Push Notifications
- In-App Notifications

Events

- New Task
- Reminder
- Supervisor Comment
- Deliverable Approved
- Deliverable Rejected
- Journal Validated
- Meeting Scheduled
- Internship Completed
- Certificate Available

---

# 17. Offline Synchronization

The application should support limited offline functionality.

Available Offline

- Read previous journals.
- Read tasks.
- Create draft journal.
- Create personal notes.
- View downloaded documents.

When connectivity returns

- Automatic synchronization.
- Conflict detection.
- Upload pending changes.
- Refresh notifications.

---

# 18. Non-Functional Requirements

Availability

99%

Performance

Fast startup.

Smooth navigation.

Security

Enterprise authentication.

Reliability

Automatic synchronization.

Maintainability

Clean Architecture.

Accessibility

Simple interface.

Scalability

Future-ready.

Responsiveness

Optimized for phones and tablets.

---

# 19. Security

Authentication

JWT

Refresh Tokens

Authorization

RBAC

HTTPS

Mandatory

Encrypted Storage

Mandatory

Sensitive Files

Protected

Local Cache

Encrypted

Session Timeout

Enabled

Biometric Authentication

Future Version

No sensitive information stored in plain text.

No direct database access.

---

# 20. Mobile Architecture

```
Flutter Application

↓

REST API

↓

Spring Boot

↓

Business Services

↓

PostgreSQL

↓

Angular Back Office

↓

Next.js Front Office
```

The mobile application never communicates directly with the database.

All requests pass through the secured backend.

---

# 21. Application Flow

Login

↓

Dashboard

↓

Current Internship

↓

Daily Journal

↓

Tasks

↓

Deliverables

↓

Supervisor Validation

↓

Evaluation

↓

Internship Completion

---

# 22. Quality Attributes

The application must be

Secure

Fast

Reliable

Responsive

Offline Ready

Maintainable

Scalable

Modern

Professional

User Friendly

Cross Platform

Battery Efficient

---

# 23. UI/UX Guidelines

Design Principles

Modern

Minimal

Simple

Professional

Accessible

Responsive

Consistent

Use

Material Design 3

Cards

Progress Indicators

Timeline

Calendar

Bottom Navigation

Status Chips

Floating Action Button

Avoid

Complex navigation

Hidden actions

Visual clutter

Too many colors

Heavy animations

Large loading times

---

# 24. Error Handling

Handle

- Network Errors
- Session Expiration
- Synchronization Errors
- Upload Errors
- Download Errors
- Validation Errors

Provide

- Friendly messages
- Retry actions
- Offline fallback

Never expose

- Stack traces
- Backend errors
- Internal server information

---

# 25. Future Improvements

Offline First Mode

Biometric Login

QR Code Attendance

Location Verification

Voice Notes

AI Daily Report Generator

OCR Document Scanner

AI Internship Assistant

Meeting Scheduling

Calendar Synchronization

Digital Signature

University Integration

Wear OS Support

Apple Watch Support

---

# 26. Things To Avoid

Never duplicate business logic from the backend.

Never bypass authentication.

Never expose sensitive information locally.

Never trust client-side validation.

Never store passwords.

Never hardcode tokens.

Never allow unrestricted uploads.

Never ignore synchronization conflicts.

Never perform destructive actions without confirmation.

Never bypass RBAC.

Never expose internal APIs.

Never ignore offline consistency.

Never create inconsistent UI.

Never ignore accessibility.

Never perform blocking operations on the UI thread.

Never mix administrative features with internship follow-up.

---

# 27. Conclusion

The STEG Internship Companion completes the Smart Internship & Administrative Workflow Platform by extending digital transformation beyond internship administration into the daily operational experience of interns and supervisors.

Working alongside the Next.js Student Portal and the Angular Enterprise Portal, the mobile application provides continuous internship monitoring, structured communication, task management, deliverable tracking and real-time collaboration while relying on the same centralized Spring Boot backend and PostgreSQL database.

Designed with modern mobile engineering principles, secure synchronization and cross-platform support, the application delivers a reliable, scalable and user-friendly solution that enhances internship quality, strengthens collaboration between interns and supervisors, and contributes to STEG's long-term digital transformation strategy.