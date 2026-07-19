# AUTHENTICATION.md

# Authentication Architecture

**Project:** Intelligent Internship & Administrative Workflow Management Platform  
**Organization:** STEG (Société Tunisienne de l'Électricité et du Gaz)  
**Backend:** Spring Boot 3  
**Frontend:** Next.js + Angular + Flutter  
**Database:** PostgreSQL  
**Authentication:** JWT + Refresh Token  
**Version:** 1.0

---

# Purpose

Authentication is responsible for verifying the identity of every user accessing the platform.

The authentication system guarantees that:

- only authorized users can access the platform
- user identity is securely verified
- sessions remain stateless
- credentials are never exposed
- compromised tokens can be revoked
- every authentication event is traceable

This project follows a modern stateless authentication architecture using JSON Web Tokens (JWT) and Refresh Tokens.

---

# Authentication Architecture

```
                +----------------+
                |     Client     |
                |                |
                | Angular        |
                | Next.js        |
                | Flutter        |
                +--------+-------+
                         |
                         |
                   HTTPS Request
                         |
                         ▼
                +----------------------+
                | Spring Security      |
                | Authentication Filter|
                +----------+-----------+
                           |
                           ▼
                  AuthenticationManager
                           |
                           ▼
                  UserDetailsService
                           |
                           ▼
                     PostgreSQL
                           |
                           ▼
               User Successfully Authenticated
                           |
                           ▼
         Generate JWT + Refresh Token
                           |
                           ▼
                     Client Receives Tokens
```

---

# Authentication Flow

```
User

↓

Enter Email & Password

↓

HTTPS POST /api/v1/auth/login

↓

Spring Security Authentication Filter

↓

AuthenticationManager

↓

UserDetailsService

↓

Load User

↓

Verify Password (BCrypt)

↓

Success

↓

Generate JWT

↓

Generate Refresh Token

↓

Store Refresh Token

↓

Return Tokens

↓

Authenticated Session
```

---

# Supported Authentication Methods

Current implementation

- Email + Password

Future versions

- Microsoft SSO
- Google OAuth2
- LDAP
- SAML
- Two-Factor Authentication (2FA)
- Biometric Authentication (Mobile)
- Smart Card Authentication

---

# Authentication Components

The authentication module consists of the following components.

```
AuthenticationController

AuthenticationService

AuthenticationManager

UserDetailsService

JwtService

RefreshTokenService

PasswordEncoder

AuthenticationEntryPoint

JwtAuthenticationFilter

SecurityConfiguration
```

---

# Login Process

## Step 1

User submits credentials.

```
POST

/api/v1/auth/login
```

Request

```json
{
  "email": "user@steg.tn",
  "password": "********"
}
```

---

## Step 2

Spring Security intercepts the request.

Authentication filter validates

- request format
- credentials presence
- endpoint accessibility

---

## Step 3

UserDetailsService loads user.

Search

```
SELECT *

FROM users

WHERE email = ?
```

If user is not found

```
401 Unauthorized
```

---

## Step 4

Verify password.

```
BCryptPasswordEncoder
```

Passwords are never decrypted.

Hash comparison only.

---

## Step 5

Verify account state.

Checks

- account enabled
- account locked
- account expired
- credentials expired
- user status

Possible statuses

```
ACTIVE

INACTIVE

LOCKED
```

Inactive or locked accounts cannot authenticate.

---

## Step 6

Generate JWT.

Contains

- User ID
- Email
- Role
- Authorities
- Issue Time
- Expiration Time

---

## Step 7

Generate Refresh Token.

Refresh token is

- random
- long-lived
- stored in database
- linked to user
- revocable

---

## Step 8

Return authentication response.

Example

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 900
}
```

---

# Logout Process

```
POST

