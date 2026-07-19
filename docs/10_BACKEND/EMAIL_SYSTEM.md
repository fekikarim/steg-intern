# Email System

## 1. Purpose

This document defines the email communication system of the STEG Internship Management Platform backend.

The email system is responsible for:

- Sending automated emails.
- Informing users about important events.
- Supporting workflow communication.
- Improving user experience.
- Maintaining communication traceability.

The system provides a simple, maintainable email mechanism without relying on paid external platforms.

---

# 2. Email Architecture

The email system follows an asynchronous architecture.

```

Business Event

```
    |
```

Notification Service

```
    |
```

Email Service

```
    |
```

Email Queue

```
    |
```

Email Processor

```
    |
```

SMTP Server

```
    |
```

Recipient

```

---

# 3. Design Principles

The email system follows:

## 3.1 Asynchronous Processing

Emails must not block user requests.

Example:

When an application is accepted:

```

Accept Application

↓

Create Email Task

↓

Return API Response

↓

Send Email In Background

```

---

## 3.2 Template-Based Emails

Emails must use predefined templates.

Advantages:

- Consistent design.
- Easier maintenance.
- Multi-language support.
- Better user experience.

---

## 3.3 Centralized Management

All email sending operations must pass through:

```

EmailService

```

No service should directly send emails.

Incorrect:

```

InternshipService

```
    |
```

SMTP

```

Correct:

```

InternshipService

```
    |
```

EmailService

```
    |
```

SMTP

```

---

# 4. Technology Stack

Recommended implementation:

Backend:

```

Spring Boot Mail

JavaMailSender

Thymeleaf Templates

```

Email protocol:

```

SMTP

```

Possible SMTP providers:

- STEG internal mail server.
- Gmail SMTP for testing.
- University/company SMTP.

---

# 5. Email Service Architecture

Main components:

```

EmailController
|
EmailService
|
EmailTemplateService
|
EmailSender
|
SMTP Server

````

---

# 6. Email Service Responsibilities

## 6.1 EmailService

Main responsibilities:

- Create emails.
- Send emails.
- Validate recipients.
- Manage templates.
- Handle failures.

Main operations:

```java
sendEmail()

sendTemplateEmail()

sendBulkEmail()
````

---

## 6.2 EmailTemplateService

Responsibilities:

* Load templates.
* Replace variables.
* Generate email content.

Example:

Template:

```
Hello {{studentName}},

Your internship application has been accepted.
```

Generated:

```
Hello Karim,

Your internship application has been accepted.
```

---

## 6.3 EmailSender

Responsibilities:

* SMTP communication.
* Sending messages.
* Handling connection errors.

---

# 7. Email Types

The platform supports:

```
Transactional Emails

Notification Emails

Administrative Emails
```

---

# 8. Transactional Emails

Transactional emails are triggered automatically by business actions.

---

# 8.1 Account Creation Email

Trigger:

```
New User Created
```

Recipients:

* Candidate.
* Employee.

Content:

* Welcome message.
* Account information.
* Login instructions.

---

# 8.2 Password Reset Email

Trigger:

```
Password Reset Request
```

Content:

* Reset instructions.
* Temporary link.
* Expiration information.

Security rules:

* Never send passwords.
* Reset links expire.
* Requests are logged.

---

# 8.3 Email Verification

Trigger:

```
New Candidate Registration
```

Purpose:

Verify email ownership.

---

# 9. Internship Application Emails

---

# 9.1 Application Submitted Email

Trigger:

```
Application Status:

DRAFT

↓

SUBMITTED
```

Recipient:

```
Candidate
```

Content:

* Application reference.
* Submission date.
* Next steps.

---

# 9.2 Application Under Review Email

Trigger:

```
SUBMITTED

↓

UNDER_REVIEW
```

Recipient:

```
Candidate
```

---

# 9.3 Application Accepted Email

Trigger:

```
UNDER_REVIEW

↓

ACCEPTED
```

Recipients:

* Candidate.
* HR Manager.

Content:

* Acceptance confirmation.
* Internship information.
* Next procedures.

---

# 9.4 Application Rejected Email

Trigger:

```
UNDER_REVIEW

↓

REJECTED
```

Recipient:

```
Candidate
```

Content:

* Rejection notification.
* Optional reason.

