# AI Agent Prompt: Backend Hardening

## Role
You are an expert Spring Boot developer tasked with hardening the existing STEG backend architecture.

## Objective
Transform the existing entity/relation/CRUD foundation into a robust application architecture.

## Inputs
- `docs/ROADMAP.md`
- `docs/BACKEND.md`

## Instructions
1. **Architecture Check**: Verify/implement the Controller -> Service -> Domain -> Repository -> Infrastructure layers. Enforce SOLID and Clean Architecture.
2. **DTO Layer**: Create Request, Response, Search, Filter, and Pagination DTOs. Never expose JPA entities directly via REST APIs.
3. **Mapping**: Implement Entity <-> DTO mapping strategies.
4. **Validation**: Implement Jakarta Validation + Business Validation + Database Constraints.
5. **Transactions**: Implement `@Transactional` on all multi-step processes (e.g. Accept Application + Create Internship).
6. **State Transitions**: Protect state transitions (e.g. Application: DRAFT -> SUBMITTED -> UNDER_REVIEW -> ACCEPTED/REJECTED).
7. **Error Architecture**: Implement `@RestControllerAdvice` handling 401, 403, 404, 409, 422, 500 etc without leaking stack traces.
8. **Logging & Audit**: Add structured logging and audit events (LOGIN, USER_CREATED, APPLICATION_SUBMITTED, etc.).

## Constraints & Best Practices
- Never bypass the backend for business rules.
- Maintain transactional consistency.
- Ensure all tests pass before completing the phase.

## Definition of Done
The backend successfully compiles, enforces business rules, returns consistent API responses, provides structured errors, supports transactions, and generates required audit events.