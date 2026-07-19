# Frontend Architecture

## 1. Purpose

This document defines the frontend architecture of the **STEG Intelligent Internship Management Platform**.

The platform contains two web applications with different objectives:

```

Next.js Front Office

*

Angular Back Office

```

Both applications communicate with the same Spring Boot backend through secure REST APIs.

The objectives of the frontend architecture are:

- Provide modern user interfaces.
- Ensure good user experience.
- Separate public and internal applications.
- Maintain scalable frontend codebases.
- Facilitate future evolution.

---

# 2. Frontend Architecture Overview

The frontend ecosystem is composed of:

```

```
                     Users

                       |

    --------------------------------------

    |                                    |
```

Next.js Front Office                Angular Back Office

```
    |                                    |

    --------------------------------------

                       |

              Spring Boot REST API
```

```

---

# 3. Frontend Applications

## 3.1 Next.js Front Office

Technology:

```

Next.js
React
TypeScript

```

Purpose:

Public portal for students and candidates.

Main users:

- Candidate.
- Student.

---

Responsibilities:

- Display internship information.
- Create candidate accounts.
- Submit internship applications.
- Upload required documents.
- Track application status.
- Access available documents.
- Receive notifications.

---

## 3.2 Angular Back Office

Technology:

```

Angular
TypeScript

```

Purpose:

Internal administrative platform for STEG employees.

Main users:

- HR Manager.
- Supervisor.
- Finance Manager.
- Director.
- Administrator.

---

Responsibilities:

- Manage candidates.
- Manage internships.
- Process workflows.
- Validate requests.
- Manage users and permissions.
- Generate reports.
- Access dashboards.

---

# 4. Frontend Architectural Style

Both applications follow:

```

Component-Based Architecture

*

Feature-Based Organization

*

Reactive Programming

*

Clean Frontend Principles

```

---

# 5. Next.js Front Office Architecture

## 5.1 Application Structure

Recommended structure:

```

src

├── app

├── components

├── features

│   ├── auth

│   ├── applications

│   ├── documents

│   └── profile

├── services

├── hooks

├── utils

├── types

└── styles

```

---

# 6. Angular Back Office Architecture

## 6.1 Application Structure

Recommended structure:

```

src

├── app

│
├── core

│   ├── auth

│   ├── guards

│   ├── interceptors

│   └── services

│
├── shared

│   ├── components

│   ├── directives

│   └── pipes

│
├── features

│   ├── users

│   ├── internships

│   ├── workflows

│   ├── documents

│   ├── payments

│   └── reports

│
└── layouts

```

---

# 7. Frontend Layers

The frontend follows a layered organization.

```

Presentation Layer

```
    |
```

Application Layer

```
    |
```

Data Access Layer

```
    |
```

Backend API

```

---

# 8. Presentation Layer

Contains:

- Pages.
- Components.
- Forms.
- Tables.
- Dashboards.

Responsibilities:

- Display information.
- Capture user actions.
- Manage UI states.

---

# 9. Component Architecture

Components are divided into:

## Shared Components

Reusable across modules.

Examples:

```

Button

Modal

Table

Form Field

Loading Spinner

Notification Component

```

---

## Feature Components

Specific to business modules.

Examples:

```

InternshipCard

ApplicationForm

WorkflowStepper

EvaluationForm

```

---

# 10. State Management

The frontend manages:

- Authentication state.
- User profile.
- Application status.
- Internship information.
- UI states.

Possible solutions:

## Angular

```

RxJS

Services

Signals

```

---

## Next.js

```

React Hooks

Context API

Server Components

State Libraries if required

```

---

# 11. API Communication

Frontend communicates with backend through REST APIs.

Communication format:

```

HTTPS

*

JSON

```

Example:

```

Frontend

GET /api/v1/internships

```
    |
```

Spring Boot

```
    |
```

JSON Response

```

---

# 12. HTTP Interceptors

## Angular

