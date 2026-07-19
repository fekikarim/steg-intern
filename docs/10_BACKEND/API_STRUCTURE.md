# Backend API Structure

## 1. Purpose

This document defines the REST API structure of the STEG Internship Management Platform backend.

The backend provides a centralized and secure API layer consumed by:

- Next.js Front Office
- Angular Back Office
- Flutter Mobile Application

The API is responsible for:

- Authentication
- Authorization
- Business operations
- Data management
- Workflow execution
- Document management
- Notifications
- Reporting

---

# 2. Backend Architecture Overview

The backend follows a layered architecture based on Spring Boot 3.

```

Client Applications

```
    |
    |
```

REST API Layer
(Controllers)

```
    |
    |
```

Application Layer
(Services)

```
    |
    |
```

Domain Layer
(Business Rules)

```
    |
    |
```

Persistence Layer
(Repositories)

```
    |
    |
```

PostgreSQL Database

```

---

# 3. API Principles

The API follows:

- REST architecture.
- JSON communication.
- HTTP standard methods.
- Stateless authentication.
- Versioned endpoints.
- Consistent error responses.

---

# 4. Base URL Structure

Development:

```

[http://localhost:8080/api/v1](http://localhost:8080/api/v1)

```

Production:

```

[https://domain.com/api/v1](https://domain.com/api/v1)

```

All endpoints must start with:

```

/api/v1

```

---

# 5. HTTP Methods

The API uses standard HTTP methods.

| Method | Usage |
|---|---|
| GET | Retrieve resources |
| POST | Create resources |
| PUT | Update complete resource |
| PATCH | Partial update |
| DELETE | Remove resource |

---

# 6. API Versioning

The API uses URL versioning.

Example:

```

/api/v1/internships

```

Future versions:

```

/api/v2/internships

```

Benefits:

- Backward compatibility.
- Easier evolution.
- Controlled migrations.

---

# 7. Authentication API

## Login

```

POST /auth/login

````

Purpose:

Authenticate users.

Request:

```json
{
  "email": "user@example.com",
  "password": "password"
}
````

Response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900
}
```

---

## Refresh Token

```
POST /auth/refresh
```

Purpose:

Generate a new access token.

---

## Logout

```
POST /auth/logout
```

Purpose:

Invalidate session and refresh token.

---

# 8. User Management API

Base:

```
/users
```

Endpoints:

```
GET    /users
GET    /users/{id}
POST   /users
PUT    /users/{id}
DELETE /users/{id}
```

Used by:

* Administrator
* HR Manager

---

# 9. Role and Permission API

Base:

```
/roles
```

Endpoints:

```
GET /roles

POST /roles

PUT /roles/{id}

DELETE /roles/{id}
```

Permissions:

```
GET /permissions
```

---

# 10. Candidate API

Base:

```
/candidates
```

Operations:

```
GET    /candidates
GET    /candidates/{id}

POST   /candidates

PUT    /candidates/{id}

DELETE /candidates/{id}
```

Used for:

* Student applications.
* HR management.

---

# 11. Internship Application API

Base:

```
/applications
```

Endpoints:

```
GET /applications

GET /applications/{id}

POST /applications

PUT /applications/{id}

PATCH /applications/{id}/status
```

Status transitions:

```
DRAFT

↓

SUBMITTED

↓

UNDER_REVIEW

↓

ACCEPTED / REJECTED
```

---

# 12. Internship API

Base:

```
/internships
```

Endpoints:

```
GET /internships

GET /internships/{id}

POST /internships

PUT /internships/{id}

PATCH /internships/{id}/status
```

---

# 13. Assignment API

Base:

```
/assignments
```

Operations:

```
POST /assignments

GET /assignments

PUT /assignments/{id}

PATCH /assignments/{id}/status
```

Responsible for:

* Department assignment.
* Supervisor assignment.

---

# 14. Workflow API

Base:

```
/workflows
```

Endpoints:

```
GET /workflows

POST /workflows

GET /workflows/{id}

