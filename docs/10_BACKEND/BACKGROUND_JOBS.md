# Background Jobs

## 1. Purpose

This document defines the background processing architecture of the STEG Internship Management Platform backend.

Background jobs allow the system to execute asynchronous and scheduled operations without blocking user interactions.

They are responsible for:

- Automated processing.
- Periodic verification.
- Notifications.
- Document generation.
- Data maintenance.
- System optimization.

---

# 2. Background Processing Architecture

The platform uses asynchronous and scheduled tasks.

Architecture:

```

User Action

```
  |
```

Backend API

```
  |
```

Service Layer

```
  |
```

Background Job Queue / Scheduler

```
  |
```

Worker Processing

```
  |
```

Database / External Services

```

---

# 3. Background Job Principles

## 3.1 Non-Blocking Operations

Long operations should not delay API responses.

Examples:

- PDF generation.
- Sending multiple notifications.
- Report generation.
- File processing.

---

## 3.2 Reliability

Every background job must provide:

- Error handling.
- Logging.
- Retry mechanism.
- Execution tracking.

---

## 3.3 Idempotency

Jobs must be designed to safely execute multiple times.

Example:

Sending a notification:

```

First execution:
Notification created

Second execution:
Existing notification detected
No duplicate created

```

---

# 4. Technology Approach

Recommended implementation:

```

Spring Boot Scheduler

*

Spring Async

*

Spring Batch (for heavy processing)

```

Future scalable solution:

```

Message Broker

(RabbitMQ / Kafka)

```

---

# 5. Job Categories

The platform contains:

```

Scheduled Jobs

Event-Based Jobs

Maintenance Jobs

Processing Jobs

```

---

# 6. Internship Monitoring Jobs

# 6.1 Internship Status Update Job

## Purpose

Automatically updates internship statuses according to dates.

Frequency:

```

Daily

```

---

Process:

```

Check internships

```
    |
```

Compare current date

```
    |
```

Update status

```

Rules:

If:

```

Current Date >= Start Date

```

then:

```

PLANNED → ACTIVE

```

---

If:

```

Current Date > End Date

```

then:

```

ACTIVE → COMPLETED

```

---

Actions:

- Update internship status.
- Create audit log.
- Send notifications.

---

# 6.2 Internship Reminder Job

## Purpose

Reminds users about upcoming deadlines.

Frequency:

```

Daily

```

Examples:

- Internship start reminder.
- Internship ending reminder.
- Missing deliverables.

Recipients:

- Intern.
- Supervisor.
- HR Manager.

---

# 7. Notification Jobs

# 7.1 Notification Processing Job

## Purpose

Processes pending notifications.

Frequency:

```

Every few minutes

```

Process:

```

Retrieve pending notifications

```
    |
```

Determine channel

```
    |
```

Send notification

```
    |
```

Update status

```

Channels:

```

EMAIL

PUSH

IN_APP

```

---

# 7.2 Email Notification Job

## Purpose

Sends queued emails asynchronously.

Examples:

- Application received.
- Application accepted.
- Workflow approval required.
- Document validation.

Rules:

- Failed emails are retried.
- Errors are logged.

---

# 7.3 Notification Cleanup Job

## Purpose

Removes old temporary notification data.

Frequency:

```

Monthly

```

Rules:

Archive:

- Old notifications.
- Expired messages.

Never delete:

- Audit-related notifications.

---

# 8. Document Processing Jobs

# 8.1 Automatic Document Generation Job

## Purpose

Generates administrative documents asynchronously.

Examples:

- Internship convention.
- Assignment letter.
- Internship certificate.

Process:

```

Request Generation

```
    |
```

Create Job

```
    |
```

Generate PDF

```
    |
```

Store Document

```
    |
```

Notify User

```

---

# 8.2 Document Cleanup Job

## Purpose

Maintains storage organization.

Frequency:

```

Monthly

```

Actions:

- Detect unused temporary files.
- Remove incomplete uploads.
- Validate storage references.

---

# 9. Workflow Jobs

# 9.1 Workflow Reminder Job

## Purpose

Detects delayed validations.

Frequency:

```

Daily

```

Checks:

- Pending approvals.
- Pending validations.
- Waiting actions.

---

Actions:

Notify:

- Responsible employee.
- Supervisor.
- HR Manager.

---

# 9.2 Workflow Escalation Job

## Purpose

Handles workflows exceeding allowed delays.

Example:

```

Approval pending > 7 days

```

Actions:

- Send reminder.
- Escalate to higher responsibility.

