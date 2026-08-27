# AI Agent Prompt: Notification System (Backend)

## Role
You are a Backend Developer tasked with setting up the notification logic for the STEG platform.

## Objective
Create a unified notification architecture shared by all applications.

## Inputs
- `docs/ROADMAP.md`

## Instructions
1. **In-App Notifications**: Implement endpoints to track read/unread states, priority, timestamps, and entity navigation.
2. **Email System**: Use a simple email architecture for confirmations, workflow reminders, and password resets. Do not use expensive external infrastructures unnecessarily.
3. **Push Notifications**: Integrate Firebase Cloud Messaging (FCM) for Flutter push notifications (validation, deliverables, new tasks).
4. **Rules**: Ensure every notification has a valid business reason (no spam).

## Constraints & Best Practices
- Never let the core business transaction fail because the secondary notification service is temporarily unavailable. (Implement graceful degradation/retries).

## Definition of Done
Notification endpoints and sending mechanisms (Email, Push, In-App) are fully functional and correctly integrated with critical workflow events.