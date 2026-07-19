# OWASP Security Guidelines

## 1. Overview

The platform follows the security recommendations defined by the **OWASP (Open Worldwide Application Security Project)** to protect application users, business data, administrative processes, and communication between the different system components.

The objective is to prevent common web and mobile application vulnerabilities and ensure that the platform respects enterprise-level security standards.

The security strategy applies to:

- Next.js Front Office
- Angular Back Office
- Flutter Mobile Application
- Spring Boot Backend API
- PostgreSQL Database
- File storage system
- Authentication and authorization mechanisms


---

# 2. OWASP Top 10 Compliance

The platform considers the OWASP Top 10 vulnerabilities as the minimum security baseline.


# A01 - Broken Access Control

## Risk

Unauthorized users may access resources or perform actions beyond their permissions.

Examples:

- Student accessing another student's internship data.
- Regular employee accessing financial information.
- Candidate modifying administrative information.


## Security Measures

The platform implements:

- Role-Based Access Control (RBAC).
- Permission-based authorization.
- Backend authorization verification.
- Resource ownership validation.
- API endpoint protection.
- Separation between public and internal applications.


Example:

A candidate can:


GET /api/applications/{id}


only if:


application.ownerId == authenticatedUser.id



The backend must never rely only on frontend restrictions.


---

# A02 - Cryptographic Failures

## Risk

Sensitive information may be exposed due to weak encryption mechanisms.


## Security Measures

The platform ensures:

- HTTPS communication.
- Secure password hashing.
- JWT signature protection.
- Encrypted sensitive data when required.
- Secure storage of authentication tokens.


Password storage:


Password
|
v
BCrypt Hashing
|
v
Database



Sensitive information must never be stored in plaintext.


---

# A03 - Injection

## Risk

Attackers may execute unauthorized commands through malicious inputs.


Examples:

- SQL Injection.
- Command Injection.
- LDAP Injection.


## Security Measures

The backend applies:

- Prepared statements.
- ORM protection using Spring Data JPA.
- Input validation.
- Parameterized queries.
- Sanitization mechanisms.


Example:

Unsafe:

```sql
SELECT * FROM users WHERE email='input'
```

Secure:

```java
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);
```

# A04 - Insecure Design

## Risk

Security weaknesses caused by poor architecture or missing security requirements.

Security Measures

Security is integrated from the design phase:

Secure architecture.
Domain-driven design approach.
Clear responsibility separation.
Threat analysis.
Security requirements documentation.
Workflow authorization control.

Security is considered a functional requirement, not an additional feature.


---

# A05 - Security Misconfiguration

## Risk

Incorrect configuration may expose sensitive system information.

Security Measures

The platform applies:

Disabled debug mode in production.
Protected environment variables.
Secure server configuration.
Restricted API documentation access.
Updated dependencies.
Minimal exposed services.

Example:

Production:

spring.profiles.active=production

Development:

spring.profiles.active=development


---

# A06 - Vulnerable and Outdated Components

## Risk

Using outdated libraries may introduce known vulnerabilities.


## Security Measures

The project applies:

Dependency monitoring.
Regular updates.
Security patches.
Version control.
Vulnerability scanning.

Technologies monitored:

Spring Boot dependencies.
Angular packages.
Next.js packages.
Flutter packages.
PostgreSQL.


---

# A07 - Identification and Authentication Failures

## Risk

Weak authentication mechanisms may allow account compromise.


## Security Measures

The platform implements:

JWT authentication.
Refresh token mechanism.
Password security policy.
Account status management.
Session tracking.
Token revocation.

Authentication flow:

User
 |
Login
 |
Credentials Verification
 |
JWT Access Token
 |
Refresh Token Storage
 |
Authenticated Requests


---

# A08 - Software and Data Integrity Failures

## Risk

Unauthorized modification of software components or data.


## Security Measures

The platform uses:

Git version control.
Protected branches.
Code review process.
Database migration management.
File integrity verification.