---

# 10. Internship Companion Jobs

# 10.1 Journal Reminder Job

## Purpose

Encourages interns to complete journals.

Frequency:

```

Daily

```

Conditions:

If:

```

No journal submitted

```

then:

Send reminder.

---

# 10.2 Deliverable Deadline Job

## Purpose

Monitors expected deliverables.

Checks:

- Missing deliverables.
- Late submissions.
- Upcoming deadlines.

Recipients:

- Intern.
- Supervisor.

---

# 11. Payment Processing Jobs

# 11.1 Payment Status Verification Job

## Purpose

Checks payment lifecycle.

Frequency:

```

Daily

```

Process:

```

Find pending payments

```
    |
```

Check validation state

```
    |
```

Update status

```

---

# 11.2 Payment Report Generation Job

## Purpose

Generates periodic financial reports.

Frequency:

```

Monthly

```

Reports:

- Paid internships.
- Pending payments.
- Department statistics.

---

# 12. Security and Audit Jobs

# 12.1 Audit Log Archiving Job

## Purpose

Archives old audit records.

Frequency:

```

Yearly

```

Rules:

- Keep historical integrity.
- Compress old records.
- Maintain accessibility.

---

# 12.2 Expired Session Cleanup Job

## Purpose

Removes expired authentication sessions.

Frequency:

```

Daily

```

Actions:

- Delete expired sessions.
- Revoke invalid tokens.

---

# 13. Refresh Token Cleanup Job

## Purpose

Maintains authentication security.

Frequency:

```

Daily

```

Process:

Find:

```

Expired refresh tokens

OR

Revoked tokens

```

Actions:

- Remove expired tokens.
- Keep security history if required.

---

# 14. Database Maintenance Jobs

# 14.1 Database Health Check Job

## Purpose

Monitors database availability.

Checks:

- Connection status.
- Performance indicators.
- Storage capacity.

---

# 14.2 Data Consistency Check Job

## Purpose

Detects abnormal situations.

Examples:

- Internship without assignment.
- Payment without internship.
- Missing required documents.

Actions:

- Create system alert.
- Generate audit entry.

---

# 15. Reporting Jobs

# 15.1 Statistics Aggregation Job

## Purpose

Pre-calculates dashboard statistics.

Frequency:

```

Daily

```

Calculates:

- Number of interns.
- Applications statistics.
- Internship distribution.
- Payment summaries.

---

# 15.2 Export Report Job

## Purpose

Generates large reports asynchronously.

Formats:

- PDF.
- Excel.

Process:

```

User requests report

```
    |
```

Background processing

```
    |
```

File generated

```
    |
```

Notification sent

```

---

# 16. Job Execution Tracking

Every job should store:

```

Job ID

Job Name

Execution Time

Status

Duration

Error Message

```

Possible statuses:

```

RUNNING

SUCCESS

FAILED

RETRYING

```

---

# 17. Error Handling

When a job fails:

Process:

```

Catch Exception

```
    |
```

Log Error

```
    |
```

Retry

```
    |
```

Notify Administrator if needed

```

---

Retry strategy:

```

Attempt 1

↓

Wait

↓

Attempt 2

↓

Attempt 3

↓

Mark Failed

```

---

# 18. Logging Rules

Background jobs must log:

- Start time.
- End time.
- Number of processed records.
- Errors.
- Execution result.

Avoid logging:

- Passwords.
- Tokens.
- Personal sensitive information.

---

# 19. Monitoring

Administrators should be able to monitor:

- Running jobs.
- Failed jobs.
- Execution history.
- Performance.

Future integration:

- Spring Actuator.
- Monitoring dashboard.

---

# 20. Performance Considerations

Jobs must:

- Process data in batches.
- Avoid blocking transactions.
- Use pagination.
- Limit memory consumption.

Example:

Bad:

```

Load all internships

```

Good:

```

Process 100 internships per batch

```

---

# 21. Security Considerations

Background jobs must:

- Run with controlled permissions.
- Validate generated data.
- Respect access rules.
- Create audit records for sensitive actions.

---

# 22. Future Improvements

Possible extensions:

- Distributed job processing.
- Message queues.
- Real-time event streaming.
- AI-based document analysis.
- Automatic workflow optimization.

---

# 23. Conclusion

Background jobs provide automation and reliability for the STEG Internship Management Platform.

They allow the system to execute heavy, periodic, and automated operations while maintaining:

- Performance.
- Security.
- Data consistency.
- Better user experience.