# Accessibility Guidelines

## 1. Purpose

This document defines accessibility standards for the STEG Internship Management Platform.

The objective is to ensure that all users can interact with the platform effectively regardless of:

- Physical abilities
- Technical experience
- Device type
- Temporary limitations
- Environmental conditions

Accessibility applies to:

- Next.js Front Office
- Angular Back Office
- Flutter Mobile Application

---

# 2. Accessibility Objectives

The platform should provide:

- Clear and understandable interfaces.
- Keyboard-friendly navigation.
- Screen reader compatibility.
- Sufficient color contrast.
- Readable content.
- Accessible forms.
- Accessible interactions.
- Consistent user experience.

---

# 3. Accessibility Standard

The platform should follow:


WCAG 2.1
(Web Content Accessibility Guidelines)


Target level:


AA Compliance


The main principles are:


POUR


- Perceivable
- Operable
- Understandable
- Robust

---

# 4. Perceivable Content

Information must be presented in ways users can perceive.

---

## 4.1 Text Content

Rules:

- Use readable font sizes.
- Avoid very small text.
- Maintain clear hierarchy.
- Use meaningful headings.

Minimum recommended size:


16px for normal text


Avoid:

- Long paragraphs without structure.
- Excessive uppercase text.
- Decorative fonts.

---

# 4.2 Color Usage

Color must not be the only way to communicate information.

Bad:


Green = Accepted
Red = Rejected


Good:


✓ Accepted

✕ Rejected


Status indicators should include:

- Text label
- Optional icon
- Color

---

# 4.3 Contrast

All interfaces must respect sufficient contrast ratios.

Recommended:

Normal text:


Minimum 4.5:1


Large text:


Minimum 3:1


Examples requiring contrast:

- Text
- Buttons
- Icons
- Form labels
- Status badges

---

# 4.4 Images

Images must provide alternative descriptions.

Web:

```html
<img 
alt="Internship certificate document"
/>
```

Rules:

Informative images require alt text.
Decorative images should be ignored by screen readers.

---

# 5. Operable Interface

Users must be able to operate the platform easily.

---

## 5.1 Keyboard Navigation

All web interfaces must support keyboard usage.

Required keys:

Tab
Shift + Tab
Enter
Space
Arrow Keys
Escape

Users must be able to:

Navigate menus.
Submit forms.
Open dialogs.
Close dialogs.
Navigate tables.

---

## 5.2 Focus Management

Focused elements must be visible.

Examples:

Buttons
Inputs
Links
Menus

Never remove default focus indicators without replacement.

---

## 5.3 Touch Targets

Mobile elements must have sufficient size.

Minimum:

44px × 44px

Applies to:

Buttons
Icons
Navigation items
Checkboxes

---

## 5.4 Navigation

Navigation must be predictable.

Requirements:

Consistent menu placement.
Clear current location.
Breadcrumbs for complex pages.
Logical navigation order.

---

# 6. Understandable Interface

Users must understand the system behavior.

---

## 6.1 Language

The platform should support:

Primary:

French

Future:

Arabic
English

Language should be clearly defined.

## 6.2 Clear Labels

Buttons and actions must describe their purpose.

Good:

Submit Internship Application

Bad:

Continue

---

## 6.3 Error Messages

Errors must explain:

What happened.
Why it happened.
How to fix it.

Bad:

Invalid input

Good:

Email format is incorrect.
Please enter a valid email address.

---

## 6.4 Form Instructions

Forms must provide:

Clear labels.
Required field indicators.
Examples when necessary.
Validation feedback.

Example:

National ID *

Enter 8 digits

---

# 7. Robust Interface

The platform must work with different technologies.

---

## 7.1 Semantic HTML

Next.js and Angular applications should use semantic elements.

Example:

Good:

```html
<button>
Save
</button>
```

Bad:

```html
<div onclick="save()">
Save
</div>
```

---

## 7.2 ARIA Attributes

ARIA should be used when necessary.

Examples:

```javascript
aria-label
aria-expanded
aria-hidden
aria-describedby
```

Avoid unnecessary ARIA usage.

---

## 7.3 Screen Reader Support

The platform should support:

Web:

NVDA
JAWS
VoiceOver

Mobile:

TalkBack
VoiceOver

Requirements:

Logical reading order.
Meaningful labels.
Announced state changes.

---

# 8. Accessible Components

All components from the Component Library must support accessibility.

## Button

Requirements:

Keyboard accessible.
Clear label.
Disabled state.
Loading state announced.

---

## Input

Requirements:

Associated label.
Error message.
Required indication.

Example:

Email

[____________]

Error:
Invalid email format

---

## Modal

Requirements:

Keyboard focus trapped.
Escape closes dialog.
Screen reader announcement.
Clear title.

## Table

Requirements:

Header definitions.
Keyboard navigation.
Responsive alternative.

## Notification

Requirements:

Important notifications:

```javascript
aria-live="assertive"
```

Normal notifications:

```javascript
aria-live="polite"
```

---

## 9. Accessible Forms

Forms are critical in this platform.

Rules:

Never rely only on placeholders.
Clearly identify required fields.
Validate progressively.
Explain errors.

Example:

Application Form:

Personal Information

First Name *

Last Name *

Email *

Documents

CV *

Motivation Letter

## 10. Accessible Documents

The platform manages many administrative documents.

Requirements:

Documents must have meaningful names.
PDF files should contain selectable text.
Generated documents should respect readability.
Download actions must be accessible.

---

## 11. Mobile Accessibility

The Flutter application must support:

Android:

TalkBack

iOS:

VoiceOver

Requirements:

Semantic widgets.
Accessible labels.
Large touch areas.
Proper focus order.
Screen reader descriptions.

## 12. Accessibility in Workflows

Business workflows must remain understandable.

Example:

Internship Validation:

Before:

Approve

After:

Approve Internship Journal

The user should always understand:

Current step.
Required action.
Next action.

---

## 13. Accessibility Testing

Accessibility testing should include:

### Automated Testing

Tools:

Web:

Lighthouse
Axe DevTools
WAVE

Mobile:

Flutter Accessibility Scanner
Manual Testing

Verify:

Keyboard navigation.
Screen reader usage.
Zoom up to 200%.
Color blindness scenarios.
Mobile interaction.

## 14. Accessibility Checklist

Before releasing a feature:

### Content
 Clear headings
 Readable text
 Proper labels
 No information only through color

### Navigation
 Keyboard navigation works
 Focus indicators visible
 Navigation is predictable

### Forms
 Labels are present
 Errors are understandable
 Required fields are identified

### Components
 Buttons accessible
 Dialogs accessible
 Tables accessible
 Notifications announced

### Mobile
 Touch targets are large enough
 Screen readers supported
 Gestures are simple

---

## 15. Future Improvements

Possible future enhancements:

Full WCAG 2.2 compliance.
Voice navigation.
AI accessibility assistant.
Automatic document accessibility checking.
Custom accessibility preferences.
High contrast mode.
Text-to-speech support.

## 16. Conclusion

Accessibility is a fundamental requirement of the STEG Internship Management Platform.

By respecting accessibility standards, the platform becomes more inclusive, easier to use, and more reliable for all users.

A professional enterprise platform must not only provide powerful functionality but also guarantee that every user can access and operate its features efficiently.