/api/v1/auth/logout
```

Operations

- revoke refresh token
- remove active session
- invalidate refresh token
- create audit log

JWT naturally expires after its lifetime.

---

# Authentication Endpoints

| Method | Endpoint | Description |
|----------|-----------|------------|
| POST | /api/v1/auth/login | User login |
| POST | /api/v1/auth/logout | Logout |
| POST | /api/v1/auth/refresh | Generate new JWT |
| GET | /api/v1/auth/me | Current authenticated user |
| PATCH | /api/v1/auth/change-password | Change password |

---

# Protected Resources

Every endpoint except authentication endpoints requires a valid JWT.

Example

```
/api/v1/auth/login

/api/v1/auth/refresh

/api/v1/public/**
```

are public.

Everything else requires authentication.

---

# Authentication Filter

The JwtAuthenticationFilter executes for every secured request.

Responsibilities

- read Authorization header
- extract Bearer token
- validate signature
- verify expiration
- load user
- create SecurityContext
- continue request

---

# Authentication Context

After successful authentication Spring Security stores

```
SecurityContext

↓

Authentication

↓

Principal

↓

Authorities
```

Controllers can access

```java
Authentication authentication

Principal principal

@AuthenticationPrincipal
```

---

# Session Strategy

The application is fully stateless.

No HTTP Session is stored.

```
SessionCreationPolicy.STATELESS
```

Each request must include a valid JWT.

---

# Client Responsibilities

Clients must

- authenticate using HTTPS only
- store access token securely
- store refresh token securely
- automatically refresh expired access tokens
- clear tokens after logout
- never expose tokens in URLs
- never store passwords locally

---

# Authentication Failures

Examples

## Invalid Password

```
401 Unauthorized
```

---

## Unknown User

```
401 Unauthorized
```

---

## Locked Account

```
403 Forbidden
```

---

## Disabled Account

```
403 Forbidden
```

---

## Expired JWT

```
401 Unauthorized
```

---

## Invalid Refresh Token

```
401 Unauthorized
```

---

# Account Locking

Future enhancement

After multiple failed login attempts

```
5 failed attempts

↓

Temporary Lock

↓

15 minutes
```

Administrator can manually unlock an account.

---

# Security Best Practices

The authentication system follows these principles:

- Passwords are hashed using BCrypt.
- Authentication only over HTTPS.
- Stateless architecture.
- JWT signed with a secure secret key.
- Refresh Tokens stored in database.
- Refresh Tokens can be revoked.
- No sensitive information inside JWT payload.
- No password stored or transmitted in plain text.
- Authentication failures are logged.
- Every login/logout is audited.
- Session fixation attacks are eliminated.
- Credentials are never logged.

---

# Integration with Spring Security

Authentication is implemented using:

- Spring Security 6
- AuthenticationManager
- UserDetailsService
- BCryptPasswordEncoder
- JwtAuthenticationFilter
- SecurityFilterChain
- AuthenticationEntryPoint

This architecture aligns with Spring Boot 3 best practices.

---

# Future Improvements

Future authentication features may include:

- Two-Factor Authentication (2FA)
- Time-based One-Time Passwords (TOTP)
- Email verification
- Password reset via email
- Device recognition
- Login notifications
- Biometric authentication (Flutter)
- Single Sign-On (SSO)
- OAuth2/OpenID Connect
- LDAP integration
- Session management dashboard

---

# Authentication Sequence Diagram

```
Client
   |
   | Login
   |
   ▼
AuthenticationController
   |
   ▼
AuthenticationService
   |
   ▼
AuthenticationManager
   |
   ▼
UserDetailsService
   |
   ▼
Database
   |
   ▼
User Found
   |
   ▼
Password Verification
   |
   ▼
Generate JWT
   |
   ▼
Generate Refresh Token
   |
   ▼
Save Refresh Token
   |
   ▼
Return Authentication Response
```

---

# Conclusion

The authentication system provides a secure, scalable, and stateless mechanism for verifying user identities across the platform. By combining Spring Security, JWT, Refresh Tokens, BCrypt password hashing, and HTTPS, the solution ensures strong protection against unauthorized access while remaining suitable for enterprise-scale deployments. The architecture is modular, extensible, and ready to support future enhancements such as multi-factor authentication, single sign-on, and biometric authentication.