Uploaded documents include:

checksum
mimeType
size
version

to verify integrity.


---

# A09 - Security Logging and Monitoring Failures

## Risk

Security incidents may not be detected without proper monitoring.


## Security Measures

The platform implements:

Audit logs.
User activity tracking.
Authentication logs.
Workflow action history.
Administrative operation history.

Tracked events:

LOGIN
LOGOUT
CREATE
UPDATE
DELETE
VALIDATION
APPROVAL
DOCUMENT_ACCESS

Each log contains:

User
Action
Entity
Timestamp
IP Address
Old Value
New Value


---

# A10 - Server-Side Request Forgery (SSRF)

## Risk

Attackers may force the backend to access unauthorized resources.

## Security Measures

The platform applies:

URL validation.
External request restrictions.
Allowed domain lists.
Network security rules.

External integrations must be explicitly authorized.

---

## 3. API Security Rules

All backend APIs must respect:

### Authentication

Protected endpoints require:

Authorization: Bearer <JWT_TOKEN>
Authorization

Each request verifies:

User Identity
+
Role
+
Permission
+
Resource Ownership
Validation

All incoming data must be validated:

Examples:

DTO validation.
File validation.
Size limitation.
Format verification.


---

# 4. File Upload Security

The platform manages several documents:

CV.
Internship conventions.
Certificates.
Deliverables.
Reports.

Security controls:

Allowed extensions only.
MIME type verification.
Maximum file size.
Malware scanning possibility.
Secure storage.
No direct filesystem exposure.

Example allowed formats:

PDF
DOCX
PNG
JPG

---

# 5. Database Security

Database protection includes:

Strong credentials.
Restricted access.
Role separation.
Backup strategy.
Migration control.
Query protection.

Database users:

Application User
Read Only User
Administrator User

---

# 6. Mobile Application Security

Flutter application security includes:

Secure token storage.
HTTPS communication.
Session expiration.
Certificate validation.
Minimal local data storage.

Sensitive information must not be stored permanently on the device.


---

# 7. Frontend Security

## Next.js

Protection against:

XSS.
CSRF.
Unsafe rendering.
Sensitive data exposure.
Angular

Protection against:

Template injection.
Unsafe HTML rendering.
Unauthorized routes.

Frontend applications must never contain:

Database credentials.
Secret keys.
Private API credentials.


---

# 8. Security Development Practices

Developers must follow:

## Secure Coding

Validate every input.
Avoid hardcoded secrets.
Handle exceptions safely.
Follow clean architecture principles.
Code Review

Before merging:

Security review.
Functional review.
Dependency verification.
Environment Management

Different configurations:

development
testing
production


---

# 9. Security Testing

Security validation includes:

## Authentication Tests

Invalid credentials.
Expired tokens.
Revoked tokens.
Authorization Tests
Unauthorized access attempts.
Role escalation attempts.
Input Tests
SQL injection.
XSS payloads.
Invalid files.
API Tests
Missing authentication.
Invalid permissions.
Unexpected inputs.


---

# 10. Future Security Improvements

Possible future enhancements:

Multi-factor authentication.
Biometric authentication.
Single Sign-On (SSO).
Advanced threat detection.
AI-based anomaly detection.
Security Information and Event Management (SIEM).


---

## 11. Security Principles Summary

The platform follows these principles:

| Principle | Implementation |
|-----------|----------------|
| Least Privilege | RBAC permissions |
| Defense in Depth | Multiple security layers |
| Secure by Design | Security from architecture phase |
| Data Protection | Encryption and access control |
| Traceability | Audit logs |
| Continuous Improvement | Updates and monitoring |


---

## Conclusion

The platform adopts OWASP security principles to provide a secure, reliable, and enterprise-ready solution.

Security is integrated across all layers:

Frontend applications.
Mobile application.
Backend services.
Database.
Infrastructure.

This approach ensures protection of user identities, administrative workflows, internship data, and confidential STEG information.