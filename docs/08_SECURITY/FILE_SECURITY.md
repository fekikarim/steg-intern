# File Security Specification

## 1. Overview

The File Security module defines the security rules, validation mechanisms, storage strategy, and access control policies applied to all documents exchanged inside the STEG Internship Management Platform.

The platform handles sensitive files including:

- Internship applications documents.
- Identity documents.
- CVs.
- University documents.
- Internship conventions.
- Assignment letters.
- Internship certificates.
- Deliverables.
- Reports.
- Evaluation documents.

Because these documents contain personal and administrative information, file management must follow strict security requirements.

---

# 2. Objectives

The File Security module aims to guarantee:

- Confidentiality of stored documents.
- Integrity of uploaded files.
- Controlled access according to user permissions.
- Protection against malicious files.
- Secure document lifecycle management.
- Traceability of file operations.

---

# 3. File Management Architecture

The platform must not store files directly inside the database.

Architecture:


Application
|
|
Spring Boot Backend
|
|
File Storage Service
|
|
Object Storage


Database stores only metadata:


Document Table

id
reference
type
storageKey
bucket
objectId
checksum
mimeType
size
version
createdDate


---

# 4. Supported File Types

Allowed file formats must be restricted.

## Documents

Allowed:


PDF
DOCX
DOC
TXT


---

## Images

Allowed:


JPG
JPEG
PNG


---

## Other Formats

By default:


Forbidden


New formats must be explicitly approved.

---

# 5. File Upload Security

Every uploaded file must pass security validation.

Validation pipeline:


Upload Request

    |
    v

Authentication Check

    |
    v

Authorization Check

    |
    v

File Type Validation

    |
    v

File Size Validation

    |
    v

Malware Scan

    |
    v

Checksum Generation

    |
    v

Secure Storage

    |
    v

Database Metadata Creation


---

# 6. File Size Restrictions

Maximum file sizes:

| File Type | Maximum Size |
|-|-|
| PDF documents | 10 MB |
| Office documents | 10 MB |
| Images | 5 MB |
| Deliverables | 50 MB |

Large files require administrative authorization.

---

# 7. File Name Security

User-provided filenames must never be trusted.

Forbidden examples:


../../secret.txt

<script>alert()</script>

command.exe


---

The backend must:

- Remove dangerous characters.
- Normalize filenames.
- Generate internal storage names.

Example:

Original:


Karim_CV.pdf


Stored:


8f32a9c7-2e8a-4d7a.pdf


---

# 8. MIME Type Validation

File extension verification is insufficient.

The backend must verify:

- Extension.
- MIME type.
- File signature (magic bytes).

Example:

A file named:


document.pdf


containing executable code must be rejected.

---

# 9. Malware Protection

Uploaded files should be scanned before storage.

Recommended solutions:

- Antivirus engine.
- ClamAV integration.
- Enterprise security scanner.

Process:


Upload

↓

Temporary Storage

↓

Security Scan

↓

Approved

↓

Permanent Storage


---

# 10. Secure Storage Rules

Files must be stored outside the public application directory.

Forbidden:


/public/uploads
/static/files
/frontend/assets


---

Recommended:


Object Storage

or

Protected File Server


---

# 11. Storage Organization

Recommended structure:


storage/

├── internships/
│
├── applications/
│
├── deliverables/
│
├── certificates/
│
└── temporary/


---

Example:


storage/internships/2026/INT-0001/document.pdf


---

# 12. Access Control

Files must never be publicly accessible.

Every download request requires:


Authentication

Authorization

Permission Verification


---

Example:

A student can access:


Own CV
Own internship documents
Own deliverables


But cannot access:


Another student's documents
Financial documents
Internal HR files


---

# 13. Role-Based File Access

| Role | Access |
|-|-|
| Candidate | Own application documents |
| Intern | Own internship files |
| Supervisor | Assigned interns documents |
| HR Manager | All internship documents |
| Finance Manager | Financial documents |
| Director | Authorized reports |
| Administrator | Full access |

---

# 14. Download Security

File download process:


User Request

    |
    v

Check Authentication

    |
    v

Check Permission

    |
    v

Generate Secure URL

    |
    v

Download File


---

Temporary download URLs are recommended:

Example:


https://storage/file?id=xxx&expires=300


Expiration:


5 minutes


---

# 15. File Integrity Protection

Each stored file must have a checksum.

Example:


SHA-256 Hash


Stored:


checksum =
a82d91e9c72....


Purpose:

- Detect corruption.
- Verify authenticity.
- Detect unauthorized modification.

---

# 16. Version Management

Documents must support versioning.

Example:


CV_v1.pdf

CV_v2.pdf

CV_v3.pdf


Database:


version = 3


Rules:

- Previous versions remain archived.
- Current version is marked active.
- Modifications are logged.

---

# 17. File Lifecycle Management

Document states:


UPLOADED

↓

VALIDATING

↓

APPROVED

↓

ACTIVE

↓

ARCHIVED

↓

DELETED


---

# 18. File Deletion Policy

Files must not be physically deleted immediately.

Process:


Delete Request

↓

Soft Delete

↓

Archive

↓

Permanent Removal


Permanent deletion requires:

- Administrator permission.
- Audit record.
- Retention policy verification.

---

# 19. Sensitive Document Protection

Sensitive documents include:

- National identity documents.
- Contracts.
- Payment documents.
- Evaluation reports.

Additional protections:

- Restricted access.
- Encryption at rest.
- Detailed audit logging.

---

# 20. Encryption Requirements

## Data in Transit

Mandatory:


HTTPS / TLS


---

## Data at Rest

Recommended:


AES-256 encryption


for sensitive documents.

---

# 21. File Security Audit Events

The following actions must be logged:

- Upload.
- Download.
- Validation.
- Rejection.
- Modification.
- Deletion.
- Permission changes.

Example:


USER_DOWNLOADED_DOCUMENT
DOCUMENT_VALIDATED
DOCUMENT_DELETED


---

# 22. Backend Security Rules

The backend must:

- Never trust client metadata.
- Validate every upload.
- Prevent path traversal.
- Prevent unauthorized access.
- Limit upload rate.
- Generate secure identifiers.

---

# 23. API Security Example

Upload:

```
POST /api/documents/upload
```

Required:


Authorization: Bearer JWT_TOKEN


Response:

```json
{
  "id": "uuid",
  "status": "UPLOADED"
}
```

Download:

```
GET /api/documents/{id}/download
```

Before returning the file:

```
verifyAccess(user, document)
```

---

# 24. Security Checklist

```
 Authentication required.
 Authorization verified.
 File type validated.
 File size limited.
 Filename sanitized.
 Malware scanning supported.
 Files stored privately.
 Checksums generated.
 Downloads audited.
 Sensitive files protected.
 HTTPS enforced.
 Versioning supported.
```

---

# 25. Future Improvements

Possible evolutions:

OCR document analysis.
AI document classification.
Automatic fraud detection.
Digital signatures.
Blockchain-based document verification.
Advanced document retention policies.   

---

# 26. Conclusion

The File Security module ensures that all documents exchanged through the STEG Internship Management Platform remain secure, confidential, traceable, and protected throughout their complete lifecycle.

It provides the necessary foundation for a professional enterprise-grade document management system.