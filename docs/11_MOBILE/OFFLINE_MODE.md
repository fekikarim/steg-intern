# Offline Mode

## 1. Purpose

This document defines the offline mode strategy of the **Internship Companion** mobile application.

The objective of offline mode is to allow users to continue performing essential actions when the mobile device temporarily loses network connectivity.

The system must provide:

- Continuous user experience.
- Temporary local data storage.
- Automatic synchronization when connectivity returns.
- Data integrity and conflict management.

---

# 2. Offline Mode Vision

The mobile application should not completely depend on permanent internet availability.

The expected behavior:

```

Internet Available

```
    |
```

Direct Communication With Backend

Internet Unavailable

```
    |
```

Local Operations

```
    |
```

Synchronization Later

```

---

# 3. Offline Mode Scope

Offline mode focuses on operations that can safely be performed without immediate backend communication.

Supported offline features:

- Viewing cached internship information.
- Creating journal drafts.
- Creating and updating personal tasks.
- Preparing deliverables for upload.
- Viewing downloaded documents.
- Managing local application data.

---

# 4. Offline Architecture

The mobile application uses a local storage layer.

Architecture:

```

Flutter UI

```
  |
```

Application Logic

```
  |
```

Repository Layer

```
  |
```

---

|                              |

Remote Data Source        Local Data Source

(API)                     (SQLite / Hive)

|                              |

Spring Boot API            Local Database

```

---

# 5. Local Storage Strategy

The application stores temporary and cached information locally.

Recommended technologies:

```

SQLite

OR

Hive

OR

Shared Preferences

```

Usage:

## SQLite / Hive

For structured data:

- Journals.
- Tasks.
- Internship information.
- Synchronization metadata.

---

## Shared Preferences

For simple data:

- User settings.
- Application preferences.
- Last synchronization date.

---

# 6. Offline Data Categories

## 6.1 Cached Data

Data downloaded from backend.

Examples:

- User profile.
- Internship details.
- Supervisor information.
- Existing journals.
- Existing tasks.
- Notifications.

Purpose:

Allow consultation without internet.

---

## 6.2 Pending Data

Data created while offline.

Examples:

- New journal entry.
- Updated task.
- New comments.
- Files waiting for upload.

Purpose:

Synchronize later with backend.

---

# 7. Offline Supported Actions

## 7.1 Journal Management

The intern can:

- Create journal entries.
- Edit drafts.
- Save content locally.
- Add temporary attachments.

Offline journal status:

```

LOCAL_DRAFT

```

When synchronized:

```

LOCAL_DRAFT

```
    |
```

SYNC_PENDING

```
    |
```

SUBMITTED

```

---

# 7.2 Task Management

The intern can:

- Create personal tasks.
- Update task status.
- Add descriptions.
- Modify deadlines.

Example:

```

Task:

Prepare internship report

Status:

IN_PROGRESS

Synchronization:

Pending

```

---

# 7.3 Deliverable Preparation

The intern can prepare deliverables offline.

Supported actions:

- Select files.
- Add descriptions.
- Save upload request locally.

Actual upload occurs when connection returns.

---

# 7.4 Document Consultation

Users can access previously downloaded documents.

Examples:

- Internship convention.
- Assignment letter.
- Certificate.

---

# 8. Synchronization Mechanism

Synchronization updates local and remote data.

Process:

```

Internet Connection Restored

```
    |
```

Synchronization Manager Starts

```
    |
```

Check Pending Operations

```
    |
```

Send Data To Backend

```
    |
```

Update Local Database

```
    |
```

Mark As Synchronized

```

---

# 9. Synchronization Manager

The application contains a dedicated synchronization component.

Responsibilities:

- Detect connectivity changes.
- Manage synchronization queue.
- Upload pending data.
- Download updates.
- Handle conflicts.
- Retry failed operations.

---

# 10. Connectivity Detection

The application monitors network state.

States:

```

ONLINE

OFFLINE

CONNECTING

```

Behavior:

## ONLINE

- Use backend API.
- Synchronize automatically.

## OFFLINE

- Use local storage.
- Queue operations.

## CONNECTING

- Prepare synchronization.

---

# 11. Synchronization Queue

Offline actions are stored in a queue.

Example:

```

SyncQueue

ID

Operation Type

Entity Type

Entity ID

Payload

Created Date

Status

```

---

Example:

```

1

CREATE

JournalEntry

123

Pending

```

---

# 12. Synchronization Status

Operations can have:

```

PENDING

SYNCING

COMPLETED

FAILED

CONFLICT

```

---

# 13. Conflict Management

Conflicts occur when:

- Same data changed locally.
- Same data changed remotely.

Example:

```

Supervisor modifies journal

```
    +
```

Intern modifies same journal offline

```

---

# 14. Conflict Resolution Strategy

The system uses rules depending on data type.

---

## 14.1 Journal Entries

Priority:

```

Latest Valid Modification

```

However:

Submitted or validated entries cannot be overwritten.

---

## 14.2 Tasks

Strategy:

```

Last Update Wins

```

---

## 14.3 Administrative Data

Examples:

- Internship status.
- Assignments.
- Validations.

Backend always has priority.

---

# 15. File Synchronization

Files require special handling.

Process:

```

Select File

```
    |
```

Store Locally

```
    |
```

Generate Upload Task

```
    |
```

Upload When Online

```
    |
```

Confirm Storage

```
    |
```

Remove Temporary File

```

---

# 16. Offline Security

Offline data must be protected.

Requirements:

- Encrypt sensitive local data.
- Secure token storage.
- Avoid storing passwords.
- Protect downloaded documents.
- Remove expired cached data.

---

# 17. Token Management Offline

Rules:

- Access tokens are stored securely.
- Expired tokens require refresh.
- Refresh requires internet connection.

If authentication expires:

```

User Action

```
    |
```

Authentication Required

```
    |
```

Reconnect To Internet

```

---

# 18. Background Synchronization

Synchronization can run automatically.

Triggers:

- Application opening.
- Network restoration.
- Periodic background task.

Example:

```

Every 30 minutes

```
    |
```

Check Pending Data

```
    |
```

Synchronize

```

---

# 19. Error Handling

Possible errors:

```

SynchronizationException

NetworkUnavailableException

ConflictException

UploadFailedException

StorageException

```

---

# 20. User Feedback

The application must clearly display synchronization state.

Examples:

```

✓ All data synchronized

↓

3 pending operations

↓

Synchronizing...

↓

Synchronization completed

```

---

# 21. Performance Requirements

Offline mode must:

- Minimize local storage usage.
- Optimize synchronization payloads.
- Avoid unnecessary API calls.
- Compress uploaded files when possible.

---

# 22. Testing Strategy

## Unit Tests

Test:

- Local database operations.
- Queue management.
- Conflict resolution.

---

## Integration Tests

Test:

- Offline creation.
- Synchronization.
- Failed network scenarios.

---

## User Scenario Tests

Examples:

Scenario 1:

```

Intern writes journal offline

↓

Internet returns

↓

Journal synchronized

```

Scenario 2:

```

Intern uploads document offline

↓

Connection restored

↓

File uploaded successfully

```

---

# 23. Future Improvements

Possible extensions:

- Complete Offline-First architecture.
- Advanced conflict resolution.
- Background synchronization engine.
- Local AI assistant.
- Peer-to-peer temporary synchronization.

---

# 24. Conclusion

Offline mode improves the reliability and usability of the Internship Companion application.

By combining local storage, synchronization management, conflict handling, and secure data protection, interns and supervisors can continue working efficiently even when network connectivity is temporarily unavailable.