POST /workflows/{id}/actions
```

Used for:

* Validation processes.
* Approval processes.
* Administrative workflows.

---

# 15. Journal API

Base:

```
/journals
```

Endpoints:

```
GET /journals

GET /journals/{id}

POST /journals

PUT /journals/{id}

PATCH /journals/{id}/submit
```

---

# 16. Task API

Base:

```
/tasks
```

Endpoints:

```
GET /tasks

POST /tasks

PUT /tasks/{id}

PATCH /tasks/{id}/status
```

---

# 17. Deliverable API

Base:

```
/deliverables
```

Endpoints:

```
POST /deliverables

GET /deliverables

PATCH /deliverables/{id}/validate

PATCH /deliverables/{id}/reject
```

---

# 18. Document API

Base:

```
/documents
```

Operations:

```
GET /documents

POST /documents/upload

GET /documents/{id}/download

DELETE /documents/{id}
```

---

# 19. Notification API

Base:

```
/notifications
```

Endpoints:

```
GET /notifications

PATCH /notifications/{id}/read

POST /notifications/send
```

---

# 20. Payment API

Base:

```
/payments
```

Endpoints:

```
GET /payments

POST /payments

PATCH /payments/{id}/validate

PATCH /payments/{id}/pay
```

---

# 21. Evaluation API

Base:

```
/evaluations
```

Endpoints:

```
GET /evaluations

POST /evaluations

PUT /evaluations/{id}
```

---

# 22. Dashboard API

Base:

```
/dashboard
```

Examples:

```
GET /dashboard/hr

GET /dashboard/supervisor

GET /dashboard/director

GET /dashboard/intern
```

Returns:

* KPIs.
* Statistics.
* Pending actions.
* Recent activities.

---

# 23. Reporting API

Base:

```
/reports
```

Examples:

```
GET /reports/internships

GET /reports/payments

GET /reports/statistics
```

---

# 24. File Upload API

Endpoint:

```
POST /files/upload
```

Supported:

* PDF
* Images
* Office documents

Validation:

* File size.
* MIME type.
* Virus scanning (future).

---

# 25. Error Response Format

All errors follow a unified format.

Example:

```json
{
  "timestamp": "2026-07-01T10:30:00",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Invalid email format",
  "path": "/api/v1/users"
}
```

---

# 26. HTTP Status Codes

| Code | Meaning        |
| ---- | -------------- |
| 200  | Success        |
| 201  | Created        |
| 204  | No Content     |
| 400  | Bad Request    |
| 401  | Unauthorized   |
| 403  | Forbidden      |
| 404  | Not Found      |
| 409  | Conflict       |
| 500  | Internal Error |

---

# 27. Security Rules

Every protected endpoint requires:

```
Authorization: Bearer JWT_TOKEN
```

Example:

```
GET /api/v1/internships

Authorization:
Bearer eyJhbGciOiJIUzI1...
```

---

# 28. Pagination

Large datasets must support pagination.

Example:

```
GET /applications?page=0&size=20
```

Response:

```json
{
  "content": [],
  "page":0,
  "size":20,
  "totalElements":150
}
```

---

# 29. Filtering and Searching

Supported resources:

* Candidates
* Internships
* Applications
* Payments

Example:

```
GET /internships?status=ACTIVE
```

---

# 30. API Documentation

The API must be documented using:

```
Swagger / OpenAPI
```

Available endpoint:

```
/swagger-ui.html
```

Documentation includes:

* Endpoints.
* Parameters.
* Request examples.
* Response examples.
* Authentication.

---

# 31. API Testing

API testing must include:

* Unit tests.
* Integration tests.
* Security tests.
* Contract tests.

Tools:

* Postman
* Swagger UI
* JUnit
* MockMvc

---

# 32. Future Improvements

Possible future extensions:

* GraphQL gateway.
* WebSocket real-time communication.
* External STEG system integration.
* AI assistant API.
* Advanced reporting API.

---

# 33. Conclusion

The API layer is the central communication point of the STEG Internship Management Platform.

A structured, versioned, secure, and documented API ensures that all applications remain synchronized while allowing future evolution of the platform.