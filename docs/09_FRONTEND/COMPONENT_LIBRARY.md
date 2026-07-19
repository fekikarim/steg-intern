# Component Library

## 1. Purpose

This document defines the reusable UI component library for the STEG Internship Management Platform.

The goal is to ensure that every interface across the Front Office (Next.js), Back Office (Angular), and Mobile Application (Flutter) uses a consistent set of reusable components.

Benefits include:

- Consistent user experience
- Faster development
- Easier maintenance
- Reduced code duplication
- Improved scalability
- Better accessibility

---

# 2. Design Principles

Every component must be:

- Reusable
- Configurable
- Accessible
- Responsive
- Stateless whenever possible
- Easy to test
- Fully documented

---

# 3. Naming Convention

Components should use PascalCase.

Examples:

```
Button
Input
TextArea
Card
DataTable
Badge
UserAvatar
NotificationCard
ProgressTimeline
```

Component filenames:

```
Button.tsx
DataTable.tsx
UserAvatar.tsx
```

---

# 4. Atomic Design

The component library follows Atomic Design principles.

```
Atoms
↓

Molecules
↓

Organisms
↓

Templates
↓

Pages
```

---

# 5. Atoms

Atoms are the smallest reusable UI elements.

---

## Button

Purpose

Execute user actions.

Variants

- Primary
- Secondary
- Outline
- Ghost
- Danger
- Success

Properties

```
text

icon

loading

disabled

size

fullWidth
```

Examples

```
Save

Cancel

Delete

Submit
```

---

## Icon

Purpose

Represent actions visually.

Examples

```
Search

Edit

Delete

Download

Upload

Settings

Notifications
```

Recommended Library

```
Lucide Icons
```

---

## Label

Purpose

Display field names.

Must support

- Required indicator
- Optional helper text

---

## Input

Purpose

Single-line text entry.

Supports

- Text
- Email
- Password
- Number
- Search
- Phone

Features

- Validation
- Error message
- Disabled state
- Read-only
- Prefix/Suffix icons

---

## TextArea

Purpose

Multi-line input.

Used for

- Comments
- Descriptions
- Journal entries
- Feedback

---

## Checkbox

Used for

- Multiple selection
- Permissions
- Agreements

---

## Radio Group

Used for

- Single selection

---

## Switch

Used for

Boolean values.

Examples

```
Enable Account

Receive Notifications

Dark Mode (future)
```

---

## Badge

Purpose

Display status.

Examples

```
ACTIVE

PENDING

APPROVED

REJECTED

ARCHIVED
```

Variants

- Success
- Warning
- Error
- Info
- Neutral

---

## Avatar

Displays

- User photo

or

- Initials

---

## Divider

Separates content.

---

## Spinner

Loading indicator.

Used only when skeleton loading is not possible.

---

# 6. Molecules

Molecules combine multiple atoms.

---

## Search Bar

Contains

- Input
- Search icon
- Clear button

Supports

- Debounce
- Instant search

---

## Form Field

Contains

- Label
- Input
- Helper text
- Validation message

---

## Password Field

Contains

- Password input
- Show/Hide button

---

## Pagination

Supports

- Previous
- Next
- Page selection
- Page size

---

## Breadcrumb

Example

```
Dashboard

>

Internships

>

Details
```

---

## Alert

Variants

- Success
- Warning
- Error
- Information

---

## Confirmation Dialog

Used for

- Delete
- Reject
- Cancel
- Archive

---

## File Upload

Supports

- Drag & Drop
- Click Upload
- Progress
- Preview
- Validation

---

## Date Picker

Used for

- Internship dates
- Evaluations
- Payments
- Reports

---

## Select

Supports

- Search
- Multi-select
- Async loading

---

# 7. Organisms

Organisms are larger reusable sections.

---

## Navigation Bar

Front Office

Contains

- Logo
- Navigation links
- Notifications
- User menu

---

## Sidebar

Back Office

Contains

- Logo
- Navigation
- User profile
- Collapse button

---

## Header

Contains

- Title
- Breadcrumb
- Action buttons

---

## Data Table

One of the most important components.

Supports

- Pagination
- Sorting
- Search
- Filtering
- Export
- Row selection
- Bulk actions
- Responsive mode

Used for

- Candidates
- Internships
- Payments
- Documents
- Users

---

## Dashboard Cards

Displays KPIs.

Example

```
Active Internships

152
```

---

## Statistics Cards

Examples

```
Candidates

Interns

Payments

Departments

Documents
```

---

## Timeline

Displays

