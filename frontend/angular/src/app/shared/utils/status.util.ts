import { BadgeVariant } from '../components/badge/badge.component';

export interface StatusConfig {
  label: string;
  variant: BadgeVariant;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Application
  DRAFT: { label: 'Draft', variant: 'neutral' },
  SUBMITTED: { label: 'Submitted', variant: 'info' },
  UNDER_REVIEW: { label: 'Under review', variant: 'info' },
  ACCEPTED: { label: 'Accepted', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
  // Internship
  PLANNED: { label: 'Planned', variant: 'neutral' },
  ACTIVE: { label: 'Active', variant: 'success' },
  COMPLETED: { label: 'Completed', variant: 'info' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  ARCHIVED: { label: 'Archived', variant: 'neutral' },
  // Assignment
  ENDED: { label: 'Ended', variant: 'neutral' },
  REASSIGNED: { label: 'Reassigned', variant: 'warning' },
  // Payment
  PENDING: { label: 'Pending', variant: 'warning' },
  VALIDATED: { label: 'Validated', variant: 'info' },
  PAID: { label: 'Paid', variant: 'success' },
  // Task
  TODO: { label: 'To do', variant: 'neutral' },
  IN_PROGRESS: { label: 'In progress', variant: 'info' },
  // Journal / Deliverable
  VALIDATED_ENTRY: { label: 'Validated', variant: 'success' },
  // User
  ACTIVE_USER: { label: 'Active', variant: 'success' },
  INACTIVE: { label: 'Inactive', variant: 'neutral' },
  LOCKED: { label: 'Locked', variant: 'danger' },
  SUSPENDED: { label: 'Suspended', variant: 'warning' }
};

export function statusConfig(value: string | null | undefined): StatusConfig {
  if (!value) {
    return { label: '', variant: 'neutral' };
  }
  return STATUS_MAP[value] ?? { label: value.replaceAll('_', ' '), variant: 'neutral' };
}
