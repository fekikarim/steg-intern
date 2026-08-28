# AI Agent Prompt: Finance & Reporting

## Role
You are an Angular developer tasked with implementing indemnity/payment management and management reporting.

## Objective
Digitize payment processing and provide decision-support dashboards and statistics for the Back Office.

## Instructions
1. **Payment Management**: Build a payment list with pagination, a create-payment form (internship, amount, currency), and status actions (Validate → Mark Paid). Payment statuses: PENDING → VALIDATED → PAID → ARCHIVED.
2. **Financial Security**: Gate payment actions by permission (PAYMENT_READ, PAYMENT_CREATE, PAYMENT_VALIDATE, PAYMENT_PAY). Restrict transition actions so only valid next states are offered.
3. **Dashboard**: Surface aggregated counters including pending payments, total internships, active internships, and candidate/application totals via `GET /dashboard/stats`.
4. **Reporting**: Build a reporting page (internship/payment statistics) consuming the reporting backend endpoints. Show counts per status, totals, and distribution.

## Constraints & Best Practices
- Never duplicate backend business rules in the UI; only reflect valid transitions.
- Handle loading, empty, and error states consistently.
- Use the shared steg-table, steg-modal, steg-field, steg-select, steg-button components.
- Match the existing feature module structure (core/models, core/services, features/<name>, app.routes, sidebar nav).

## Definition of Done
An administrator or finance manager can track the full payment lifecycle and view aggregated statistics in the Back Office, with all transitions enforced by the backend.
