# Mobile Features

## 1. Purpose

This document defines the functional features of the **Internship Companion** mobile application within the STEG Internship Management Platform.

The mobile application provides a digital workspace for:

- Interns during their internship period.
- Supervisors responsible for monitoring and evaluation.

The main objective is to facilitate internship execution, improve communication, and provide continuous visibility on internship progress.

---

# 2. Mobile Application Scope

The mobile application covers the operational phase of the internship lifecycle.

```

Internship Assignment

```
    |
```

Daily Internship Activities

```
    |
```

Monitoring

```
    |
```

Validation

```
    |
```

Evaluation

```
    |
```

Internship Completion

```

---

# 3. User Roles

The application supports two main roles:

```

INTERN

SUPERVISOR

```

Each role has specific permissions and functionalities.

---

# 4. Authentication Features

## 4.1 Secure Login

Users can authenticate using:

- Email.
- Password.

Authentication mechanism:

```

JWT Access Token

*

Refresh Token

```

---

## 4.2 Session Management

Features:

- Maintain authenticated session.
- Automatic token refresh.
- Secure logout.
- Session expiration handling.

---

## 4.3 Profile Management

Users can view:

- Personal information.
- Role information.
- Internship information.

---

# 5. Intern Features

---

# 5.1 Internship Dashboard

The intern dashboard provides an overview of the internship.

Displayed information:

- Internship status.
- Remaining duration.
- Assigned department.
- Supervisor information.
- Pending tasks.
- Latest notifications.

Example:

```

Internship Status:

ACTIVE

Progress:

65%

Pending Actions:

* Submit weekly journal
* Upload deliverable

```

---

# 5.2 Internship Timeline

The intern can visualize internship progress.

Timeline elements:

- Start date.
- Assignment date.
- Important milestones.
- Deliverable deadlines.
- Evaluation dates.
- Completion date.

Example:

```

✓ Internship Assigned

✓ First Week Completed

→ Deliverable Submission

→ Final Evaluation

```

---

# 5.3 Digital Journal

The journal allows interns to document internship activities.

Features:

- Create journal entries.
- Edit drafts.
- Submit entries.
- View validation status.
- Receive supervisor feedback.

Journal states:

```

DRAFT

SUBMITTED

VALIDATED

REJECTED

```

---

## Journal Entry Information

Each entry contains:

- Title.
- Description.
- Date.
- Attachments (optional).
- Status.

---

# 5.4 Task Management

The intern can manage internship tasks.

Features:

- View assigned tasks.
- Create personal tasks.
- Update task status.
- Track deadlines.

Task statuses:

```

TODO

IN_PROGRESS

COMPLETED

CANCELLED

```

---

# 5.5 Deliverable Management

The intern can submit internship deliverables.

Examples:

- Reports.
- Documents.
- Images.
- Project files.

Features:

- Upload files.
- View submission history.
- Track validation status.
- Receive supervisor comments.

Deliverable states:

```

DRAFT

SUBMITTED

VALIDATED

REJECTED

```

---

# 5.6 Document Access

The intern can access generated documents.

Examples:

- Internship convention.
- Assignment letter.
- Internship certificate.

Features:

- View documents.
- Download documents.
- Share documents if authorized.

---

# 5.7 Notifications

The intern receives notifications for:

- Journal validation.
- Deliverable feedback.
- Task deadlines.
- Supervisor comments.
- Administrative updates.

Notification types:

```

PUSH

IN_APP

EMAIL

```

---

# 5.8 Progress Tracking

The intern can monitor:

- Completed activities.
- Pending actions.
- Internship completion percentage.

---

# 6. Supervisor Features

---

# 6.1 Supervisor Dashboard

The supervisor dashboard provides:

- Assigned interns list.
- Internship progress.
- Pending validations.
- Recent activities.

Example:

```

My Interns:

* Student A : 80%
* Student B : 45%

Pending:

3 journals
2 deliverables

```

---

# 6.2 Intern Monitoring

The supervisor can:

- View intern profiles.
- Access internship timeline.
- Monitor activities.
- Review progress.

