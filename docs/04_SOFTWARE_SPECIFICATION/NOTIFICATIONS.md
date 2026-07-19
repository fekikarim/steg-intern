# NOTIFICATIONS.md

# Notification System Specification
## STEG Smart Internship & Administrative Workflow Platform

**Project:** Conception et Développement d'une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG  
**Version:** 1.0  
**Status:** Technical Specification  
**Authors:** Karim Feki & Nesrine Derouiche  

---

# 1. Introduction

## 1.1 Purpose

This document defines the notification management system of the STEG Smart Internship & Administrative Workflow Platform.

The objective is to provide a centralized communication mechanism allowing the platform to inform users about important events related to:

- Internship applications.
- Internship progress.
- Workflow actions.
- Documents.
- Tasks.
- Deliverables.
- Evaluations.
- Payments.
- Administrative operations.

The notification system must remain:

- Simple.
- Reliable.
- Maintainable.
- Independent from expensive external services.
- Easily extensible in the future.

---

# 2. Notification Architecture

The notification system belongs to the **Communication Bounded Context**.

It is integrated with the centralized Spring Boot backend.

Architecture:

                Business Events

                      |
                      v

          Notification Service

                      |
    --------------------------------
    |              |               |
    v              v               v

In-App          Email          Push Mobile

    |
    v

PostgreSQL Notification Database

---

# 3. Supported Notification Channels

The platform supports three notification channels.

---

# 3.1 In-App Notifications

## Description

Notifications displayed directly inside:

- Next.js Front Office.
- Angular Back Office.
- Flutter Mobile Application.

## Characteristics

- Stored permanently.
- Always available after login.
- Supports read/unread status.

## Examples

- Application accepted.
- Document validated.
- Task assigned.

---

# 3.2 Email Notifications

## Description

Notifications sent through email.

## Purpose

Used for important administrative events.

Examples:

- Account creation.
- Internship acceptance.
- Missing documents.
- Important workflow decisions.

## Implementation

The system can use:

- SMTP server.
- Company email server.

No paid notification service is required.

---

# 3.3 Push Notifications

## Description

Notifications sent to the Flutter mobile application.

## Purpose

Improve communication during internship execution.

Examples:

- Journal validation.
- New task.
- Deliverable feedback.

## Future Integration

Possible technologies:

- Firebase Cloud Messaging (FCM).
- Self-hosted push solutions.

---

# 4. Notification Entity Model

The notification system follows the Communication bounded context design.

Main entities:


Notification

    |
    |
    v

NotificationRecipient


---

# 4.1 Notification

Represents a generated notification.

Attributes:

| Attribute | Description |
|-|-|
| id | Unique identifier |
| title | Notification title |
| message | Notification content |
| type | Notification channel |
| priority | Importance level |
| relatedEntityType | Related business entity |
| relatedEntityId | Related entity identifier |
| sentAt | Sending date |
| createdAt | Creation date |

---

# 4.2 NotificationRecipient

Represents notification receivers.

The recipient is separated from the notification because one notification can target multiple users.

Attributes:

| Attribute | Description |
|-|-|
| id | Unique identifier |
| recipientType | Target category |
| recipientId | Target identifier |
| read | Read status |
| readAt | Reading date |

---

# 5. Recipient Types

The system supports multiple notification targets.

## USER

Direct notification to one user.

Example:


Your internship application has been accepted.


---

## DEPARTMENT

Notification sent to all users belonging to a department.

Example:


New internship requests require review.


---

## ROLE

Notification sent to users having a specific role.

Examples:

- All HR managers.
- All supervisors.

---

## BROADCAST

Notification sent globally.

Example:


Platform maintenance scheduled tomorrow.


---

# 6. Notification Types

The system defines three notification types.

## EMAIL

External email notification.

Example:


Internship acceptance email.


---

## PUSH

Mobile notification.

Example:


Your supervisor validated your journal.


---

## IN_APP

Internal platform notification.

Example:


New document available.


---

# 7. Notification Priority

Notifications have different importance levels.

## LOW

Informational messages.

Example:


New platform information available.


---

## NORMAL

Standard system notifications.

Example:


New task assigned.


---

## HIGH

Important workflow events.

Example:


Document rejected.


---

## URGENT

Critical administrative information.

Example:


Internship cancelled.


---

# 8. Notification Lifecycle


CREATED

|

PROCESSING

|

SENT

|

READ (optional)

|

ARCHIVED


---

# 9. Notification Generation Rules

Notifications are generated automatically after important business events.

---

# 9.1 Internship Application Notifications

## Candidate Actions

### Application Submitted

Receiver:

- HR Manager.

Notification:


New internship application received.


---

### Application Accepted

Receiver:

- Candidate.

Notification:


Your internship application has been accepted.


---

### Application Rejected

Receiver:

- Candidate.

Notification:


Your internship application has been rejected.


---

# 9.2 Document Notifications

## Document Uploaded

Receiver:

- HR Manager.
- Supervisor if required.

Message:


A new document requires validation.


---

## Document Validated

Receiver:

- Candidate.
- Intern.

Message:


Your document has been validated.


---

## Document Rejected

Receiver:

- Candidate.

Message:


Your document requires modification.


---

# 9.3 Workflow Notifications

Generated when:

- Approval requested.
- Validation completed.
- Action rejected.

Examples:


A workflow action requires your approval.

Your request has been approved.


---

# 9.4 Internship Companion Notifications

## Task Assignment

Receiver:

- Intern.

Message:


A new task has been assigned.


---

## Journal Validation

Receiver:

- Intern.

Message:


Your internship journal has been validated.


---

## Deliverable Feedback

Receiver:

- Intern.

Message:


Your deliverable received feedback.


---

# 9.5 Financial Notifications

## Payment Validation

Receiver:

- Intern.
- Finance manager.

Message:


Internship payment validated.


---

# 10. Notification Service Responsibilities

The Notification Service is responsible for:

- Creating notifications.
- Determining recipients.
- Saving notification history.
- Sending notifications.
- Updating delivery status.
- Managing read status.

---

# 11. Notification Processing Flow

Example:

Application accepted.


HR Manager approves application

      |

Workflow Engine validates action

      |

Internship Service emits event

      |

Notification Service receives event

      |

Notification created

      |

Recipient identified

      |

Notification sent

      |

History stored


---

# 12. Backend Implementation

Recommended structure:


notification

├── controller

├── service

├── repository

├── entity

├── dto

├── mapper

└── event


---

# 13. Notification API Examples

## Get User Notifications


GET /api/notifications

Response:

```json
[
  {
    "id": "uuid",
    "title": "Application Accepted",
    "message": "Your internship application was accepted",
    "type": "IN_APP",
    "read": false
  }
]
```

## Mark Notification As Read

`PATCH /api/notifications/{id}/read`

## Send Notification

Internal service operation:

`POST /api/internal/notifications`

## 14. Database Considerations

Main tables:

`notifications`

`notification_recipients`

`notifications`

Contains:

Notification content.
Type.
Priority.
Related entity.
notification_recipients

Contains:

Receiver.
Read state.
Reading date.

## 15. Security Rules

The notification system must ensure:

Users only access their own notifications.
Sensitive information is not exposed.
Authorization is checked before reading.
Notification history cannot be modified by unauthorized users.

## 16. Error Handling

Possible errors:

| Error | Handling |
| --- | --- |
| Email sending failure | Log error and retry |
| Invalid recipient | Reject notification |
| Storage failure | Return system error |
| Unauthorized access | Return 403 |

## 17. Future Improvements

The architecture allows future extensions:

### Advanced Real-Time Notifications

Using:

WebSocket.
Server-Sent Events.

### Notification Preferences

Allow users to configure:

Email enabled/disabled.
Push enabled/disabled.
Notification categories.

### Intelligent Notifications

Future AI capabilities:

Priority prediction.
Automatic reminders.
Workflow delay alerts.

## 18. Summary

The notification system provides a centralized communication layer for the STEG platform.

It ensures:

Better communication between actors.
Complete traceability.
Simple implementation.
No dependency on paid notification providers.
Future scalability.

The system remains independent and reusable for future administrative modules.

---

End of Document