# Responsive Design

## 1. Purpose

This document defines the responsive design strategy for the STEG Internship Management Platform.

The objective is to ensure that all user interfaces provide an optimal experience across different devices and screen sizes while maintaining:

- Usability
- Accessibility
- Performance
- Visual consistency
- Functional completeness

This applies to:

- Next.js Front Office
- Angular Back Office
- Flutter Mobile Application

---

# 2. Responsive Design Principles

The platform follows a mobile-first and adaptive design approach.

Main principles:

- Design for the smallest screen first.
- Progressively enhance for larger screens.
- Maintain functionality across devices.
- Avoid unnecessary horizontal scrolling.
- Prioritize important information.
- Adapt navigation depending on device capabilities.

---

# 3. Supported Devices

The platform should support:

## Desktop

Examples:

- Office computers
- Large monitors
- Laptops

Primary users:

- HR Managers
- Administrators
- Finance Managers
- Directors

---

## Tablet

Examples:

- iPad
- Android tablets

Primary users:

- Supervisors
- Managers
- Mobile employees

---

## Smartphone

Examples:

- Android phones
- iOS phones

Primary users:

- Interns
- Candidates
- Supervisors during field activities

---

# 4. Breakpoint Strategy

The web applications use standard responsive breakpoints.

Recommended breakpoints:

| Device | Width | Usage |
|---|---|---|
| Mobile Small | < 640px | Smartphones |
| Mobile Large | 640px - 768px | Large phones |
| Tablet | 768px - 1024px | Tablets |
| Desktop | 1024px - 1280px | Standard screens |
| Large Desktop | > 1280px | Large monitors |

---

# 5. Mobile First Approach

All components must be designed starting from mobile constraints.

Example:

Mobile:

```
Card
 |
Image
 |
Title
 |
Information
 |
Action
```

Desktop:

```
------------------------------------------------
| Image | Title | Information | Actions        |
------------------------------------------------
```

---

# 6. Layout System

The platform uses flexible layouts.

Recommended techniques:

- CSS Grid
- Flexbox
- Responsive containers
- Fluid sizing
- Relative units

Avoid:

- Fixed widths
- Absolute positioning for layouts
- Hardcoded dimensions

---

# 7. Container Rules

Pages should use responsive containers.

Example:

Desktop:

```
max-width: 1280px
margin: auto
```

Tablet:

```
padding: 24px
```

Mobile:

```
padding: 16px
```

---

# 8. Grid System

The platform uses adaptive grids.

Example:

Dashboard cards:

Desktop:

```
4 columns

[Card][Card][Card][Card]
```

Tablet:

```
2 columns

[Card][Card]

[Card][Card]
```

Mobile:

```
1 column

[Card]

[Card]

[Card]
```

---

# 9. Navigation Responsiveness

## Front Office

Desktop:

```
Logo

Home

Internships

Apply

Applications

Notifications

Profile
```

Mobile:

```
Top Header

Content

Bottom Navigation
```

---

## Back Office

Desktop:

```
Sidebar

Dashboard

Candidates

Internships

Documents

Payments
```

Tablet:

```
Collapsed Sidebar
```

Mobile:

```
Drawer Menu
```

---

## Mobile Application

Flutter navigation:

```
Bottom Navigation Bar

Home

Tasks

Journal

Notifications

Profile
```

---

# 10. Responsive Tables

Tables are critical in the Back Office.

Large screens:

Full table:

```
-------------------------------------------------
| Name | Department | Status | Supervisor | Date |
-------------------------------------------------
```

---

Tablet:

Hide secondary columns:

```
--------------------------------
| Name | Status | Actions       |
--------------------------------
```

---

Mobile:

Convert table into cards:

```
----------------------
Name

Department

Status

Actions
----------------------
```

---

# 11. Responsive Forms

Forms must adapt according to screen size.

Desktop:

Two-column layout:

```
--------------------------------
| First Name | Last Name       |
--------------------------------

| Email      | Phone           |
--------------------------------
```

Mobile:

Single column:

```
First Name

Last Name

Email

Phone
```

