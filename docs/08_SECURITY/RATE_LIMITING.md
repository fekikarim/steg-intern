# Rate Limiting

## 1. Overview

Rate limiting is a security mechanism used to control the number of requests that a user, client application, or external system can send to the platform within a defined period of time.

The objective is to protect the platform against:

- Denial of Service (DoS) attacks.
- Brute-force authentication attempts.
- API abuse.
- Excessive resource consumption.
- Automated malicious requests.

The rate limiting strategy must be implemented at the API level and integrated with the Spring Boot backend.

---

# 2. Objectives

The rate limiting system must:

- Protect public and authenticated APIs.
- Prevent abuse while maintaining a good user experience.
- Protect authentication endpoints from brute-force attacks.
- Ensure fair resource usage between users.
- Provide monitoring information for suspicious activities.

---

# 3. Rate Limiting Strategy

The platform will use multiple rate limiting levels depending on the endpoint sensitivity.

## 3.1 Global API Rate Limit

Applies to all API requests.

Example:


100 requests / minute / user


Purpose:

- Prevent abnormal API consumption.
- Protect backend resources.

---

## 3.2 Authentication Rate Limit

Authentication endpoints require stricter limits.

Protected endpoints:


POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh-token
POST /api/auth/reset-password


Example rules:


Maximum:
5 failed login attempts
per account
within 15 minutes


After exceeding the limit:

- Temporary account lock.
- Security event creation.
- Notification generation if required.

---

## 3.3 File Upload Rate Limit

File upload operations require protection because they consume storage and processing resources.

Protected operations:

- CV upload.
- Internship documents upload.
- Deliverables upload.
- Images upload.

Example:


20 uploads / hour / user


Additional controls:

- Maximum file size validation.
- Allowed MIME types verification.
- Malware scanning if available.

---

## 3.4 Notification Rate Limit

To avoid notification flooding:

Example:


50 notifications / minute / system process


Rules:

- Prevent duplicated notifications.
- Avoid spam generation.
- Control automatic workflow notifications.

---

# 4. Rate Limit Identification

Requests are identified using different strategies.

## 4.1 Authenticated Users

Primary identifier:


User ID


Example:


user: 8f7a-xxxx
limit: 100 requests/minute


---

## 4.2 Unauthenticated Users

Identification:

- IP address.
- Device fingerprint when available.

Example:


IP: 192.xxx.xxx.xxx
limit: 30 requests/minute


---

## 4.3 Internal Services

Internal services may use:

- Service identity.
- API keys.
- Internal authentication tokens.

---

# 5. Response When Limit Is Exceeded

When the rate limit is reached, the API must return:

HTTP Status:


429 TOO MANY REQUESTS


Example response:

```json
{
  "timestamp": "2026-07-01T10:30:00",
  "status": 429,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later.",
  "retryAfter": 60
}
```

---

# 6. Retry Mechanism

The API should provide:

HTTP Header:

Retry-After

Example:

Retry-After: 60

Meaning:

The client should wait 60 seconds before retrying.

---

# 7. Authentication Protection Rules

## Login Protection

The system must detect:

Multiple failed passwords.
Multiple accounts from the same IP.
Suspicious login patterns.

Example:

5 failed attempts
        |
        v
Temporary lock for 15 minutes
        |
        v
Security audit event

---

# 8. Implementation Approach

Recommended implementation:

Backend

Spring Boot integration:

Possible solutions:

Bucket4j.
Redis based rate limiting.
Spring Cloud Gateway filters.

Recommended architecture:

Client
  |
  v
API Gateway / Filter
  |
  v
Rate Limiter
  |
  v
Spring Boot REST API

---

# 9. Distributed Rate Limiting

Because the platform may evolve into a multi-instance deployment, rate limiting should support distributed environments.

Recommended storage:

Redis

Example:

Application Instance 1
        |
Application Instance 2
        |
Application Instance 3
        |
        v
      Redis
 Rate Limit Storage

Advantages:

Shared counters.
Horizontal scalability.
Consistent behavior.

---

# 10. Administrative Controls

Administrators should be able to configure:

Maximum requests.
Time windows.
Endpoint priorities.
Temporary exceptions.

Example:

Endpoint:

```
POST /api/auth/login 
```

Limit:

5 requests

Window:
15 minutes

---

# 11. Monitoring and Logging

Rate limiting events must be logged.

Example audit entry:

```json
{
  "event": "RATE_LIMIT_EXCEEDED",
  "userId": "uuid",
  "endpoint": "/api/auth/login",
  "ipAddress": "192.xxx.xxx.xxx",
  "timestamp": "2026-07-01T12:00:00"
}
```

Monitoring indicators:

Number of blocked requests.
Most targeted endpoints.
Suspicious IP addresses.
Repeated authentication failures.

---

# 12. Security Considerations

The implementation must:

Avoid blocking legitimate users unnecessarily.
Use progressive restrictions.
Protect authentication endpoints more strictly.
Avoid exposing sensitive information in errors.
Keep rate limit configurations centralized.

---

#   13. Future Improvements

Possible future enhancements:

Machine learning based anomaly detection.
Adaptive rate limiting.
Geographic blocking.
Advanced bot detection.
Integration with security monitoring systems.

---

# 14. Conclusion

Rate limiting is a fundamental security layer of the STEG Internship Management Platform.

It ensures that:

APIs remain available.
User resources are protected.
Authentication attacks are reduced.
System performance remains stable.

The rate limiting mechanism must be considered a core security component integrated into the backend architecture.