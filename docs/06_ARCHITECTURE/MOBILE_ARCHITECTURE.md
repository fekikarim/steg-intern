# Mobile Architecture

## 1. Purpose

This document defines the mobile application architecture of the **Internship Companion** application developed for the STEG Intelligent Internship Management Platform.

The mobile application is designed to support interns and supervisors during the internship lifecycle by providing:

- Daily internship monitoring.
- Journal management.
- Task tracking.
- Deliverable management.
- Supervisor validation.
- Notifications.
- Offline capabilities.

The application is developed using:

```

Flutter

*

Dart

```

---

# 2. Mobile Application Vision

The mobile application acts as a digital companion throughout the internship period.

It complements:

```

Next.js Front Office

```
    |
```

Candidate Registration

```
    |
```

Angular Back Office

```
    |
```

Administrative Management

```
    |
```

Flutter Mobile Application

```
    |
```

Daily Internship Execution

```

---

# 3. Mobile Architecture Style

The application follows:

```

Clean Architecture

*

Feature-Based Architecture

*

Repository Pattern

*

MVVM Pattern

```

Objectives:

- Maintainable code.
- Separation of responsibilities.
- Easy testing.
- Scalability.
- Offline support.

---

# 4. Mobile Technology Stack

| Component | Technology |
|---|---|
| Framework | Flutter |
| Language | Dart |
| State Management | Riverpod / Bloc |
| Local Storage | SQLite / Hive |
| Networking | Dio / HTTP Client |
| Authentication | JWT |
| Push Notifications | Firebase Cloud Messaging |
| File Handling | Flutter File APIs |
| QR Scanner | Flutter QR Scanner Package |
| Testing | Flutter Test |

---

# 5. High-Level Architecture

The mobile application follows three main layers:

```

```
             Presentation Layer

                     |

             Domain Layer

                     |

              Data Layer

                     |

          Spring Boot REST API
```

```

---

# 6. Layer Responsibilities

# 6.1 Presentation Layer

Responsible for:

- Screens.
- Widgets.
- User interactions.
- UI state management.

Examples:

```

Login Screen

Internship Dashboard

Journal Screen

Task Screen

Deliverable Screen

```

---

# 6.2 Domain Layer

Contains the core application logic.

Responsibilities:

- Business rules.
- Use cases.
- Entities.

Examples:

```

CreateJournalEntryUseCase

SubmitDeliverableUseCase

ValidateJournalUseCase

```

The domain layer does not depend on Flutter or external libraries.

---

# 6.3 Data Layer

Responsible for:

- API communication.
- Local storage.
- Data mapping.
- Synchronization.

Contains:

```

Remote Data Sources

Local Data Sources

Repositories

Models

```

---

# 7. Mobile Project Structure

Recommended structure:

```

lib

│
├── core

│   ├── network

│   ├── security

│   ├── storage

│   ├── constants

│   └── exceptions

│
├── features

│   ├── authentication

│   │
│   ├── internship

│   │
│   ├── journal

│   │
│   ├── tasks

│   │
│   ├── deliverables

│   │
│   ├── evaluations

│   │
│   ├── notifications

│   │
│   └── profile

│
├── shared

│   ├── widgets

│   ├── themes

│   └── helpers

│
└── main.dart

```

---

# 8. Feature-Based Organization

Each feature contains:

```

feature_name

│

├── data

│   ├── models

│   ├── repositories

│   └── data_sources

├── domain

│   ├── entities

│   ├── repositories

│   └── use_cases

└── presentation

```
├── pages

├── widgets

└── controllers
```

```

---

# 9. State Management

The application requires centralized state management.

Recommended solutions:

```

Riverpod

OR

Bloc

```

Responsibilities:

- Manage authentication state.
- Handle loading states.
- Update UI.
- Manage cached data.

---

# 10. Authentication Architecture

Authentication flow:

```

User Opens Application

```
    |
```

Login Request

```
    |
```

Spring Boot Authentication API

```
    |
```

Receive JWT Token

```
    |
```

Secure Token Storage

```
    |
```

Access Application

```

---

Token storage:

Recommended:

```

Flutter Secure Storage

```

The application must never store:

- Passwords.
- Sensitive credentials.

---

# 11. API Communication

Communication with backend:

```

Flutter Application

```
    |
```

HTTPS REST API

```
    |
```

Spring Boot Backend

```

Data format:

```

JSON

```

---

Example:

