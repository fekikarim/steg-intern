# STAKEHOLDERS

**Project:** Smart Internship & Administrative Workflow Platform  
**Organization:** Société Tunisienne de l'Électricité et du Gaz (STEG)  
**Document Version:** 1.0  
**Status:** Final  
**Owner:** Project Team (Karim Feki & Nesrine Derouiche)

---

# 1. Purpose

This document identifies every stakeholder involved in the project and clearly defines their responsibilities, expectations, level of involvement, and interactions with the platform.

Understanding stakeholders is essential because the platform serves multiple departments with different objectives, permissions, and business processes.

Each stakeholder contributes to the success of the internship lifecycle from internship application until internship completion and administrative closure.

---

# 2. Stakeholder Classification

The project involves three categories of stakeholders:

- Primary Stakeholders
- Secondary Stakeholders
- Technical Stakeholders

---

# 3. Primary Stakeholders

Primary stakeholders interact directly with the platform on a daily basis.

---

## 3.1 Candidate (Student)

### Description

A student wishing to apply for an internship at STEG.

The candidate is the first actor entering the internship process.

---

### Main Objectives

- Create an internship application
- Upload required documents
- Track application status
- Receive notifications
- Become an intern after approval

---

### Responsibilities

- Complete application information
- Upload valid documents
- Respond to HR requests
- Follow application progress

---

### Platform Access

Front Office (Next.js)

---

### Main Features

- Authentication (optional)
- Internship application
- CV upload
- Motivation letter upload
- Application tracking
- Notifications

---

## 3.2 Intern

### Description

A candidate whose internship application has been accepted.

The intern becomes the central actor of the Internship Companion mobile application.

---

### Main Objectives

- Complete internship successfully
- Submit deliverables
- Fill internship journal
- Complete assigned tasks
- Receive supervisor feedback

---

### Responsibilities

- Submit daily/weekly journal entries
- Upload deliverables
- Respect deadlines
- Communicate with supervisor

---

### Platform Access

Flutter Mobile Application

---

### Main Features

- Internship dashboard
- Daily journal
- Deliverable upload
- Task management
- Notifications
- Timeline

---

## 3.3 Supervisor

### Description

Employee responsible for supervising one or more interns.

---

### Main Objectives

- Guide interns
- Evaluate progress
- Validate deliverables
- Write evaluations
- Approve internship activities

---

### Responsibilities

- Review journals
- Validate deliverables
- Evaluate intern performance
- Give feedback
- Monitor internship progress

---

### Platform Access

Angular Back Office

---

### Main Features

- Assigned interns
- Evaluation management
- Deliverable validation
- Journal validation
- Comments
- Notifications

---

## 3.4 HR Manager

### Description

Human Resources employee responsible for internship management.

The HR department is one of the main business owners of the platform.

---

### Main Objectives

- Manage internship applications
- Manage candidates
- Create internships
- Assign supervisors
- Generate administrative documents

---

### Responsibilities

- Validate applications
- Accept or reject candidates
- Assign departments
- Assign supervisors
- Monitor internship lifecycle

---

### Platform Access

Angular Back Office

---

### Main Features

- Candidate management
- Internship management
- Assignment management
- Workflow validation
- Document generation
- Dashboard

---

## 3.5 Finance Manager

### Description

Responsible for internship financial operations.

---

### Main Objectives

- Manage internship compensation
- Validate payments
- Follow payment workflows

---

### Responsibilities

- Validate payment requests
- Approve payments
- Track payment history

---

### Platform Access

Angular Back Office

---

### Main Features

- Payment management
- Workflow validation
- Financial dashboard

---

## 3.6 Director

### Description

Executive stakeholder responsible for final approvals when required.

---

### Main Objectives

- Validate strategic decisions
- Monitor internship statistics
- Supervise global activity

---

### Responsibilities

- Final workflow approval
- Dashboard consultation
- KPI monitoring

---

### Platform Access

Angular Back Office

---

### Main Features

- Dashboards
- Reports
- Workflow approvals
- Analytics

---

## 3.7 Administrator

### Description

Technical administrator responsible for platform configuration and maintenance.

---

### Main Objectives

- Configure the platform
- Manage users
- Maintain security
- Ensure platform availability

---

### Responsibilities

- User management
- Role management
- Permission management
- System configuration
- Audit monitoring

---

### Platform Access

Angular Back Office

---

### Main Features

- User administration
- Security settings
- Audit logs
- System monitoring
- Configuration

---

# 4. Secondary Stakeholders