- Internship progress
- Workflow history
- Journal history

---

## Activity Feed

Displays

Recent system actions.

Examples

```
Candidate submitted application

Supervisor approved journal

Payment validated
```

---

## Notification Center

Displays

- Read notifications
- Unread notifications
- Filters
- Mark as read

---

## Comment Section

Supports

- Threaded comments (future)
- Replies (future)
- Mentions (future)
- Attachments (future)

---

## Progress Tracker

Displays internship completion.

Example

```
Planning

Completed

↓

Active

↓

Evaluation

↓

Completed
```

---

## Document Viewer

Supports

- PDF
- Images
- Download
- Print

---

# 8. Templates

Templates define reusable page layouts.

---

## Dashboard Layout

Structure

```
Sidebar

Top Bar

↓

Dashboard Cards

↓

Charts

↓

Recent Activities
```

---

## Management Layout

Structure

```
Header

↓

Filters

↓

Data Table

↓

Pagination
```

---

## Form Layout

Structure

```
Header

↓

Sections

↓

Form Fields

↓

Actions
```

---

## Details Layout

Structure

```
Summary Card

↓

Tabs

↓

Details

↓

History

↓

Documents
```

---

# 9. Mobile Components

Specific Flutter components.

---

## Bottom Navigation

Tabs

- Home
- Tasks
- Journal
- Notifications
- Profile

---

## Timeline Card

Displays

Daily internship events.

---

## Task Card

Displays

- Title
- Due Date
- Status

---

## Journal Card

Displays

- Date
- Summary
- Validation status

---

## Deliverable Card

Displays

- File
- Upload date
- Validation status

---

## Evaluation Card

Displays

- Score
- Feedback
- Date

---

# 10. Layout Components

Reusable containers.

Examples

```
Container

Page

Section

Card

Grid

Flex

Stack

Spacer
```

---

# 11. Feedback Components

Reusable user feedback.

Components

- Toast
- Snackbar
- Alert
- Modal
- Loading Overlay
- Skeleton Loader
- Empty State

---

# 12. Status Components

Standardized status visualization.

Examples

Application Status

```
Draft

Submitted

Under Review

Accepted

Rejected
```

Internship Status

```
Planned

Active

Completed

Archived
```

Payment Status

```
Pending

Validated

Paid
```

---

# 13. Charts

Reusable dashboard charts.

Examples

- Bar Chart
- Pie Chart
- Line Chart
- Area Chart

Used only for reporting and dashboards.

---

# 14. Accessibility Requirements

Every component must support:

- Keyboard navigation
- Screen readers
- Visible focus state
- Color contrast
- ARIA attributes (Web)
- Semantic HTML (Web)
- Accessibility labels (Flutter)

---

# 15. Component Properties

Every reusable component should expose configurable properties where appropriate.

Common properties include:

```
variant

size

disabled

loading

icon

children

className (Web)

style

onClick

onChange

id

name
```

---

# 16. Documentation Standard

Each component should include:

- Purpose
- Usage
- Properties
- Events
- States
- Accessibility notes
- Example implementation

---

# 17. Folder Structure

Example (Web)

```
components/

├── ui/
│   ├── Button/
│   ├── Input/
│   ├── Badge/
│   ├── Card/
│   ├── Modal/
│   ├── Table/
│   ├── Avatar/
│   ├── Spinner/
│   └── Alert/
│
├── layout/
│   ├── Sidebar/
│   ├── Header/
│   ├── Footer/
│   └── Navigation/
│
├── dashboard/
│
├── forms/
│
├── tables/
│
├── charts/
│
├── notifications/
│
└── common/
```

Flutter

```
lib/

components/

widgets/

shared/

common/

layouts/
```

---

# 18. Future Components

Future versions may include:

- Rich Text Editor
- Calendar Scheduler
- Kanban Board
- OCR Document Viewer
- Signature Pad
- Workflow Designer
- AI Assistant Widget
- Chat Component
- Video Meeting Component

---

# 19. Component Development Rules

Every new component must:

- Be reusable before being feature-specific.
- Avoid business logic whenever possible.
- Be independently testable.
- Respect the design system.
- Support responsive layouts.
- Follow accessibility guidelines.
- Include loading, empty, and error states when applicable.

---

# 20. Conclusion

A well-structured Component Library is the foundation of a scalable and maintainable frontend architecture.

By centralizing reusable UI components and enforcing consistent design and development standards, the STEG Internship Management Platform ensures a cohesive experience across the Front Office, Back Office, and Mobile applications while significantly reducing development effort and improving long-term maintainability.