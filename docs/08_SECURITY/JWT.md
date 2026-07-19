# JSON Web Tokens (JWT)

> **Document Version:** 1.0  
> **Project:** Intelligent Internship Management & Administrative Workflow Platform - STEG  
> **Module:** Security  
> **Document:** JWT Authentication Strategy

---

# 1. Purpose

This document defines how JSON Web Tokens (JWT) are used within the STEG Internship Management Platform to provide secure, stateless authentication between client applications and the backend.

JWT enables users to authenticate once and securely access protected resources without requiring server-side session storage.

This document complements:

- AUTHENTICATION.md
- AUTHORIZATION.md
- RBAC.md
- REFRESH_TOKENS.md

---

# 2. Why JWT?

Traditional web applications store sessions on the server.

```
Browser
    │
    ▼
Server Session
```

This approach becomes difficult to scale.

Instead, the platform uses stateless authentication.

```
Client
     │
JWT Token
     │
     ▼
Spring Boot API
```

The backend validates the token without storing user sessions.

Benefits include:

- Stateless architecture
- Horizontal scalability
- Better performance
- API-first design
- Mobile compatibility
- Simplified authentication across multiple clients

---

# 3. Authentication Flow

```
User Login
      │
      ▼
Spring Security Authentication
      │
Credentials Validated
      │
      ▼
Generate JWT
Generate Refresh Token
      │
      ▼
Return Tokens
      │
      ▼
Client Stores Tokens
      │
      ▼
Authenticated Requests
```

---

# 4. JWT Lifecycle

```
Login
   │
   ▼
Access Token Created
   │
   ▼
Client Calls API
   │
   ▼
Backend Validates JWT
   │
   ▼
Authorized Request
   │
   ▼
JWT Expires
   │
   ▼
Refresh Token Used
   │
   ▼
New JWT Issued
```

---

# 5. JWT Structure

A JWT consists of three parts.

```
HEADER
.

PAYLOAD
.

SIGNATURE
```

Example:

```
xxxxx.yyyyy.zzzzz
```

---

# 6. Header

The header contains metadata about the token.

Example:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Where:

- alg = signing algorithm
- typ = token type

---

# 7. Payload

The payload contains claims describing the authenticated user.

Typical payload:

```json
{
  "sub": "5c4b9d3e-96a5-4e2a-a5bb-f67b7b84b324",
  "email": "karim@example.com",
  "roles": [
    "ROLE_HR_MANAGER"
  ],
  "iat": 1750000000,
  "exp": 1750001800
}
```

---

# 8. Standard Claims

The platform uses standard JWT claims.

| Claim | Description |
|---------|------------|
| sub | User identifier (UUID) |
| iat | Issued at |
| exp | Expiration date |
| iss | Token issuer |
| aud | Intended audience |
| jti | Unique token identifier |

---

# 9. Custom Claims

Additional application-specific claims may include:

| Claim | Description |
|---------|------------|
| email | User email |
| roles | Assigned roles |
| permissions | Optional permission list |
| department | User department |
| accountStatus | ACTIVE, LOCKED, etc. |

Sensitive information such as passwords or personal data must never be stored inside the JWT payload.

---

# 10. JWT Signature

The signature guarantees that the token has not been modified.

```
Header
      +
Payload
      +
Secret Key
      │
      ▼
HMAC SHA-256
      │
      ▼
Digital Signature
```

If the payload changes, the signature becomes invalid and the token is rejected.

---

# 11. Token Generation

After successful authentication:

1. User credentials are verified.
2. User roles and authorities are loaded.
3. Claims are generated.
4. JWT is signed.
5. Refresh Token is created.
6. Both tokens are returned to the client.

---

# 12. Token Validation

Every protected request follows this validation process.

```
Incoming Request
       │
       ▼
Authorization Header
       │
       ▼
Extract JWT
       │
       ▼
Verify Signature
       │
       ▼
Verify Expiration
       │
       ▼
Verify User Status
       │
       ▼
Load Authorities
       │
       ▼
Continue Request
```

