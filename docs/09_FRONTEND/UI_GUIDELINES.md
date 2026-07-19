# UI Guidelines

## 1. Purpose

This document defines the User Interface (UI) standards for the STEG Internship Management Platform.

Its objectives are to:

- Maintain visual consistency across all applications.
- Improve usability and readability.
- Reduce design complexity.
- Simplify frontend development.
- Provide reusable UI standards for current and future developers.
- Establish a scalable Design System.

This document applies to:

- Next.js Front Office
- Angular Back Office
- Flutter Mobile Application (adapted where applicable)

---

# 2. Design Philosophy

The platform follows the following principles:

- Simple
- Professional
- Modern
- Minimalistic
- Accessible
- Responsive
- Consistent
- Fast

The interface should prioritize functionality over decoration.

---

# 3. Design Principles

## Consistency

Every screen should follow the same visual language.

Examples:

- Same button styles
- Same spacing
- Same typography
- Same colors
- Same icons
- Same navigation behavior

---

## Simplicity

Avoid unnecessary visual complexity.

Interfaces should:

- Display only useful information.
- Minimize distractions.
- Keep actions obvious.
- Reduce cognitive load.

---

## Clarity

Every action should be immediately understandable.

Users should always know:

- Where they are.
- What they can do.
- What happened.
- What will happen next.

---

## Predictability

UI behavior should remain consistent throughout the application.

Examples:

- Save buttons always appear in the same location.
- Delete actions always require confirmation.
- Success notifications behave consistently.

---

## Feedback

Every user action must produce immediate feedback.

Examples:

- Loading indicators.
- Success messages.
- Validation messages.
- Error alerts.
- Progress indicators.

---

# 4. Visual Identity

The interface should reflect the identity of a governmental and enterprise platform.

Characteristics:

- Professional
- Trustworthy
- Clean
- Structured
- Modern

Avoid:

- Excessive animations
- Bright colors
- Decorative effects
- Complex gradients

---

# 5. Color Palette

## Primary Color

Used for:

- Main buttons
- Active menus
- Links
- Icons
- Navigation

Suggested:

```
Blue
```

---

## Secondary Color

Used for:

- Secondary actions
- Information panels
- Supporting elements

Suggested:

```
Gray
```

---

## Success

Used for:

- Successful operations
- Validations
- Approved workflows

Suggested:

```
Green
```

---

## Warning

Used for:

- Alerts
- Missing information
- Pending operations

Suggested:

```
Orange
```

---

## Error

Used for:

- Validation errors
- Rejected operations
- Failed requests

Suggested:

```
Red
```

---

## Information

Used for:

- Notifications
- Informational messages

Suggested:

```
Light Blue
```

---

# 6. Typography

Recommended font:

```
Inter
```

Fallback:

```
Roboto
Arial
Sans-serif
```

---

## Heading Hierarchy

```
H1
Page Title

H2
Section Title

H3
Subsection

H4
Card Title
```

---

## Font Weights

| Usage | Weight |
|----------|---------|
| Main Title | Bold |
| Section Title | SemiBold |
| Labels | Medium |
| Text | Regular |
| Helper Text | Light |

---

# 7. Spacing System

Use a consistent spacing scale.

Recommended spacing:

```
4 px
8 px
12 px
16 px
24 px
32 px
48 px
64 px
```

Never use arbitrary spacing values.

---

# 8. Grid System

Desktop:

```
12-column grid
```

Tablet:

```
8-column grid
```

Mobile:

```
4-column grid
```

Layouts should remain consistent across the application.

---

# 9. Border Radius

Use consistent rounded corners.

Recommended:

| Component | Radius |
|------------|--------|
| Buttons | 8px |
| Cards | 12px |
| Inputs | 8px |
| Dialogs | 12px |
| Tables | 8px |

---

# 10. Shadows

Shadows should remain subtle.

Use shadows only for:

- Cards
- Dialogs
- Dropdowns
- Floating menus

Avoid excessive elevation.

---

# 11. Icons

Recommended icon library:

```
Lucide Icons
```

Alternative:

```
Material Symbols
```

Rules:

- Consistent icon size.
- Consistent stroke width.
- No decorative icons.
- Icons must support actions.

---

# 12. Buttons

## Primary Button

Purpose:

Main action.

Examples:

- Save
- Submit
- Login
- Approve

Characteristics:

