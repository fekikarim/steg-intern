# STEG Smart Internship & Administrative Workflow Platform

![Platform Overview](docs/assets/diagrams/architecture-overview.png) <!-- Update placeholder if needed -->

## 📖 Overview

The **STEG Talent Portal** and **Enterprise Back Office** represent a complete digital transformation of the internship lifecycle at Société Tunisienne de l'Électricité et du Gaz (STEG). The platform replaces paper-based administrative procedures with a centralized, secure, and intelligent digital ecosystem.

### Key Objectives
- **Digitize Applications**: Transition from paper to an online student portal.
- **Workflow Automation**: Accelerate administrative validations across HR, departments, and finance.
- **Real-Time Monitoring**: Give students, supervisors, and HR complete visibility over the internship timeline.
- **Enterprise Traceability**: Every workflow step is secured, logged, and audited.

---

## 🏗️ Architecture & Technology Stack

The platform is designed around a unified backend architecture with specialized client applications.

### 1. Unified Backend (`/backend`)
- **Framework:** Spring Boot 4.1 (Java 17+)
- **Database:** PostgreSQL 17
- **Security:** JWT Authentication, Role-Based Access Control (RBAC)
- **Features:** RESTful APIs, JPA/Hibernate, Workflow Engine, Mail Services

### 2. Front Office — Student Portal (`/frontend/next`)
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS, Shadcn UI
- **Role:** Public-facing application for students to apply, upload documents, and track progress.

### 3. Enterprise Back Office (`/frontend/angular`)
- **Framework:** Angular 20 (Standalone Components)
- **Styling:** Angular Material, Tailwind CSS
- **Role:** Internal administrative portal for HR, Finance, Directors, and Supervisors to manage the internship lifecycle.

### 4. Internship Companion (Future/Mobile)
- **Framework:** Flutter
- **Role:** Mobile app for interns and supervisors to manage daily journals, tasks, deliverables, and evaluations.

---

## 📂 Repository Structure

```text
steg/
├── backend/            # Spring Boot REST API
├── frontend/
│   ├── angular/        # Enterprise Back Office (HR, Admins)
│   └── next/           # Public Front Office (Students)
├── docs/               # Technical and Business Specifications
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** (or higher LTS)
- **Node.js 24** (Active LTS)
- **PostgreSQL 17**

### 1. Database Setup
Ensure PostgreSQL is running locally and create the database:
```sql
CREATE DATABASE steg_internship;
```
*(Check `backend/src/main/resources/application.properties` for exact credentials configuration)*

### 2. Running the Backend
The backend uses the Maven Wrapper (`mvnw`), so a global Maven installation is not required.
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

### 3. Running the Front Office (Next.js)
```bash
cd frontend/next
npm install
npm run dev
```

### 4. Running the Back Office (Angular)
```bash
cd frontend/angular
npm install
npm start
```

---

## 🔐 Security & Constraints
- **Zero Direct Database Access**: Frontend clients strictly communicate via REST APIs.
- **Data Protection**: Sensitive documents are encrypted; passwords are hashed using BCrypt.
- **Audit Logging**: All administrative and workflow actions are immutably logged.

---

## 📜 Documentation
Comprehensive specifications and architectural details can be found in the `/docs` directory:
- `FRONT-OFFICE-SPECS.md`
- `BACK-OFFICE-SPECS.md`
- `MOBILE-APP-SPECS.md`
- `DOMAIN-MODEL.md`