---

# 6.3 Journal Validation

The supervisor can:

- View submitted journals.
- Validate entries.
- Reject entries.
- Add comments.

Actions:

```

Approve

Reject

Comment

```

---

# 6.4 Deliverable Validation

The supervisor can review submitted files.

Features:

- Open deliverables.
- Validate documents.
- Reject submissions.
- Provide feedback.

---

# 6.5 Comments and Feedback

The supervisor can communicate with interns.

Features:

- Add comments.
- Provide recommendations.
- Give improvement feedback.

Comments are attached to:

- Journals.
- Deliverables.
- Evaluations.

---

# 6.6 Internship Evaluation

The supervisor can perform evaluations.

Supported evaluation types:

```

DAILY

WEEKLY

MID_TERM

FINAL

CUSTOM

```

Evaluation includes:

- Criteria.
- Score.
- Comments.
- Recommendations.

---

# 7. Common Features

---

# 7.1 Notification Center

Users can:

- View notifications.
- Mark notifications as read.
- Access related content.

---

# 7.2 Search and Filtering

Users can search:

- Tasks.
- Journals.
- Deliverables.
- Documents.

---

# 7.3 File Upload

Supported files:

- PDF.
- Images.
- Office documents.

Features:

- File selection.
- Upload progress.
- Validation.
- Error handling.

---

# 7.4 Camera Integration

Possible uses:

- Upload internship photos.
- Scan documents.
- Capture evidence of activities.

---

# 8. QR Code Features

The application supports QR code functionality.

Possible features:

## Internship Identification

Scan QR code to retrieve:

- Internship reference.
- Intern information.
- Internship status.

---

## Document Verification

QR codes can be included in generated documents.

Verification information:

- Document reference.
- Generation date.
- Authenticity status.

---

# 9. Offline Features

The application supports limited offline usage.

Available offline actions:

- Write journal drafts.
- View cached information.
- Prepare tasks.
- Store temporary uploads.

When connection returns:

```

Local Data

↓

Synchronization

↓

Backend Update

```

---

# 10. Synchronization Features

Synchronization handles:

- Journal updates.
- Task changes.
- Deliverable uploads.
- Notifications.

The system manages:

- New records.
- Updated records.
- Conflicts.

---

# 11. Security Features

The mobile application includes:

## Authentication Security

- JWT authentication.
- Secure token storage.
- Automatic token expiration.

---

## Data Protection

- Encrypted local storage.
- Secure API communication.
- Protected files.

---

## Access Control

Users can only access authorized information.

Examples:

Intern:

```

Own internship only

```

Supervisor:

```

Assigned interns only

```

---

# 12. User Experience Features

The application provides:

- Modern mobile interface.
- Simple navigation.
- Responsive layouts.
- Clear status indicators.
- Minimal user actions.

---

# 13. Future Features

Possible future extensions:

## Real-Time Messaging

Direct communication:

```

Intern ↔ Supervisor

```

---

## Attendance Management

Features:

- Check-in.
- Check-out.
- Location verification.

---

## AI Internship Assistant

Capabilities:

- Journal suggestions.
- Progress analysis.
- Automatic summaries.

---

## Biometric Authentication

Support:

- Fingerprint.
- Face recognition.

---

# 14. Feature Summary

| Module | Intern | Supervisor |
|---|---|---|
| Authentication | ✓ | ✓ |
| Dashboard | ✓ | ✓ |
| Timeline | ✓ | ✓ |
| Journal | Create / Submit | Validate |
| Tasks | Manage | Monitor |
| Deliverables | Submit | Validate |
| Documents | View | View |
| Notifications | Receive | Receive |
| Comments | View | Create |
| Evaluation | View | Create |
| QR Code | Scan | Scan |
| Offline Mode | ✓ | ✓ |

---

# 15. Conclusion

The Internship Companion mobile application provides a complete digital environment for internship execution.

Through journal management, task tracking, deliverable submission, validation workflows, notifications, and offline capabilities, the application improves collaboration between interns and supervisors while ensuring better internship monitoring and traceability.