---

# 12. Responsive Cards

Cards must:

- Resize automatically.
- Maintain readable content.
- Avoid overflow.

Example:

Desktop:

```
+--------------------------------+
| Internship Information         |
| Student                        |
| Supervisor                     |
| Status                         |
+--------------------------------+
```

Mobile:

```
+----------------+
| Internship     |
| Student        |
| Supervisor     |
| Status         |
+----------------+
```

---

# 13. Typography Scaling

Typography must remain readable.

Rules:

- Avoid fixed small text.
- Use scalable units.
- Maintain hierarchy.

Example:

Desktop:

```
Title: 32px

Subtitle: 20px

Body: 16px
```

Mobile:

```
Title: 24px

Subtitle: 18px

Body: 14-16px
```

---

# 14. Touch Interaction

Mobile interfaces must respect touch guidelines.

Minimum touch target:

```
44px x 44px
```

Buttons must have:

- Enough spacing.
- Clear visual feedback.
- No accidental clicks.

---

# 15. Images and Files

Images should be responsive.

Requirements:

- Maintain aspect ratio.
- Lazy load when possible.
- Optimize file size.
- Provide fallback states.

Documents:

- Preview should adapt.
- Download actions remain accessible.

---

# 16. Responsive Dashboards

Dashboards must adapt information density.

Desktop:

```
Statistics

Charts

Tables

Activities
```

Tablet:

```
Statistics

Charts

Important Tables
```

Mobile:

```
Important Statistics

Recent Activities

Quick Actions
```

---

# 17. Responsive Workflow Pages

Complex workflows should remain understandable.

Desktop:

```
Step 1 → Step 2 → Step 3 → Step 4
```

Mobile:

```
Step 1

↓

Step 2

↓

Step 3

↓

Step 4
```

---

# 18. Responsive Modal Behavior

Desktop:

Centered modal:

```
---------------------
|                   |
|     Content       |
|                   |
---------------------
```

Mobile:

Full-screen modal:

```
---------------------
| Header             |
|
| Content            |
|
| Actions            |
---------------------
```

---

# 19. Responsive Search

Desktop:

```
Search + Filters + Sorting
```

Mobile:

```
Search

↓

Filter Button

↓

Filter Drawer
```

---

# 20. Responsive Notifications

Desktop:

Notification panel:

```
----------------
Notification 1
Notification 2
Notification 3
----------------
```

Mobile:

Full page:

```
Notifications

Notification 1

Notification 2
```

---

# 21. Performance Considerations

Responsive design must consider performance.

Recommendations:

- Optimize images.
- Lazy load components.
- Avoid loading unused desktop components on mobile.
- Minimize network requests.
- Compress assets.

---

# 22. Accessibility Requirements

Responsive interfaces must maintain accessibility.

Requirements:

- Proper text scaling.
- Keyboard navigation.
- Screen reader compatibility.
- Sufficient contrast.
- Accessible touch targets.

---

# 23. Testing Strategy

Every interface must be tested on:

## Mobile

Examples:

- iPhone
- Android smartphone

---

## Tablet

Examples:

- iPad
- Android tablet

---

## Desktop

Examples:

- 1366×768
- 1920×1080

---

# 24. Browser Compatibility

Supported browsers:

Desktop:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

Mobile:

- Chrome Android
- Safari iOS

---

# 25. Responsive Development Rules

Developers must:

- Avoid fixed layouts.
- Use reusable responsive components.
- Test every screen size.
- Verify accessibility.
- Handle overflow cases.
- Optimize mobile performance.

---

# 26. Future Improvements

Possible enhancements:

- Progressive Web App support.
- Offline mode.
- Adaptive layouts based on user role.
- Personalized mobile dashboards.
- Advanced gesture interactions.

---

# 27. Conclusion

Responsive design ensures that the STEG Internship Management Platform remains usable and efficient regardless of the device used.

By applying a mobile-first strategy, adaptive layouts, responsive components, and accessibility standards, the platform provides a consistent experience for candidates, interns, supervisors, and STEG employees across all environments.