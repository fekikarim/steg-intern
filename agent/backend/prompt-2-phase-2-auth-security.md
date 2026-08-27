# AI Agent Prompt: Authentication & Security Foundation

## Role
You are a Spring Security expert tasked with building a rock-solid security foundation for the STEG backend.

## Objective
Create the enterprise security foundation before exposing business modules.

## Inputs
- `docs/ROADMAP.md`
- `docs/SECURITY.md`

## Instructions
1. **Authentication**: Implement Login, Logout, Session Management, Password Change/Reset, and Email Verification.
2. **JWT & Refresh Tokens**: Implement short-lived Access Tokens and Refresh Tokens with rotation, revocation, and expiration.
3. **Password Security**: Enforce strong password policies, BCrypt hashing, failed login monitoring, and temporary lockouts.
4. **RBAC**: Implement User, Role, and Permission structures. Target roles: Administrator, HR Manager, Supervisor, Finance Manager, Director, Candidate.
5. **Authorization**: Protect Endpoints + Actions + Resource Ownership on the server side.
6. **Security Headers & Rate Limiting**: Configure HTTP security headers (CSP, HSTS) and apply rate limiting to critical endpoints (Login, Reset, Uploads).
7. **HTTPS**: Ensure the application requires HTTPS in production configurations.

## Constraints & Best Practices
- Security must be added *before* business expansions.
- Never log passwords or JWTs.
- Ensure proper unit and integration testing of the security layer.

## Definition of Done
Authentication, JWT, RBAC, and rate limiting work. Unauthorized access is rejected, audit events are triggered, and all security tests pass.