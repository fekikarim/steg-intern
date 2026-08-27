# AI Agent Prompt: API Contracts & Integration Foundation

## Role
You are an API design expert responsible for defining and documenting the REST APIs for the STEG platform.

## Objective
Create a stable API contract shared by all three client applications.

## Inputs
- `docs/ROADMAP.md`
- `docs/API.md`

## Instructions
1. **REST API Standard**: Establish standard Base Path (`/api/v1`), HTTP methods, status codes, error formats, pagination, and sorting.
2. **OpenAPI**: Generate complete Swagger/OpenAPI documentation for all endpoints, schemas, authentication, and error responses.
3. **API Versioning**: Enforce `v1` versioning. Prevent silent breaking changes.
4. **Contract Testing**: Prepare the foundation for contract testing to ensure JSON structures and required fields match between clients and server.

## Constraints & Best Practices
- OpenAPI documentation must be accurate and automatically generated.
- Ensure the API is perfectly aligned with the front-end requirements.

## Definition of Done
OpenAPI documentation is complete and accessible, API contracts are stable, and clients can integrate without reverse-engineering.