Interceptors handle:

- JWT attachment.
- Token refresh.
- Global errors.
- Loading states.

Example:

```

Request

```
    |
```

Add Authorization Header

```
    |
```

Send Request

```

---

# 13. Authentication Flow

Frontend authentication:

```

User Login

```
    |
```

Send Credentials

```
    |
```

Backend Generates JWT

```
    |
```

Store Token Securely

```
    |
```

Access Protected Pages

```

---

# 14. Route Protection

Protected routes require authentication.

Examples:

```

/dashboard

/internships

/documents

/settings

```

Unauthorized users are redirected.

---

# 15. Authorization Handling

Frontend supports RBAC visibility.

Example:

Administrator:

```

Users Management

*

System Settings

```

Supervisor:

```

Intern Monitoring

*

Evaluations

```

Finance Manager:

```

Payments

```

---

# 16. Forms Architecture

Forms must include:

- Validation.
- Error messages.
- Loading states.
- Submission handling.

Example:

Internship application:

```

Personal Information

*

University Information

*

Documents Upload

*

Submit

```

---

# 17. File Upload Architecture

Frontend handles:

- File selection.
- Validation.
- Upload progress.
- Error handling.

Flow:

```

Select File

```
    |
```

Validate Format

```
    |
```

Upload To Backend

```
    |
```

Display Result

```

---

# 18. Dashboard Architecture

Dashboards are composed of:

```

Cards

Charts

Tables

Statistics

Filters

```

Examples:

HR Dashboard:

- Number of interns.
- Pending applications.
- Active internships.

Supervisor Dashboard:

- Assigned interns.
- Pending validations.

---

# 19. Responsive Design

The frontend must support:

```

Desktop

Tablet

Mobile

```

Techniques:

- Responsive layouts.
- Flexible grids.
- Adaptive components.

---

# 20. UI Design Principles

The frontend follows:

## Consistency

Same components and behaviors.

---

## Simplicity

Reduce unnecessary actions.

---

## Accessibility

Interfaces must be usable by different users.

---

## Feedback

Users should always understand:

- Current action.
- Success state.
- Error state.

---

# 21. Error Handling

Frontend handles:

## Validation Errors

Example:

```

Email format invalid

```

---

## Backend Errors

Example:

```

Internship not found

```

---

## Network Errors

Example:

```

Connection unavailable

```

---

# 22. Loading Management

Long operations display:

- Loading indicators.
- Progress bars.
- Disabled actions.

Examples:

- Uploading documents.
- Generating PDF.
- Loading dashboards.

---

# 23. Security Considerations

Frontend security includes:

- Secure token handling.
- Avoid storing sensitive information.
- Input validation.
- Protected routes.
- HTTPS communication.

---

# 24. Testing Strategy

## Unit Tests

Test:

- Components.
- Services.
- Validators.

---

## Integration Tests

Test:

- API communication.
- Authentication.
- Workflows.

---

## End-to-End Tests

Test:

Example:

```

Candidate submits internship application

```
    |
```

HR validates application

```
    |
```

Internship created

```

---

# 25. Performance Optimization

Techniques:

- Lazy loading.
- Code splitting.
- Image optimization.
- API caching.
- Pagination.
- Virtual scrolling.

---

# 26. Deployment Architecture

Example:

```

```
                Internet

                   |

             Reverse Proxy

                   |

    ------------------------------

    |                            |
```

Next.js Application        Angular Application

```
                   |

          Spring Boot API
```

```

---

# 27. Future Improvements

Possible extensions:

- Progressive Web Application.
- Advanced dashboards.
- Real-time updates.
- WebSocket integration.
- AI-assisted interfaces.

---

# 28. Conclusion

The frontend architecture provides a scalable foundation for the STEG Internship Management Platform.

By separating the public Next.js portal from the internal Angular administration system, the platform delivers specialized experiences for each user category while maintaining consistency through a shared backend API.