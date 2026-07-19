# Push Notifications

## 1. Purpose

This document defines the push notification system of the **Internship Companion** mobile application.

The notification system is responsible for delivering real-time information to interns and supervisors about important internship events.

The objectives are:

- Improve communication between users.
- Reduce missed actions and deadlines.
- Provide real-time internship updates.
- Improve user engagement.
- Support workflow monitoring.

---

# 2. Notification Strategy

The platform uses multiple notification channels:

```

```
                Notification System

                       |

    --------------------------------------

    |                  |                 |
```

Push Notification   In-App Notification   Email

```id="h5c2l9"

Push notifications are mainly used for mobile users.

---

# 3. Technology

Recommended technology:

```

Firebase Cloud Messaging (FCM)

```id="c8v9hz"

Firebase Cloud Messaging provides:

- Android push notifications.
- iOS push notifications.
- Device token management.
- Message delivery.

---

# 4. Notification Architecture

Architecture:

```

Business Event

```
    |
```

Backend Notification Service

```
    |
```

Notification Database

```
    |
```

Push Notification Service

```
    |
```

Firebase Cloud Messaging

```
    |
```

Mobile Application

```id="z1m5qh"

---

# 5. Main Components

## 5.1 Notification Service

Backend service responsible for:

- Creating notifications.
- Selecting recipients.
- Sending notifications.
- Tracking notification status.

---

## 5.2 Push Notification Gateway

Responsible for:

- Communicating with FCM.
- Sending device messages.
- Handling delivery responses.

---

## 5.3 Mobile Notification Manager

Flutter component responsible for:

- Receiving notifications.
- Displaying notifications.
- Handling user interactions.

---

# 6. Notification Lifecycle

A notification follows this lifecycle:

```

Event Generated

```
    |
```

Notification Created

```
    |
```

Recipient Identified

```
    |
```

Push Message Sent

```
    |
```

User Receives Notification

```
    |
```

Notification Opened

```id="w6qf1n"

---

# 7. Notification Entity

The backend stores notification information.

Main attributes:

```

Notification

* id
* title
* message
* type
* priority
* relatedEntityType
* relatedEntityId
* createdAt
* sentAt

```id="q4z8jv"

---

# 8. Device Token Management

Each mobile device is identified by a token.

Entity:

```

DeviceToken

```

Attributes:

```

id

userId

token

deviceType

createdAt

lastUsedAt

active

```id="9p0t0b"

---

# 9. Notification Types

The system supports:

```

INTERNSHIP

WORKFLOW

JOURNAL

TASK

DELIVERABLE

EVALUATION

PAYMENT

SYSTEM

SECURITY

```id="yq3x8n"

---

# 10. Intern Notifications

## 10.1 Internship Assignment

Trigger:

```

Internship Assignment Created

```

Message example:

```

Your internship has been assigned to the IT department.

```id="6v4p9s"

---

## 10.2 Journal Validation

Trigger:

```

Supervisor Validates Journal

```

Message:

```

Your journal entry has been validated.

```id="u8b6qk"

---

## 10.3 Journal Rejection

Trigger:

```

Journal Rejected

```

Message:

```

Your journal requires modifications.

```id="2w4l9m"

---

## 10.4 Deliverable Feedback

Trigger:

```

Deliverable Reviewed

```

Message:

```

Your supervisor added feedback to your deliverable.

```id="5h0j1z"

---

## 10.5 Task Reminder

Trigger:

```

Task Deadline Approaching

```

Message:

```

Your internship report is due tomorrow.

```id="6h6p0v"

---

## 10.6 Evaluation Available

Trigger:

```

New Evaluation Published

```

Message:

```

A new internship evaluation is available.

```id="2e7w4d"

---

# 11. Supervisor Notifications

## 11.1 New Journal Submitted

Trigger:

```

Intern Submits Journal

```

Message:

```

A new journal entry requires validation.

```id="x4m5zq"

---

## 11.2 Deliverable Submitted

Trigger:

```

New Deliverable Submitted

```

Message:

```

A deliverable is waiting for review.

```id="n8s2pk"

---

## 11.3 Evaluation Reminder

Trigger:

```

Evaluation Deadline Approaching

```

Message:

```

Pending internship evaluations require completion.

```id="f8w2pq"

---

# 12. Administrative Notifications

Examples:

## Platform Updates

```

System maintenance scheduled.

```

---

## Security Alerts

Examples:

- Suspicious login.
- Multiple failed authentication attempts.

---

# 13. Notification Priority

Each notification has a priority.

Values:

```

LOW

NORMAL

HIGH

URGENT

```id="s5k8nd"

---

## Priority Behavior

### LOW

Examples:

- General information.

No sound or immediate alert.

---

### NORMAL

Examples:

- Journal updates.
- Task changes.

Standard notification.

---

### HIGH

Examples:

- Validation requests.
- Important deadlines.

Immediate attention required.

---

### URGENT

Examples:

- Security alerts.
- Critical system actions.

Requires immediate display.

---

# 14. Notification Interaction

When a user taps a notification:

The application opens the related screen.

Examples:

```

Journal Validation Notification

```
    |
```

Open Journal Details

```
```

Deliverable Notification

```
    |
```

Open Deliverable Page

````id="1p6w8x"

---

# 15. Deep Linking

Notifications support navigation links.

Example payload:

```json
{
  "type": "JOURNAL",
  "entityId": "123",
  "screen": "journal-details"
}
````

The mobile application uses this information to navigate directly.

---

# 16. Notification Preferences

Users may manage preferences.

Possible settings:

````
Enable / Disable Push Notifications

Email Notifications

Important Alerts Only
``` id="k2q4mn"

---

# 17. Offline Notification Handling

When the device is offline:

- Notifications are stored by backend.
- They are delivered when connection returns.
- Missed notifications remain available in-app.

---

# 18. Notification Security

The system must ensure:

- Users receive only authorized notifications.
- Tokens are protected.
- Sensitive information is not exposed.
- Notification content respects user permissions.

---

# 19. Notification Delivery Reliability

The system handles:

- Failed deliveries.
- Invalid device tokens.
- Expired tokens.
- Retry attempts.

Example:

````

Send Notification

```
    |
```

Failure

```
    |
```

Retry

```
    |
```

Deactivate Invalid Token

```id="7f9x3m"

---

# 20. Background Processing

Notifications should be processed asynchronously.

Example:

```

Business Action

```
    |
```

Create Notification Event

```
    |
```

Background Job

```
    |
```

Send Push Notification

```id="g7p5q2"

---

# 21. Logging and Monitoring

The system records:

- Notification creation.
- Recipient.
- Sending status.
- Delivery result.
- Errors.

---

# 22. Testing Strategy

## Unit Tests

Test:

- Notification creation.
- Recipient selection.
- Priority rules.

---

## Integration Tests

Test:

- Backend to FCM communication.
- Mobile reception.
- Deep linking.

---

## User Tests

Scenarios:

```

Supervisor validates journal

↓

Intern receives notification

```
```

Task deadline approaches

↓

Reminder notification displayed

```id="v5r8zn"

---

# 23. Future Improvements

Possible extensions:

- Real-time chat notifications.
- SMS integration.
- WhatsApp notifications.
- Intelligent notification prioritization.
- AI-generated reminders.
- Personalized notification schedules.

---

# 24. Conclusion

The push notification system ensures continuous communication between interns, supervisors, and the STEG platform.

By combining Firebase Cloud Messaging, backend notification management, and mobile integration, the system provides timely, secure, and reliable information delivery throughout the internship lifecycle.