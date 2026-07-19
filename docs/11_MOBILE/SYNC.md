# Synchronization

## 1. Purpose

This document defines the synchronization mechanism of the **Internship Companion** mobile application.

The synchronization system is responsible for maintaining consistency between:

```

Mobile Application

```
    ⇅
```

Spring Boot Backend API

```
    ⇅
```

PostgreSQL Database

```

The main objectives are:

- Synchronize offline and online data.
- Maintain data consistency.
- Handle temporary network interruptions.
- Synchronize user actions safely.
- Manage conflicts.
- Provide reliable mobile experience.

---

# 2. Synchronization Vision

The mobile application follows a hybrid synchronization approach.

The application supports:

```

Online Mode

```
    |
```

Real-Time Communication With Backend

Offline Mode

```
    |
```

Local Storage

```
    |
```

Synchronization Later

```

The mobile application does not replace the backend as a source of truth.

The backend remains the authoritative system.

---

# 3. Synchronization Architecture

Architecture:

```

```
              Flutter Application

                      |

             Repository Layer

                      |

    --------------------------------

    |                              |
```

Local Data Source              Remote Data Source

SQLite / Hive                  REST API

```
    |                              |
```

Offline Database              Spring Boot Backend

```
                                    |

                              PostgreSQL
```

```

---

# 4. Synchronization Components

## 4.1 Synchronization Manager

Main component responsible for synchronization.

Responsibilities:

- Detect network availability.
- Manage synchronization queue.
- Upload pending changes.
- Download updates.
- Resolve conflicts.
- Report synchronization status.

---

## 4.2 Local Database

The local database stores:

- Cached backend data.
- Offline-created data.
- Pending operations.
- Synchronization metadata.

Possible technologies:

```

SQLite

OR

Hive

```

---

## 4.3 Remote API

The backend exposes synchronization endpoints.

Examples:

```

GET    /api/sync/pull

POST   /api/sync/push

GET    /api/sync/status

```

---

## 4.4 Synchronization Queue

The synchronization queue stores operations waiting to be synchronized.

Example:

```

SyncOperation

id

operationType

entityType

entityId

payload

createdAt

status

retryCount

```

---

# 5. Synchronization Strategy

The platform uses:

```

Delta Synchronization

```

Only changes since the last synchronization are exchanged.

Advantages:

- Reduced network usage.
- Faster synchronization.
- Better mobile performance.

---

# 6. Synchronization Flow

General synchronization process:

```

Application Starts

```
    |
```

Check Internet Connection

```
    |
```

Retrieve Last Sync Date

```
    |
```

Send Pending Local Changes

```
    |
```

Receive Backend Updates

```
    |
```

Apply Changes Locally

```
    |
```

Update Synchronization Timestamp

```

---

# 7. Push Synchronization

Push synchronization sends local changes to the backend.

Example:

Intern creates a journal entry offline.

Flow:

```

Create Journal Entry

```
    |
```

Save Locally

```
    |
```

Create Sync Operation

```
    |
```

Wait For Connection

```
    |
```

Send To Backend

```
    |
```

Backend Validation

```
    |
```

Store Result

```

---

# 8. Pull Synchronization

Pull synchronization retrieves backend updates.

Example:

Supervisor validates a journal.

Flow:

```

Backend Update

```
    |
```

Mobile Requests Changes

```
    |
```

Receive Updated Journal

```
    |
```

Update Local Database

```
    |
```

Notify User

```

---

# 9. Synchronizable Entities

The following entities support synchronization:

## Internship Information

Examples:

- Internship status.
- Department.
- Supervisor information.
- Timeline.

---

## Journal Entries

Synchronization:

- Draft creation.
- Modification.
- Submission status.
- Validation result.

---

## Tasks

Synchronization:

- Creation.
- Updates.
- Status changes.

---

## Deliverables

Synchronization:

- Upload requests.
- Validation status.
- Comments.

---

## Notifications

Synchronization:

- New notifications.
- Read status.

---

# 10. Synchronization Metadata

Each synchronized entity should contain metadata.

Example:

```

createdAt

updatedAt

lastSyncedAt

syncStatus

version

```

---

# 11. Sync Status

Each local record can have:

```

SYNCED

PENDING

SYNCING

FAILED

CONFLICT

```

---

# 12. Version Management

Each entity contains a version number.

Example:

```

Journal Entry

Version:

1

```

After modification:

```

Version:

2

```