---

## 4.1 Department

Departments host interns during their internship.

Although departments are not direct software users, they are important business entities because internships are assigned to departments.

---

### Responsibilities

- Welcome interns
- Provide working environment
- Collaborate with supervisors

---

## 4.2 University

Universities provide internship agreements and receive internship certificates.

The university does not interact directly with the platform but benefits from generated documents.

---

### Responsibilities

- Provide internship conventions
- Validate internship periods
- Receive internship certificates

---

## 4.3 STEG Management

Executive management monitors internship activities through reports and dashboards.

---

### Interests

- Digital transformation
- Paper reduction
- Internship statistics
- Performance indicators
- Administrative efficiency

---

# 5. Technical Stakeholders

---

## 5.1 Development Team

Responsible for designing, developing, testing, deploying, and maintaining the platform.

Current Team:

- Karim Feki
- Nesrine Derouiche

---

### Responsibilities

- Software architecture
- Development
- Testing
- Documentation
- Deployment

---

## 5.2 Internship Supervisor (Academic / Company)

Current Supervisor:

**Mr. Mohsen Marmouri**

---

### Responsibilities

- Validate project orientation
- Review deliverables
- Ensure project quality
- Provide technical guidance
- Validate internship progress

---

# 6. Stakeholder Power / Interest Matrix

| Stakeholder | Interest | Influence | Priority |
|------------|----------|-----------|-----------|
| HR Manager | Very High | Very High | Critical |
| Supervisor | Very High | High | Critical |
| Intern | Very High | High | Critical |
| Candidate | High | Medium | High |
| Administrator | High | Very High | Critical |
| Finance Manager | High | High | High |
| Director | Medium | Very High | High |
| STEG Management | Medium | Very High | High |
| University | Medium | Low | Medium |
| Department | Medium | Medium | Medium |
| Development Team | Very High | Very High | Critical |
| Internship Supervisor | Very High | Very High | Critical |

---

# 7. Stakeholder Interaction Flow

```text
Candidate
      │
      ▼
Internship Application
      │
      ▼
HR Manager
      │
      ▼
Internship Creation
      │
      ▼
Department Assignment
      │
      ▼
Supervisor Assignment
      │
      ▼
Intern
      │
      ▼
Internship Companion
      │
      ▼
Deliverables
Journal
Tasks
      │
      ▼
Supervisor Validation
      │
      ▼
HR Monitoring
      │
      ▼
Finance (if applicable)
      │
      ▼
Internship Completion
      │
      ▼
Certificate Generation
```

---

# 8. Stakeholder Communication

| Stakeholder | Communication Method |
|-------------|----------------------|
| Candidate | Email, Platform Notifications |
| Intern | Mobile Notifications, In-App Messages |
| Supervisor | Back Office Notifications |
| HR Manager | Dashboard, Workflow Notifications |
| Finance Manager | Workflow Notifications |
| Director | Dashboard Reports |
| Administrator | Audit Logs, System Notifications |
| Development Team | GitHub, Documentation, Meetings |
| Internship Supervisor | Weekly Meetings, Progress Reports |

---

# 9. Stakeholder Responsibilities Summary

| Stakeholder | Main Responsibility |
|-------------|--------------------|
| Candidate | Apply for internship |
| Intern | Complete internship activities |
| Supervisor | Supervise and evaluate interns |
| HR Manager | Manage internship lifecycle |
| Finance Manager | Manage internship payments |
| Director | Strategic approval and monitoring |
| Administrator | Platform administration |
| Department | Host internships |
| University | Academic collaboration |
| Development Team | Build and maintain the platform |
| Internship Supervisor | Validate project quality |

---

# 10. Success Factors for Stakeholder Satisfaction

The platform will be considered successful if it enables each stakeholder to accomplish their responsibilities efficiently through a secure, intuitive, and centralized digital environment.

Key satisfaction factors include:

- Simplified internship management
- Reduced administrative workload
- Complete process traceability
- Faster approval workflows
- Reliable document management
- Secure role-based access
- Clear communication between actors
- Real-time progress tracking
- High platform availability
- Improved collaboration between all stakeholders

---

# 11. Conclusion

The Smart Internship & Administrative Workflow Platform is designed around the needs of its stakeholders. Every functional module, workflow, and business process has been defined to support the responsibilities of a specific actor while ensuring seamless collaboration across departments.

A clear understanding of stakeholder roles provides the foundation for the system architecture, access control model, workflow engine, and overall business processes described throughout the project's documentation.