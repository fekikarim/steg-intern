# Error Handling Specification
## STEG Smart Internship & Administrative Workflow Platform

**Project:** Conception et Développement d'une Plateforme Intelligente de Gestion des Stagiaires et des Flux Administratifs de la STEG  
**Version:** 1.0  
**Status:** Technical Specification  
**Authors:** Karim Feki & Nesrine Derouiche  

---

# 1. Introduction

## 1.1 Purpose

This document defines the error handling strategy of the STEG Smart Internship & Administrative Workflow Platform.

The objective is to ensure that all system errors are:

- Clearly identified.
- Properly handled.
- Securely communicated.
- Logged for debugging and auditing.
- Understandable by end users.

The error handling mechanism must provide:

- A consistent behavior across all applications.
- A unified API error format.
- Secure information exposure.
- Efficient maintenance and troubleshooting.

---

# 2. Error Handling Principles

The platform follows these principles:

## 2.1 Consistency

All applications must follow the same error communication standards.

Affected components:

- Next.js Front Office.
- Angular Back Office.
- Flutter Mobile Application.
- Spring Boot Backend.

---

## 2.2 Security First

The system must never expose:

- Database errors.
- Internal server details.
- Stack traces.
- Sensitive information.

Example:

Incorrect response:


SQL Exception:
relation internship_application_table does not exist


Correct response:


{
"code": "INTERNAL_SERVER_ERROR",
"message": "An unexpected error occurred"
}


---

## 2.3 Traceability

Every technical error must be traceable through:

- Logs.
- Request identifier.
- Timestamp.
- User information when available.

---

## 2.4 User Friendly Messages

Users must receive understandable messages.

Example:

Technical error:


DuplicateKeyException


User message:


This email address is already registered.


---

# 3. Global Error Response Format

All backend errors must follow a unified structure.

## Standard Error Object

```json
{
  "timestamp": "2026-07-15T10:30:00",
  "status": 400,
  "code": "VALIDATION_ERROR",
  "message": "Invalid request data",
  "path": "/api/applications",
  "traceId": "a7f8d9c1",
  "errors": [
    {
      "field": "email",
      "message": "Email format is invalid"
    }
  ]
}

```

# 4. Error Categories

The platform defines the following categories:

Error Handling

├── Authentication Errors
│
├── Authorization Errors
│
├── Validation Errors
│
├── Business Rule Errors
│
├── Resource Errors
│
├── File Management Errors
│
├── Workflow Errors
│
├── Integration Errors
│
└── System Errors

---

# 5. Authentication Errors

Description

Errors related to user identity verification.

* 5.1 Invalid Credentials
Scenario

User enters incorrect login information.

Response

HTTP Status:

401 Unauthorized

Code:

INVALID_CREDENTIALS

Message:

Email or password incorrect.

* 5.2 Expired Token
Scenario

JWT access token is expired.

Response

HTTP Status:

401 Unauthorized

Code:

TOKEN_EXPIRED

Action:

Client requests refresh token.
If refresh fails, user must login again.

* 5.3 Invalid Refresh Token
Scenario

Refresh token is:

Expired.
Revoked.
Invalid.

Response:

401 Unauthorized

Code:

INVALID_REFRESH_TOKEN

# 6. Authorization Errors
Description

User authenticated but without required permissions.

Example

A candidate attempts accessing HR features.

Response:

403 Forbidden

Code:

ACCESS_DENIED

Message:

You do not have permission to perform this action.

# 7. Validation Errors
Description

Errors caused by invalid user input.

Examples
Missing Required Field

Request:

{
"name":""
}

Response:

400 Bad Request

Code:

REQUIRED_FIELD_MISSING
Invalid Format

Example:

Invalid email.

Response:

VALIDATION_ERROR
File Validation

Example:

Unsupported document format.

Response:

INVALID_FILE_FORMAT

# 8. Business Rule Errors

Description

Errors caused by violation of business constraints.

Examples

* 8.1 Duplicate Application

Scenario:

Candidate submits two active applications.

Response:

409 Conflict

Code:

DUPLICATE_APPLICATION