The backend uses versions to detect conflicts.

---

# 13. Conflict Management

Conflicts happen when:

- Local data changed.
- Backend data changed.
- Both modifications affect the same entity.

Example:

```

Intern edits journal offline

```
    +
```

Supervisor validates same journal online

```

---

# 14. Conflict Resolution Rules

## 14.1 Administrative Data

Backend has priority.

Examples:

- Internship status.
- Assignment.
- Validation.

Reason:

Administrative decisions must remain controlled.

---

## 14.2 User Generated Content

Strategy:

```

Latest Valid Modification

```

Examples:

- Draft journal.
- Personal tasks.

---

## 14.3 Submitted Data

Submitted or validated records cannot be automatically overwritten.

Example:

```

Validated Journal

```
    |
```

Locked

```

---

# 15. File Synchronization

Files require special handling.

Process:

```

Select File

```
    |
```

Store Temporary Local Copy

```
    |
```

Create Upload Operation

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

# 16. Synchronization Queue Processing

The queue processor works as:

```

Retrieve Pending Operations

```
    |
```

Order By Creation Date

```
    |
```

Execute Operation

```
    |
```

Update Status

```
    |
```

Retry Failed Operations

```

---

# 17. Retry Mechanism

Failed operations are retried automatically.

Example:

```

Attempt 1

```
    |
```

Failure

```
    |
```

Attempt 2

```
    |
```

Failure

```
    |
```

Attempt 3

```
    |
```

Mark Failed

```

Recommended:

```

Maximum Retry Attempts: 3

```

---

# 18. Background Synchronization

Synchronization can run automatically.

Triggers:

- Application opening.
- Internet connection restored.
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

# 19. Network Handling

The application detects:

```

ONLINE

OFFLINE

LIMITED CONNECTION

```

Behavior:

## Online

- Synchronize immediately.

## Offline

- Store operations locally.

## Limited Connection

- Delay large uploads.

---

# 20. Security Requirements

Synchronization must respect:

## Authentication

Every synchronization request requires:

```

JWT Access Token

```

---

## Authorization

Users synchronize only allowed data.

Example:

Intern:

```

Own internship data only

```

Supervisor:

```

Assigned interns only

````

---

## Data Protection

Sensitive data must:

- Be encrypted locally.
- Use HTTPS communication.
- Avoid unauthorized storage.

---

# 21. Synchronization API Example

## Push Request

```json
{
  "operation": "CREATE",
  "entity": "JournalEntry",
  "data": {
    "title": "Day 1",
    "description": "Introduction"
  }
}
````

---

## Pull Response

```json
{
  "lastSync": "2026-07-20T10:00:00",
  "changes": [
    {
      "entity": "Task",
      "action": "UPDATE",
      "version": 2
    }
  ]
}
```

---

# 22. Error Handling

Possible errors:

```
SynchronizationException

NetworkException

ConflictException

UnauthorizedSyncException

UploadFailedException
```

---

# 23. User Interface Feedback

The application should display synchronization status.

Examples:

```
✓ All data synchronized
```

```
3 pending changes
```

```
Synchronizing...
```

```
Synchronization failed
```

---

# 24. Testing Strategy

## Unit Tests

Test:

* Queue management.
* Version comparison.
* Conflict rules.
* Local storage.

---

## Integration Tests

Test:

* Push synchronization.
* Pull synchronization.
* Backend communication.

---

## Scenario Tests

### Scenario 1

```
Intern creates journal offline

        |

Connection restored

        |

Journal synchronized
```

---

### Scenario 2

```
Supervisor validates deliverable

        |

Intern receives update
```

---

### Scenario 3

```
Upload interrupted

        |

Retry mechanism starts

        |

Upload completed
```

---

# 25. Performance Optimization

The synchronization system should:

* Send only changed data.
* Compress large files.
* Limit unnecessary requests.
* Process operations in batches.
* Avoid blocking the user interface.

---

# 26. Future Improvements

Possible extensions:

* Full Offline-First architecture.
* Real-time synchronization using WebSockets.
* Advanced conflict resolution.
* Peer-to-peer temporary synchronization.
* AI-based synchronization optimization.

---

# 27. Conclusion

The synchronization module ensures reliable communication between the Internship Companion mobile application and the STEG backend platform.

Through local storage, delta synchronization, operation queues, conflict management, and secure communication, users can continue working efficiently despite network limitations while maintaining data consistency.