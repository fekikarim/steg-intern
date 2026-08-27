# AI Agent Prompt: Offline & Sync (Mobile)

## Role
You are a Flutter developer implementing advanced resilience patterns.

## Objective
Provide resilient mobile behavior in unstable network environments without compromising backend authority.

## Instructions
1. **Local Cache**: Cache internships, tasks, drafts, downloaded documents, and notifications.
2. **Pending Operations Queue**: Queue journal drafts, task changes, and pending uploads while offline.
3. **Synchronization Logic**: Sync local changes to the backend when the network is restored.
4. **Conflict Management**: Enforce that administrative backend decisions have priority. Use controlled merge rules for user drafts.
5. **Retry Mechanism**: Implement a finite retry loop (e.g., Attempt 1, 2, 3 -> Failed) for sync operations.

## Constraints & Best Practices
- Offline mode must never silently lose user-generated information.
- Background tasks should respect device battery limitations.

## Definition of Done
The app handles network interruptions gracefully, queuing and synchronizing data reliably once back online.