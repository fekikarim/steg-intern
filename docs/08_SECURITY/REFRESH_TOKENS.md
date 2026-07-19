# Refresh Tokens

> **Document Version:** 1.0  
> **Project:** Intelligent Internship Management & Administrative Workflow Platform - STEG  
> **Module:** Security  
> **Document:** Refresh Token Strategy

---

# 1. Purpose

This document defines the Refresh Token strategy used by the STEG Internship Management Platform.

Refresh Tokens provide a secure mechanism for maintaining user sessions without requiring frequent re-authentication while minimizing the security risks associated with long-lived Access Tokens.

This document complements:

- AUTHENTICATION.md
- AUTHORIZATION.md
- RBAC.md
- JWT.md

---

# 2. Why Refresh Tokens?

Using only long-lived JWT Access Tokens is insecure because a compromised token remains valid until it expires.

Instead, the platform separates authentication into two token types:

- Short-lived Access Token
- Long-lived Refresh Token

This approach provides both security and a better user experience.

---

# 3. Token Architecture

```
                    Login
                      │
                      ▼
            Spring Security
                      │
        Credentials Verified
                      │
                      ▼
      Generate Access Token (JWT)
      Generate Refresh Token
                      │
                      ▼
             Return Both Tokens
                      │
        ┌─────────────┴─────────────┐
        │                           │
 Access Token                 Refresh Token
 (15 minutes)                  (7 days)
        │                           │
 Used for API calls          Used only to obtain
                              new Access Tokens
```

---

# 4. Token Responsibilities

## Access Token

Purpose:

- Authenticate API requests
- Carry user identity
- Carry user authorities
- Short lifetime

---

## Refresh Token

Purpose:

- Renew expired Access Tokens
- Extend authenticated sessions
- Reduce login frequency

Refresh Tokens are **never** used to access business endpoints directly.

---

# 5. Refresh Token Lifecycle

```
User Login
     │
     ▼
Access Token
Refresh Token
     │
     ▼
API Requests
     │
     ▼
Access Token Expires
     │
     ▼
Client Calls

POST /api/auth/refresh

     │
     ▼
Refresh Token Valid?
     │
 ┌───┴────┐
 │        │
Yes       No
 │        │
 ▼        ▼
New JWT   Login Required
```

---

# 6. Storage Strategy

## Backend

Refresh Tokens are stored securely in the database.

Stored information includes:

- Token ID
- Token value (hashed if implemented)
- User ID
- Creation date
- Expiration date
- Revocation status

---

Example entity:

```
RefreshToken

UUID id

String token

UUID userId

LocalDateTime createdAt

LocalDateTime expiryDate

Boolean revoked
```

---

## Client Applications

### Angular

Store the Refresh Token securely.

Never expose it in URLs.

---

### Next.js

Prefer Secure HttpOnly Cookies.

This prevents JavaScript access and reduces XSS risks.

---

### Flutter

Store the Refresh Token using secure encrypted device storage.

Never use:

- SharedPreferences
- Plain text files
- Local databases without encryption

---

# 7. Refresh Endpoint

The platform exposes a dedicated endpoint.

```
POST /api/auth/refresh
```

Request:

```json
{
  "refreshToken": "xxxxxxxxxxxxxxxx"
}
```

Successful response:

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

---

# 8. Token Rotation

The platform implements **Refresh Token Rotation**.

Every successful refresh generates:

- A new Access Token
- A new Refresh Token

The previous Refresh Token is immediately revoked.

```
Old Refresh Token

↓

Revoked

↓

New Refresh Token
```

This prevents replay attacks using stolen Refresh Tokens.

---

# 9. Validation Process

Before issuing a new Access Token, the backend verifies:

- Token exists
- Token is not revoked
- Token has not expired
- User exists
- User account is enabled
- User account is not locked

Only then is a new token pair generated.

---

# 10. Token Expiration

Recommended configuration:

| Token | Lifetime |
|---------|----------|
| Access Token | 15 minutes |
| Refresh Token | 7 days |

These values may be adjusted according to STEG security policies.

---

# 11. Logout

When a user logs out:

```
Client
     │
     ▼
POST /api/auth/logout
     │
     ▼
Backend
     │
     ▼
Refresh Token Revoked
Session Invalidated
```

After logout:

- Refresh Token becomes unusable.
- A new login is required.

---

# 12. Forced Logout

Administrators may revoke all active Refresh Tokens for a user when:

- Password is changed
- Account is disabled
- Account is locked
- Security incident detected
- Suspicious activity observed

This immediately invalidates all active sessions.

---

# 13. Multiple Devices

The platform supports multiple simultaneous sessions.

Example:

```
Laptop

Refresh Token A
```

```
Mobile

Refresh Token B
```

```
Tablet

Refresh Token C
```

Each device owns its own Refresh Token and session.

Revoking one session does not affect the others unless a global logout is requested.

---

# 14. Expired Refresh Tokens

If a Refresh Token has expired:

```
POST /api/auth/refresh

↓

401 Unauthorized
```

Response:

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Refresh token has expired."
}
```

The user must authenticate again.

---

# 15. Revoked Refresh Tokens

If a revoked token is presented:

```
POST /api/auth/refresh

↓

401 Unauthorized
```

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Refresh token has been revoked."
}
```

---

# 16. Security Best Practices

The platform follows these practices:

- Use HTTPS exclusively.
- Store Refresh Tokens securely.
- Rotate Refresh Tokens after every use.
- Revoke tokens on logout.
- Revoke tokens after password changes.
- Keep Access Tokens short-lived.
- Never include sensitive information in Refresh Tokens.
- Validate every Refresh Token request.
- Monitor abnormal refresh activity.
- Associate Refresh Tokens with user sessions.

---

# 17. Session Management

Each authenticated session is linked to:

- User
- Refresh Token
- Device information
- IP address
- User Agent
- Login timestamp
- Expiration timestamp

This enables administrators to monitor and terminate active sessions if necessary.

---

# 18. Error Handling

Possible responses:

| HTTP Status | Description |
|-------------|-------------|
| 200 | Token successfully refreshed |
| 400 | Invalid request |
| 401 | Missing Refresh Token |
| 401 | Invalid Refresh Token |
| 401 | Expired Refresh Token |
| 401 | Revoked Refresh Token |
| 403 | User account disabled or locked |
| 500 | Internal server error |

---

# 19. Future Improvements

Future versions may include:

- Refresh Token hashing before database storage
- Device fingerprint verification
- Geolocation-based anomaly detection
- Session management dashboard
- Token reuse detection
- Automatic revocation after suspicious activity
- OAuth 2.0 Refresh Token support
- OpenID Connect compatibility
- Adaptive session lifetimes based on risk

---

# 20. Summary

The STEG Internship Management Platform uses Refresh Tokens to maintain secure, long-lived user sessions while keeping Access Tokens short-lived. Refresh Tokens are securely stored, validated, rotated after each use, and revoked when necessary, significantly reducing the impact of token theft. Combined with JWT authentication, RBAC, Spring Security, and HTTPS, this strategy provides a secure, scalable, and enterprise-ready session management solution.