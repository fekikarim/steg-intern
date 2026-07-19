# Mobile Vision

## 1. Purpose

This document defines the vision, objectives, architecture, and role of the mobile application within the STEG Internship Management Platform.

The mobile application, called:

```

Internship Companion

```

is designed to accompany interns and supervisors throughout the internship lifecycle.

Unlike the Front Office platform, which focuses on:

- Internship applications.
- Candidate registration.
- Administrative follow-up.

and the Back Office platform, which focuses on:

- Internal management.
- Administrative workflows.
- Human resources operations.

the mobile application focuses on:

- Daily internship activities.
- Communication.
- Monitoring.
- Progress tracking.
- Collaboration between intern and supervisor.

---

# 2. Mobile Application Vision

The Internship Companion aims to transform the internship experience from a traditional paper-based process into a connected digital experience.

The application provides a single mobile workspace where:

```

Intern

↓

Daily Activities

↓

Supervisor Follow-up

↓

Validation

↓

Evaluation

```

are managed digitally.

---

# 3. Main Objectives

The mobile application aims to:

- Facilitate internship monitoring.
- Improve communication between interns and supervisors.
- Reduce manual paperwork.
- Provide real-time internship visibility.
- Centralize internship activities.
- Improve traceability.
- Encourage continuous progress tracking.

---

# 4. Target Users

The mobile application supports two main user profiles.

---

# 4.1 Intern

The intern uses the application to:

- Follow internship progress.
- Complete daily journals.
- Manage assigned tasks.
- Submit deliverables.
- Receive notifications.
- Communicate with the supervisor.

---

# 4.2 Supervisor

The supervisor uses the application to:

- Monitor assigned interns.
- Validate journals.
- Review deliverables.
- Provide feedback.
- Evaluate internship progress.

---

# 5. Mobile Application Positioning

The complete platform architecture:

```

```
             Backend API
                 |
    --------------------------------
    |              |               |
 Next.js       Angular          Flutter
```

Front Office   Back Office   Internship Companion
|              |               |
--------------------------------
|
PostgreSQL

```

The mobile application communicates exclusively with:

```

Spring Boot REST API

```

---

# 6. Mobile Technology Stack

## Framework

```

Flutter

```

---

## Programming Language

```

Dart

```

---

## Backend Communication

```

REST API

JSON

HTTPS

```

---

## Authentication

```

JWT Access Token

*

Refresh Token

```

---

## Local Storage

Used for:

- Offline mode.
- Temporary data.
- User preferences.

Possible technologies:

```

SQLite

Hive

Shared Preferences

```

---

# 7. Mobile Architecture

The application follows a clean architecture approach.

```

Presentation Layer

```
    |
```

Application Layer

```
    |
```

Domain Layer

```
    |
```

Data Layer

```
    |
```

Remote API / Local Storage

```

---

# 8. Main Mobile Modules

The application contains:

```

Authentication

Internship Dashboard

Timeline

Journal Management

Task Management

Deliverable Management

Document Access

Notifications

Communication

Evaluation Tracking

Profile Management

```

---

# 9. Internship Timeline

The application provides a visual internship timeline.

Example:

```

Internship Start

```
    |
```

Assignment

```
    |
```

Daily Activities

```
    |
```

Deliverables

```
    |
```

Evaluation

```
    |
```

Completion

```

The timeline allows users to understand:

- Current stage.
- Completed activities.
- Pending actions.

---

# 10. Mobile User Experience Goals

The application must provide:

## Simplicity

Users should access important actions quickly.

Example:

Intern homepage:

```

Today's Tasks

Journal

Deliverables

Notifications

```

---

## Mobility

The application must work efficiently:

- Anywhere.
- Anytime.
- On smartphones.

---

## Accessibility

The interface should support:

- Clear navigation.
- Readable content.
- Simple interactions.

---

# 11. Security Vision

The mobile application must guarantee:

## Authentication Security

Using:

```

JWT

*

Refresh Token

```

---

## Secure Communication

All communication uses:

```

HTTPS

```

---

## Local Data Protection

Sensitive information stored locally must be protected.

Examples:

- Tokens.
- User information.
- Cached documents.

---

# 12. Notification Vision

The application provides notifications for:

- New assignments.
- Validation results.
- Comments.
- Deadlines.
- Workflow actions.

Notification channels:

```

Push Notification

In-App Notification

Email Notification

```

---

# 13. Offline Capability Vision

The application should remain usable when network connectivity is unavailable.

Supported offline actions:

- Writing journal drafts.
- Viewing cached information.
- Creating temporary tasks.

Synchronization occurs when connection returns.

---

# 14. QR Code Integration Vision

QR codes can improve internship identification and verification.

Possible uses:

- Internship identification.
- Document verification.
- Attendance tracking.
- Quick access to internship information.

---

# 15. Synchronization Vision

The mobile application synchronizes with the backend.

Synchronization manages:

```

Local Data

```
    ⇅
```

Backend Data

```

The system must handle:

- New data.
- Updated data.
- Conflicts.
- Failed synchronization.

---

# 16. Mobile Performance Requirements

The application should:

- Start quickly.
- Consume limited resources.
- Optimize network requests.
- Support modern Android and iOS devices.

---

# 17. Mobile Development Principles

The application follows:

## Clean Code

- Clear architecture.
- Reusable components.
- Maintainable code.

---

## Separation of Concerns

UI logic must be separated from:

- Business rules.
- Data management.
- API communication.

---

## Scalability

The application architecture must allow future modules:

- Attendance.
- Messaging.
- AI assistant.
- Electronic signatures.

---

# 18. Future Improvements

Possible future extensions:

- Biometric authentication.
- Offline-first complete mode.
- AI internship assistant.
- Voice journal entries.
- Camera-based document scanning.
- Real-time chat.
- Digital signature.

---

# 19. Conclusion

The Internship Companion mobile application represents the operational side of the STEG Internship Management Platform.

By providing a digital environment for interns and supervisors, it improves communication, monitoring, validation, and internship traceability while reducing dependency on traditional paper processes.

The mobile application completes the platform ecosystem by connecting administrative management with real internship execution.