* 8.2 Invalid Internship Status Transition

Example:

Changing:

COMPLETED → ACTIVE

Response:

409 Conflict

Code:

INVALID_STATUS_TRANSITION

* 8.3 Invalid Assignment

Scenario:

Two supervisors assigned as active supervisors.

Response:

409 Conflict

Code:

ACTIVE_ASSIGNMENT_EXISTS

# 9. Resource Errors
Description

Errors related to missing or unavailable data.

* Resource Not Found

Example:

Internship ID does not exist.

Response:

404 Not Found

Code:

RESOURCE_NOT_FOUND

Message:

Internship not found.

# 10. Document Management Errors
Description

Errors related to file operations.

* 10.1 Upload Failed

Response:

500 Internal Server Error

Code:

FILE_UPLOAD_FAILED

* 10.2 File Too Large

Response:

413 Payload Too Large

Code:

FILE_SIZE_EXCEEDED

* 10.3 Corrupted File

Response:

400 Bad Request

Code:

INVALID_FILE_CONTENT

* 10.4 Storage Unavailable

Example:

Object storage unavailable.

Response:

503 Service Unavailable

Code:

STORAGE_SERVICE_UNAVAILABLE

# 11. Workflow Errors
Description

Errors related to approval and validation processes.

* Invalid Workflow Action

Example:

Trying to approve an already rejected workflow.

Response:

409 Conflict

Code:

INVALID_WORKFLOW_ACTION

* Unauthorized Approval

Example:

Candidate approves own internship.

Response:

403 Forbidden

Code:

WORKFLOW_PERMISSION_DENIED


# 12. Notification Errors

Description

Errors related to communication services.

* Notification Sending Failed

Response:

500 Internal Server Error

Code:

NOTIFICATION_FAILED

Behavior:

Error logged.

Notification retry possible.

Main business operation should not fail when possible.

# 13. Database Errors

Description

Errors generated by persistence layer.

Examples
Connection failure.
Constraint violation.
Transaction rollback.
Handling Strategy

The system must:

Rollback transaction.
Log technical details.
Return generic user message.

Example:

DATABASE_ERROR

Response:

500 Internal Server Error

# 14. Global Exception Management

Backend

Spring Boot implementation:

Recommended mechanisms:

Global Exception Handler.
Custom exceptions.
Validation exception handling.
Transaction exception handling.

Architecture:

Controller

    |

Service Layer

    |

Custom Exception

    |

GlobalExceptionHandler

    |

Standard Error Response

# 15. Custom Exception Hierarchy

Recommended structure:

BaseApplicationException
│
├── AuthenticationException
├── AuthorizationException
├── ValidationException
├── BusinessException
├── ResourceNotFoundException
├── FileException
├── WorkflowException
└── SystemException


# 16. Logging Strategy

Logged Information

Every error log should contain:

Timestamp.
Severity.
Request ID.
User ID if available.
Endpoint.
Exception type.
Technical message.
Log Levels
Level	Usage
INFO	Normal application events
WARN	Recoverable problems
ERROR	Application failures
DEBUG	Development information

# 17. Client Applications Behavior

## 17.1 Next.js

Must display:

Friendly messages.
Validation feedback.
Retry options.

## 17.2 Angular

Must provide:

Error notifications.
Permission messages.
Form validation.

## 17.3 Flutter

Must handle:

Network errors.
Token expiration.
Offline situations.

# 18. Network Error Handling

Possible Errors

Server unavailable.
Timeout.
Connection loss.

Client Behavior

Display:

Unable to connect to the server.
Please try again later.

Actions:

Retry request.
Keep user data locally when possible.

# 19. Error Monitoring Evolution

Future improvements:

Centralized logging system.
Performance monitoring.
Automatic alerting.
AI-assisted error analysis.

Possible tools:

ELK Stack.
Grafana.
Prometheus.

# 20. Summary

The error handling system guarantees:

Consistent error communication.
Secure information exposure.
Better debugging.
Improved user experience.
Easier maintenance.

All future modules integrated into the platform must respect this error handling strategy.

# End of Document