# Folder Structure

## 1. Purpose

This document defines the recommended project folder structure for the **STEG Intelligent Internship Management Platform**.

The objective is to establish a clear, scalable, and maintainable organization for all project components:

- Backend.
- Frontend applications.
- Mobile application.
- Documentation.
- Infrastructure.
- Database scripts.
- Testing resources.

The structure follows:

- Clean Architecture principles.
- Feature-based organization.
- Domain-driven design concepts.
- Separation of responsibilities.

---

# 2. Global Repository Structure

The complete project repository is organized as:

```

steg-internship-platform

│
├── backend

│
├── frontend

│
├── mobile

│
├── database

│
├── infrastructure

│
├── documentation

│
├── scripts

│
├── tests

│
├── docker

│
└── README.md

```

---

# 3. Backend Structure

Technology:

```

Spring Boot 3

Java

```

Main folder:

```

backend

```

Structure:

```

backend

│
├── src

│   │
│   ├── main

│   │   │
│   │   ├── java

│   │   │
│   │   └── resources

│   │
│   └── test

│
├── pom.xml

├── Dockerfile

└── README.md

```

---

# 4. Backend Java Package Structure

Package:

```

com.steg.platform

```

Structure:

```

com.steg.platform

│
├── common

│   ├── exceptions

│   ├── responses

│   ├── constants

│   └── utils

│
├── security

│   ├── config

│   ├── jwt

│   ├── filters

│   └── handlers

│
├── auth

│   ├── controller

│   ├── service

│   ├── repository

│   ├── entity

│   ├── dto

│   └── mapper

│
├── user

│
├── candidate

│
├── internship

│
├── workflow

│
├── document

│
├── notification

│
├── evaluation

│
├── payment

│
└── audit

```

---

# 5. Backend Module Structure

Each business module follows:

```

module-name

│
├── controller

│
├── service

│
├── repository

│
├── entity

│
├── dto

│
├── mapper

│
├── validator

│
└── exception

```

Example:

```

internship

├── controller

│   └── InternshipController.java

│
├── service

│   └── InternshipService.java

│
├── repository

│   └── InternshipRepository.java

│
├── entity

│   └── Internship.java

│
└── dto

```
└── InternshipResponseDTO.java
```

```

---

# 6. Backend Resources Structure

```

resources

│
├── application.yml

├── application-dev.yml

├── application-prod.yml

│
├── db

│   ├── migration

│   └── seed

│
├── templates

│   └── pdf

│
└── messages

```

---

# 7. Frontend Structure

The platform contains two web applications:

```

frontend

│
├── front-office

│
└── back-office

```

---

# 8. Next.js Front Office Structure

Technology:

```

Next.js

React

TypeScript

```

Structure:

```

front-office

│
├── src

│   │
│   ├── app

│   │
│   ├── components

│   │
│   ├── features

│   │
│   ├── services

│   │
│   ├── hooks

│   │
│   ├── types

│   │
│   ├── utils

│   │
│   └── styles

│
├── public

├── package.json

└── README.md

```

---

# 9. Next.js Feature Structure

Example:

```

features

│
├── authentication

│
├── applications

│
├── documents

│
├── profile

│
└── notifications

```

Each feature:

```

feature

│
├── components

├── hooks

├── services

├── types

└── validation

```

---

# 10. Angular Back Office Structure

Technology:

```

Angular

TypeScript

```

Structure:

```

back-office

│
├── src

│   │
│   ├── app

│   │
│   ├── assets

│   │
│   ├── environments

│   │
│   └── styles

│
├── angular.json

├── package.json

└── README.md

```

---

# 11. Angular Application Structure

```

app

│
├── core

│   ├── auth

│   ├── guards

│   ├── interceptors

│   └── services

│
├── shared

│   ├── components

│   ├── directives

│   └── pipes

│
├── features

│   ├── users

│   ├── internships

│   ├── workflows

│   ├── documents

│   ├── payments

│   └── reports

│
└── layouts

```

---

# 12. Mobile Application Structure

Technology:

```

Flutter

Dart

```

Main folder:

```

mobile

```

Structure:

```

mobile

│
├── lib

│   │
│   ├── core

│   │
│   ├── features

│   │
│   ├── shared

│   │
│   └── main.dart

│
├── test

├── assets

├── pubspec.yaml

└── README.md

```

---

# 13. Flutter Feature Structure

Example:

```

features

│
├── authentication

├── internship

├── journal

├── tasks

├── deliverables

├── evaluations

├── notifications

└── profile

```

Each feature:

```

feature

│
├── data

│   ├── models

│   ├── repositories

│   └── datasources

│
├── domain

│   ├── entities

│   ├── repositories

│   └── usecases

│
└── presentation

```
├── pages

├── widgets

└── controllers
```

```

---

# 14. Database Structure

Folder:

```

database

```

Structure:

```

database

│
├── migrations

│
├── seeders

│
├── scripts

│
├── backups

│
└── README.md

```

---

# 15. Documentation Structure

Folder:

```

documentation

```

Structure:

```

documentation

│
├── 01_PROJECT_OVERVIEW

├── 02_BUSINESS_ANALYSIS

├── 03_REQUIREMENTS

├── 04_SOFTWARE_SPECIFICATION

├── 05_MODELING

├── 06_ARCHITECTURE

├── 07_DATABASE

├── 08_SECURITY

├── 09_FRONTEND

├── 10_BACKEND

├── 11_MOBILE

└── 12_DEPLOYMENT

```

---

# 16. Infrastructure Structure

Folder:

```

infrastructure

```

Contains deployment resources:

```

infrastructure

│
├── docker

│
├── nginx

│
├── kubernetes

│
├── monitoring

│
└── deployment

```

---

# 17. Docker Structure

```

docker

│
├── backend

│   └── Dockerfile

│
├── frontend

│
├── mobile

│
└── docker-compose.yml

```

---

# 18. Testing Structure

Folder:

```

tests

```

Structure:

```

tests

│
├── backend

│
├── frontend

│
├── mobile

│
├── integration

│
└── end-to-end

```

---

# 19. Configuration Files

Root level:

```

steg-internship-platform

│
├── .gitignore

├── README.md

├── docker-compose.yml

├── .env.example

└── LICENSE

```

---

# 20. Git Branch Structure

Recommended branches:

```

main

development

feature/*

bugfix/*

release/*

```

Example:

```

feature/internship-management

feature/mobile-sync

feature/document-generation

```

---

# 21. Naming Conventions

## Backend

Java:

```

PascalCase

InternshipService.java

```

---

## Frontend

Files:

```

kebab-case

internship-card.component.ts

```

---

## Mobile

Dart:

```

snake_case

internship_repository.dart

```

---

# 22. Architectural Benefits

This organization provides:

## Maintainability

Developers can quickly locate features.

---

## Scalability

New modules can be added without restructuring.

---

## Team Collaboration

Each developer can work independently.

---

## Clean Separation

Business logic remains separated from technical details.

---

# 23. Conclusion

The proposed folder structure provides a professional organization for the STEG Internship Management Platform.

By separating applications, business modules, documentation, infrastructure, and testing resources, the project becomes easier to maintain, evolve, and eventually scale toward an enterprise-level digital platform.