# Password Policy

> **Document Version:** 1.0  
> **Project:** Intelligent Internship Management & Administrative Workflow Platform - STEG  
> **Module:** Security  
> **Document:** Password Policy

---

# 1. Purpose

This document defines the password policy adopted by the STEG Internship Management Platform.

The objective is to ensure that user credentials remain resistant against common attacks such as:

- Brute Force
- Dictionary Attacks
- Credential Stuffing
- Password Guessing
- Password Reuse
- Unauthorized Account Access

The platform follows modern security recommendations inspired by OWASP, NIST, and industry best practices.

---

# 2. Scope

This policy applies to every authenticated user of the platform, including:

- Candidate
- Intern
- Supervisor
- HR Manager
- Finance Manager
- Director
- Administrator

---

# 3. Password Requirements

Every password must satisfy the following requirements.

| Requirement | Value |
|-------------|-------|
| Minimum Length | 12 characters |
| Maximum Length | 128 characters |
| Leading/Trailing Spaces | Not allowed |
| Unicode Characters | Supported |
| Case Sensitive | Yes |

---

# 4. Complexity Rules

Passwords must contain at least:

- One uppercase letter
- One lowercase letter
- One numeric digit
- One special character

Allowed special characters include:

```
! @ # $ % ^ & * ( ) _ + - = ? . , : ; [ ] { }
```

Example of a valid password:

```
St3g@Intern2026!
```

---

# 5. Password Strength

Passwords should be difficult to guess and should avoid predictable patterns.

Strong passwords are encouraged through:

- Long passphrases
- Random word combinations
- High entropy

Examples:

✅ Good

```
BlueTrain#River92!
```

```
Coffee&Clouds2026
```

```
Spring!River$Mountain4
```

❌ Weak

```
password123
```

```
123456789
```

```
azerty123
```

```
steg2026
```

```
karim123
```

---

# 6. Prohibited Passwords

The system rejects passwords that:

- Are found in common password dictionaries.
- Match the user's email address.
- Match the user's first or last name.
- Match the national ID.
- Match employee numbers.
- Match common keyboard sequences.
- Match obvious organization names.

Examples:

```
password
```

```
admin
```

```
steg
```

```
azerty
```

```
12345678
```

```
welcome
```

---

# 7. Password Hashing

Passwords are **never stored in plain text**.

Instead, the backend stores only a secure password hash.

Implementation:

```
Password

↓

BCrypt

↓

Hashed Password

↓

Database
```

Recommended algorithm:

- BCrypt

Recommended cost factor:

```
12
```

Plain-text passwords are never written to:

- Database
- Logs
- Audit Logs
- Error Messages
- Network Responses

---

# 8. Password Storage

The database stores only:

```
password_hash
```

Example:

```
$2a$12$F38dlQ9bM9...
```

Original passwords cannot be recovered from their hashes.

---

# 9. Password Transmission

Passwords are transmitted only over encrypted HTTPS connections.

```
Client

↓

HTTPS

↓

Spring Boot API
```

HTTP connections are never accepted for authentication.

---

# 10. Password Creation

When creating a password, the backend validates:

- Minimum length
- Maximum length
- Complexity requirements
- Password blacklist
- User-specific values
- Allowed character encoding

Only valid passwords are accepted.

---

# 11. Password Change

Users may change their password after authentication.

Required information:

- Current password
- New password
- Password confirmation

The current password must be verified before the new password is accepted.

---

# 12. Password Reset

Forgotten passwords are reset through a secure workflow.

```
Forgot Password

↓

Verification Email

↓

Secure Reset Link

↓

New Password

↓

Old Sessions Revoked
```

The platform never sends passwords by email.

---

# 13. Password Reuse

To improve security, recently used passwords should not be reused.

Recommended policy:

- Prevent reuse of the last **5** passwords.

This requires storing hashes of previous passwords.

---

# 14. Failed Login Attempts

To reduce brute-force attacks, repeated failed authentication attempts are monitored.

Recommended configuration:

| Failed Attempts | Action |
|-----------------|--------|
| 5 | Temporary account lock |
| 10 | Administrator review |

Locked accounts require either:

- Automatic unlock after a configured duration.
- Manual unlock by an administrator.

---

# 15. Account Lockout

If excessive failed login attempts are detected:

```
Failed Logins

↓

Threshold Reached

↓

Account Locked

↓

User Notification

↓

Unlock Procedure
```

All lockout events are recorded in the Audit Log.

---

# 16. Password Expiration

The platform does **not** enforce periodic password expiration by default.

Instead:

- Users are encouraged to choose strong passwords.
- Password changes are required after suspected compromise.
- Administrators may force password resets when necessary.

This approach aligns with modern NIST recommendations.

---

# 17. Administrator Passwords

Administrator accounts require stronger protection.

Additional recommendations include:

- Minimum length of 16 characters.
- Multi-Factor Authentication (future enhancement).
- Immediate session revocation after password changes.
- More restrictive lockout policies.

---

# 18. Session Revocation

Whenever a password changes:

- All active Refresh Tokens are revoked.
- All active sessions are invalidated.
- New authentication is required on every device.

This prevents unauthorized access using previously issued tokens.

---

# 19. Password Validation Workflow

```
User Enters Password
         │
         ▼
Length Check
         │
         ▼
Complexity Check
         │
         ▼
Blacklist Check
         │
         ▼
User Data Check
         │
         ▼
Password Accepted
```

---

# 20. Security Best Practices

The platform follows these password security practices:

- Store only hashed passwords.
- Use BCrypt with an appropriate work factor.
- Never log passwords.
- Never transmit passwords without HTTPS.
- Reject weak passwords.
- Reject common passwords.
- Prevent password reuse.
- Revoke active sessions after password changes.
- Monitor failed authentication attempts.
- Lock accounts after repeated failures.

---

# 21. Future Improvements

Future versions of the platform may include:

- Multi-Factor Authentication (MFA)
- Password strength meter
- Integration with compromised password databases (e.g., Have I Been Pwned)
- Passwordless authentication
- Biometric authentication for mobile devices
- Adaptive authentication based on risk
- Hardware security key (FIDO2/WebAuthn) support

---

# 22. Summary

The STEG Internship Management Platform enforces a modern password policy designed to protect user accounts against common authentication attacks. Passwords are validated according to strict complexity requirements, securely hashed using BCrypt, transmitted exclusively over HTTPS, and never stored or logged in plain text. Combined with account lockout mechanisms, secure reset procedures, session revocation, and JWT-based authentication, this policy provides a robust foundation for protecting user identities and maintaining the overall security of the platform.