---

# 13. Authorization Header

Clients send the JWT using the HTTP Authorization header.

Example:

```
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

Only the `Bearer` scheme is accepted.

---

# 14. Token Expiration

Access Tokens are intentionally short-lived.

Recommended duration:

| Token | Lifetime |
|---------|----------|
| Access Token | 15 minutes |
| Refresh Token | 7 days |

These values can be configured based on security requirements.

---

# 15. Expired Tokens

If an Access Token has expired:

```
Client
   │
Expired JWT
   │
   ▼
HTTP 401 Unauthorized
   │
   ▼
Use Refresh Token
   │
   ▼
Receive New Access Token
```

If the Refresh Token has also expired or is revoked, the user must authenticate again.

---

# 16. Invalid Tokens

A JWT is rejected if:

- Signature is invalid.
- Token has expired.
- Token format is malformed.
- Required claims are missing.
- Issuer is invalid.
- Audience is invalid.
- User account is disabled.
- User account is locked.

Response:

```
HTTP 401 Unauthorized
```

---

# 17. Client Responsibilities

## Angular Back Office

- Store Access Token securely.
- Automatically refresh expired tokens.
- Clear tokens during logout.
- Never expose tokens in URLs.

---

## Next.js Front Office

- Store tokens using secure HttpOnly cookies when applicable.
- Attach the Access Token to protected API requests.
- Handle token expiration gracefully.

---

## Flutter Mobile Application

- Store tokens in secure device storage.
- Never store tokens in plain text.
- Automatically refresh expired Access Tokens.
- Delete tokens on logout.

---

# 18. Backend Responsibilities

The Spring Boot backend must:

- Generate JWTs.
- Validate signatures.
- Verify expiration.
- Reject malformed tokens.
- Reject revoked sessions.
- Load user authorities.
- Authenticate every request.
- Never trust client-provided claims without verification.

---

# 19. Security Best Practices

The platform follows these JWT best practices:

- Use HTTPS for all communications.
- Use short-lived Access Tokens.
- Use Refresh Tokens for session renewal.
- Sign all tokens with a strong secret or private key.
- Never expose secret keys.
- Never store passwords in JWT claims.
- Never include confidential personal information in the payload.
- Validate every token on every request.
- Revoke sessions when accounts are disabled or locked.
- Rotate signing keys periodically when operationally feasible.

---

# 20. Error Responses

### Missing Token

```
HTTP 401 Unauthorized
```

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication token is missing."
}
```

---

### Invalid Token

```
HTTP 401 Unauthorized
```

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid authentication token."
}
```

---

### Expired Token

```
HTTP 401 Unauthorized
```

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Authentication token has expired."
}
```

---

# 21. JWT and Spring Security

JWT integrates with Spring Security through a custom authentication filter.

```
Incoming Request
        │
        ▼
JWT Authentication Filter
        │
        ▼
Validate Token
        │
        ▼
Load UserDetails
        │
        ▼
Create Authentication Object
        │
        ▼
SecurityContextHolder
        │
        ▼
Controller
```

This process occurs automatically for every protected endpoint.

---

# 22. Future Improvements

Future versions of the platform may include:

- Asymmetric signing using RSA or EC keys (RS256/ES256)
- Signing key rotation
- JSON Web Key Set (JWKS) support
- Integration with OAuth 2.0 / OpenID Connect
- Single Sign-On (SSO)
- Device fingerprint validation
- Token introspection for distributed services
- Risk-based authentication

---

# 23. Summary

The STEG Internship Management Platform uses JSON Web Tokens (JWT) as the foundation of its stateless authentication architecture. JWTs enable secure communication between client applications and the backend while supporting scalability, performance, and cross-platform compatibility. Combined with Spring Security, RBAC, Refresh Tokens, and HTTPS, JWT provides a robust and enterprise-ready authentication mechanism that protects access to all platform resources.