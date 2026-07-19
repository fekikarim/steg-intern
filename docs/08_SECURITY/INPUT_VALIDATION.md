# Input Validation Security Policy

## 1. Overview

Input validation is a fundamental security mechanism implemented across the entire platform to ensure that all data received from users, external systems, and client applications is verified, sanitized, and processed securely.

The platform follows the principle:

> Never trust user input.

All incoming data must be considered potentially malicious until validated by the backend.

Input validation applies to:

- Next.js Front Office.
- Angular Back Office.
- Flutter Mobile Application.
- Spring Boot REST API.
- File upload system.
- Database persistence layer.


---

# 2. Validation Strategy

The platform applies a multi-layer validation approach:


Client Validation
|
v
API Validation
|
v
Business Validation
|
v
Database Constraints


Each layer has a specific responsibility.


## 2.1 Client-Side Validation

Purpose:

- Improve user experience.
- Prevent unnecessary requests.
- Provide immediate feedback.


Examples:

- Required fields.
- Input formats.
- Maximum length.
- Date selection rules.


However:

Client-side validation is never considered a security mechanism.

All validations must be repeated on the backend.


---

# 3. Backend Validation Rules

The Spring Boot backend is the main security validation layer.


## 3.1 DTO Validation

All incoming API requests must use validated DTO objects.


Example:

```java
public class CandidateRegistrationRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @Email
    private String email;

    @Size(min = 8)
    private String password;
}
```

The system uses:

Jakarta Bean Validation.
Custom validators when required.
Business rule validation.

---

# 4. Common Validation Rules

## 4.1 Required Fields

Mandatory information must never be empty.

Example:

Candidate application:

Required:

First Name
Last Name
Email
Phone
University
Speciality
CV

Invalid:

firstName = ""

## 4.2 String Validation

Rules:

Maximum length.
Minimum length.
Allowed characters.
Trim unnecessary spaces.
Prevent dangerous content.

Example:

Name:
Minimum: 2 characters
Maximum: 100 characters
Allowed:
Letters
Spaces
Hyphen

## 4.3 Email Validation

Email addresses must respect:

name@domain.extension

Rules:

Valid email format.
Maximum length verification.
Lowercase normalization.
Duplicate verification.

Example:

Valid:

karim.feki@example.com

Invalid:

karim@
test.com
4.4 Phone Number Validation

Phone numbers must respect Tunisian and international formats.

Examples:

Valid:

+216XXXXXXXX
XXXXXXXX

Rules:

Numeric characters only.
Country code support.
Length validation.
4.5 Password Validation

Password rules are defined in:

PASSWORD_POLICY.md

Minimum requirements:

Minimum length.
Uppercase character.
Lowercase character.
Number.
Special character.

---

# 5. Business Data Validation

Technical validation is not enough.

Business rules must also be verified.

Examples:

Internship Dates

Invalid:

startDate > endDate

Valid:

startDate < endDate
Internship Assignment

Rules:

Internship must exist.
Supervisor must be active.
Department must exist.
Assignment cannot overlap with another active assignment.
Workflow Validation

Before approval:

Application Status = UNDER_REVIEW

Allowed:

UNDER_REVIEW
        |
        v
ACCEPTED

Forbidden:

REJECTED
        |
        v
ACCEPTED

---

# 6. Enum Validation

All enumerated values must match predefined system values.

Examples:

ApplicationStatus:

Allowed:

DRAFT
SUBMITTED
UNDER_REVIEW
ACCEPTED
REJECTED

Rejected:

WAITING
PENDING_ADMIN

---

# 7. File Upload Validation

The platform manages sensitive documents:

CVs.
Internship conventions.
Certificates.
Deliverables.

All uploaded files must be validated.

## 7.1 File Type Validation

Allowed formats:

PDF
DOCX
PNG
JPG
JPEG

Forbidden:

.exe
.sh
.bat
.jar

## 7.2 File Size Validation

Maximum size limits:

Example:

CV:
Maximum 5 MB

Documents:
Maximum 10 MB

Images:
Maximum 5 MB

## 7.3 File Content Validation

The system verifies:

MIME type.
File extension.
File integrity.
Corrupted files.

The extension alone is never trusted.

---

# 8. SQL Injection Prevention

The platform prevents SQL injection attacks.

Forbidden:

String query =
"SELECT * FROM users WHERE email="
+ email;

Recommended:

User findByEmail(String email);

Using:

Spring Data JPA.
Hibernate ORM.
Parameterized queries.

---

# 9. Cross-Site Scripting (XSS) Prevention

User-generated content must be sanitized.

Affected fields:

Comments.
Journal entries.
Feedback.
Descriptions.

Protection:

HTML escaping.
Content sanitization.
Safe rendering.

Example:

Stored:

<script>alert('attack')</script>

Displayed as:

&lt;script&gt;alert('attack')&lt;/script&gt;

---

# 10. API Request Validation

Every API endpoint validates:

Authentication
Is the user authenticated?
Authorization
Does the user have permission?
Input
Is the received data valid?
Business Rules
Is the operation allowed?

---

# 11. Error Handling

Validation errors must not expose sensitive information.

Bad response:

```json
{
 "error":
 "Database table users_password failed"
}
```

Correct response:

```json
{
 "message":
 "Invalid request data",
 "errors":
 [
   "Email format is invalid"
 ]
}
```

---

# 12. Validation of Specific Domains

## Candidate Domain

Validation:

Identity information.
University information.
Contact information.
Uploaded documents.
Internship Domain

Validation:

Dates.
Status transitions.
Assignment rules.
Supervisor availability.
Payment Domain

Validation:

Amount must be positive.
Currency must be supported.
Payment status transitions must respect workflow rules.
Notification Domain

Validation:

Recipient existence.
Notification type.
Message length.
Priority level.

---

# 13. Database Constraints

Database constraints provide an additional protection layer.

Examples:

Unique:

User.email
Candidate.nationalId
Internship.reference

Not Null:

createdAt
status
reference

Foreign Keys:

Internship -> Candidate
Assignment -> Supervisor
Payment -> Internship

---

# 14. Validation Logging

Invalid security-related actions may be logged.

Examples:

INVALID_LOGIN_ATTEMPT

INVALID_FILE_UPLOAD

UNAUTHORIZED_INPUT

VALIDATION_FAILURE

Logs contain:

User ID
IP Address
Timestamp
Action
Endpoint

---

# 15. Testing Input Validation

Validation tests include:

Functional Tests
Valid data accepted.
Invalid data rejected.
Security Tests
SQL injection attempts.
XSS payloads.
Invalid files.
Oversized requests.
API Tests
Missing fields.
Invalid formats.
Unauthorized requests.

---

# 16. Future Improvements

Possible enhancements:

Advanced malware scanning.
AI-based document verification.
Automatic sensitive data detection.
Advanced fraud detection.
Machine learning anomaly analysis.

---

# Conclusion

Input validation is a critical security layer ensuring that only correct, authorized, and safe information enters the platform.

By combining frontend validation, backend validation, business rules, and database constraints, the platform prevents malicious input, protects sensitive STEG data, and maintains data integrity.