---

# 10. Workflow Emails

Workflow actions generate emails.

---

## 10.1 Approval Required Email

Trigger:

```
New Workflow Action
```

Recipient:

```
Responsible Employee
```

Content:

* Action required.
* Related document/process.
* Deadline.

---

## 10.2 Workflow Completed Email

Trigger:

```
Workflow Status:

RUNNING

↓

COMPLETED
```

Recipients:

* Related users.

---

# 11. Internship Companion Emails

---

# 11.1 Journal Validation Email

Trigger:

Supervisor validates journal.

Recipients:

```
Intern
```

Content:

* Validation result.
* Supervisor feedback.

---

# 11.2 Deliverable Validation Email

Trigger:

Deliverable status change.

Possible states:

```
VALIDATED

REJECTED
```

Recipients:

```
Intern
```

---

# 11.3 Evaluation Notification Email

Trigger:

New evaluation available.

Recipients:

```
Intern
```

---

# 12. Financial Emails

---

# 12.1 Payment Validation Email

Trigger:

```
Payment

VALIDATED
```

Recipient:

```
Intern
```

---

# 12.2 Payment Completed Email

Trigger:

```
Payment

PAID
```

Content:

* Amount.
* Date.
* Payment reference.

---

# 13. Administrative Emails

Examples:

## System Maintenance

Recipients:

* Administrators.

Content:

* Maintenance information.
* Scheduled downtime.

---

## Security Alert

Examples:

* Multiple failed logins.
* Suspicious activity.

Recipients:

* Administrators.

---

# 14. Email Templates Structure

Recommended structure:

```
resources/

 └── templates/

      └── email/

           ├── authentication/

           │    ├── welcome.html

           │    └── password-reset.html

           ├── internship/

           │    ├── accepted.html

           │    └── rejected.html

           ├── workflow/

           │    └── approval-required.html

           └── payment/

                └── payment-confirmed.html
```

---

# 15. Template Variables

Example:

Template:

```html
Hello {{name}}

Your application {{reference}} was accepted.
```

Variables:

```
name

reference

date

status

link
```

---

# 16. Email Database Model

Recommended entity:

```
EmailLog
```

Attributes:

```
id

recipient

subject

template

status

sentAt

errorMessage
```

---

# 17. Email Status

Possible statuses:

```
PENDING

SENT

FAILED

RETRYING
```

---

# 18. Email Retry Mechanism

When sending fails:

Process:

```
Send Email

        |

Failure

        |

Retry

        |

Success

OR

Mark Failed
```

Recommended:

```
Maximum retries: 3
```

---

# 19. Email Queue Management

Emails should be queued before sending.

Example:

```
EmailRequest

        |

Database Queue

        |

Background Job

        |

SMTP
```

Benefits:

* Reliability.
* Monitoring.
* Retry support.

---

# 20. Security Rules

The email system must:

* Avoid sending passwords.
* Protect personal information.
* Validate recipient addresses.
* Prevent email injection attacks.
* Store logs securely.

---

# 21. Email Configuration

Configuration example:

```properties
spring.mail.host=smtp.server.com
spring.mail.port=587
spring.mail.username=email_account
spring.mail.password=password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

Sensitive values must be stored using:

* Environment variables.
* Secure configuration management.

---

# 22. Error Handling

Possible errors:

```
EmailSendException

InvalidRecipientException

SMTPConnectionException

TemplateNotFoundException
```

---

# 23. Logging

Log:

* Email type.
* Recipient.
* Sending status.
* Error details.

Do not log:

* Passwords.
* Authentication tokens.
* Sensitive documents.

---

# 24. Testing Strategy

## Unit Tests

Test:

* Template rendering.
* Email generation.
* Validation rules.

---

## Integration Tests

Test:

* SMTP connection.
* Email delivery.
* Retry mechanism.

---

# 25. Future Improvements

Possible extensions:

* SMS notifications.
* WhatsApp notifications.
* Internal STEG messaging.
* Email analytics.
* Advanced notification preferences.

---

# 26. Conclusion

The email system provides reliable and automated communication between the STEG Internship Management Platform and its users.

By using centralized services, templates, asynchronous processing, and proper logging, the platform ensures efficient communication while remaining simple, secure, and maintainable.