- Filled
- High emphasis

---

## Secondary Button

Purpose:

Alternative actions.

Examples:

- Cancel
- Back
- Edit

Characteristics:

- Outlined

---

## Tertiary Button

Purpose:

Low priority actions.

Characteristics:

- Text only

---

## Danger Button

Purpose:

Destructive actions.

Examples:

- Delete
- Reject
- Remove

Requires confirmation dialog.

---

# 13. Forms

Forms should follow consistent patterns.

Rules:

- Labels always visible.
- Placeholder is not a label.
- Required fields clearly identified.
- Related fields grouped together.
- Logical ordering.

Example:

```
Personal Information

First Name
Last Name
Email
Phone
```

---

# 14. Inputs

Every input should support:

- Label
- Placeholder
- Helper text
- Error message
- Disabled state
- Read-only state

Validation should occur:

- On submit
- Optionally on blur

Avoid validation on every keystroke.

---

# 15. Tables

Tables are heavily used in the Back Office.

Features:

- Sorting
- Pagination
- Search
- Filters
- Column resizing
- Export
- Responsive behavior

---

# 16. Cards

Cards group related information.

Examples:

- Candidate summary
- Internship details
- Statistics
- Dashboard widgets

Cards should include:

- Title
- Content
- Optional actions
- Consistent spacing

---

# 17. Navigation

## Front Office

Navigation:

- Top navigation bar
- Footer
- Responsive mobile menu

---

## Back Office

Navigation:

- Sidebar
- Top toolbar
- Breadcrumbs

---

## Mobile

Navigation:

- Bottom Navigation Bar
- Drawer
- Context menus

---

# 18. Dialogs

Dialogs should be used only when necessary.

Examples:

- Confirmation
- Delete
- Validation
- Preview
- Assignment

Avoid stacking multiple dialogs.

---

# 19. Notifications

Types:

- Success
- Error
- Warning
- Information

Rules:

- Short messages
- Non-blocking when possible
- Auto-dismiss for success messages
- Persistent for critical errors

---

# 20. Empty States

Every empty page should explain:

- Why it is empty.
- What the user can do.

Example:

```
No internship applications found.

Create your first application.
```

---

# 21. Loading States

Avoid blank screens.

Use:

- Skeleton loaders
- Progress indicators
- Spinners (only when necessary)

---

# 22. Error States

Error screens should:

- Explain the problem.
- Suggest corrective actions.
- Provide retry options.

Example:

```
Unable to load applications.

Retry
```

---

# 23. Status Indicators

Use badges for statuses.

Examples:

```
Draft
Submitted
Accepted
Rejected
Pending
Completed
Archived
```

Each status must have:

- Color
- Icon (optional)
- Label

---

# 24. Dashboard Widgets

Dashboard cards should display:

- KPI
- Title
- Value
- Trend (optional)
- Last updated

Example:

```
Active Internships

152

+12%
```

---

# 25. Data Visualization

Charts should remain simple.

Preferred charts:

- Bar Chart
- Line Chart
- Pie Chart
- Area Chart

Avoid overly complex visualizations.

---

# 26. Responsive Behavior

All interfaces must support:

- Desktop
- Laptop
- Tablet
- Mobile

No horizontal scrolling should occur under normal usage.

---

# 27. Dark Mode

Dark mode is not included in the first version.

The design system should remain compatible with future implementation.

---

# 28. Design System

All UI components should be reusable.

Examples:

- Button
- Card
- Modal
- Table
- Input
- Select
- Badge
- Alert
- Pagination
- Breadcrumb
- Avatar
- Timeline
- Notification
- Tabs

---

# 29. Consistency Rules

Every new screen must:

- Follow the same spacing.
- Reuse existing components.
- Respect the color palette.
- Respect typography.
- Follow accessibility standards.
- Follow responsive design guidelines.

---

# 30. Future Improvements

Potential enhancements include:

- Complete Design Token system.
- Theme customization.
- Dark mode.
- Custom STEG branding.
- Multi-language typography adjustments.
- Advanced animation guidelines.
- Figma component synchronization.

---

# 31. Conclusion

A consistent user interface is essential for delivering a professional, maintainable, and user-friendly platform.

By following these guidelines, the STEG Internship Management Platform will provide a unified experience across the Front Office, Back Office, and Mobile applications while ensuring scalability, accessibility, and ease of future development.