```

GET

/api/v1/internships/my-internship

````

Response:

```json
{
 "reference": "INT-2026-001",
 "status": "ACTIVE"
}
````

---

# 12. Repository Pattern

The application uses repositories as abstraction layers.

Example:

```
JournalRepository

        |

-------------------

        |

Remote Source

        |

Local Source
```

Benefits:

* Easier testing.
* Offline support.
* Backend independence.

---

# 13. Offline Architecture

The application supports offline operations.

Architecture:

```
User Action

        |

Local Database

        |

Synchronization Queue

        |

Backend API

        |

Database Update
```

Supported offline features:

* Journal drafts.
* Tasks.
* Cached internship data.
* Pending uploads.

---

# 14. Synchronization Manager

The synchronization manager handles:

* Network detection.
* Pending operations.
* Data upload.
* Data download.
* Conflict management.

Example:

```
Connection Restored

        |

Sync Manager Starts

        |

Process Queue

        |

Update Local Database
```

---

# 15. Mobile Features Architecture

## Authentication

Features:

* Login.
* Logout.
* Token refresh.
* Session management.

---

## Internship Dashboard

Displays:

* Internship information.
* Progress.
* Timeline.
* Important actions.

---

## Journal Management

Allows:

Intern:

* Create entries.
* Edit drafts.
* Submit journals.

Supervisor:

* Review journals.
* Validate.
* Comment.

---

## Task Management

Allows:

* Create tasks.
* Update status.
* Track deadlines.

Statuses:

```
TODO

IN_PROGRESS

COMPLETED

CANCELLED
```

---

## Deliverables Management

Allows:

* Upload files.
* Track validation.
* Receive feedback.

---

## Evaluation

Allows:

* View evaluations.
* Receive scores.
* Consult feedback.

---

# 16. Push Notification Architecture

Technology:

```
Firebase Cloud Messaging
```

Flow:

```
Backend Event

        |

Notification Service

        |

Firebase Cloud Messaging

        |

Flutter Application
```

---

# 17. QR Code Integration

The application supports QR scanning.

Uses:

* Camera access.
* QR scanner package.
* Verification API.

Flow:

```
Scan QR Code

        |

Extract Reference

        |

Call Verification API

        |

Display Result
```

---

# 18. File Management

The mobile application manages:

* Images.
* Documents.
* Deliverables.

Process:

```
Select File

        |

Validate File

        |

Upload

        |

Store Reference

        |

Display Status
```

---

# 19. Security Architecture

Mobile security requirements:

## Authentication

* JWT.
* Refresh tokens.

---

## Storage

* Secure token storage.
* Encrypted local database.

---

## Communication

* HTTPS only.
* Certificate validation.

---

## Permissions

Required permissions:

```
Camera

Storage

Notifications

Internet
```

---

# 20. Error Handling

The application handles:

## Network Errors

Example:

```
No Internet Connection
```

---

## Authentication Errors

Example:

```
Session Expired
```

---

## Upload Errors

Example:

```
File Upload Failed
```

---

## Synchronization Errors

Example:

```
Synchronization Conflict
```

---

# 21. UI Architecture

The mobile UI follows:

## Material Design Principles

Includes:

* Consistent components.
* Clear navigation.
* Responsive layouts.

---

Main navigation:

```
Home

Internship

Journal

Tasks

Documents

Profile
```

---

# 22. Performance Optimization

The application should use:

* Lazy loading.
* Image compression.
* Efficient local queries.
* Pagination.
* Background synchronization.
* Cache management.

---

# 23. Testing Strategy

## Unit Tests

Test:

* Use cases.
* Repositories.
* Business rules.

---

## Widget Tests

Test:

* UI components.
* Forms.
* Navigation.

---

## Integration Tests

Test:

* Authentication.
* Synchronization.
* File uploads.
* Notifications.

---

# 24. Deployment

Platforms:

```
Android

iOS
```

Build process:

```
Development

        |

Testing

        |

Production Release
```

---

# 25. Future Improvements

Possible extensions:

* Offline-first complete architecture.
* Biometric authentication.
* AI internship assistant.
* Voice journal entries.
* Augmented reality document scanning.
* Advanced analytics.

---

# 26. Conclusion

The mobile architecture provides a scalable and secure foundation for the Internship Companion application.

By combining Flutter, clean architecture principles, offline capabilities, secure communication, and modular feature organization, the application ensures a reliable digital experience for interns and supervisors throughout the internship lifecycle.