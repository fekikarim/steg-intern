import { CreateCandidateRequest } from './admin.model';

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
export type InternshipStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';
export type AssignmentStatus = 'ACTIVE' | 'ENDED' | 'REASSIGNED' | 'CANCELLED';

export interface CandidateResponse {
  id: string;
  nationalId?: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  university?: string;
  speciality?: string;
  diploma?: string;
  skills?: string;
  languages?: string;
  userId?: string | null;
}

export interface UpdateCandidateRequest {
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  contactEmail?: string;
  phone?: string;
  address?: string;
  university?: string;
  speciality?: string;
  diploma?: string;
  skills?: string;
  languages?: string;
}

export interface ApplicationResponse {
  id: string;
  reference: string;
  status: ApplicationStatus;
  submittedOnline: boolean;
  submissionDate?: string;
  candidateId: string;
  candidateName: string;
}

export interface CreateApplicationRequest {
  candidateId?: string;
  candidate?: CreateCandidateRequest;
  submittedOnline?: boolean;
}

export interface InternshipResponse {
  id: string;
  reference: string;
  startDate: string;
  endDate: string;
  status: InternshipStatus;
  candidateId: string;
  candidateName: string;
}

export interface CreateInternshipRequest {
  candidateId: string;
  applicationId?: string;
  startDate: string;
  endDate: string;
}

export interface AssignmentResponse {
  id: string;
  assignmentDate: string;
  status: AssignmentStatus;
  internshipId: string;
  internshipReference: string;
  departmentId: string;
  departmentName: string;
  supervisorId: string;
  supervisorName: string;
  assignedById?: string | null;
  assignedByName?: string | null;
}

export interface CreateAssignmentRequest {
  internshipId: string;
  departmentId: string;
  supervisorId: string;
  assignedById?: string;
  assignmentDate?: string;
}

export interface SupervisorResponse {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber?: string;
  phoneNumber?: string;
  position?: string;
  hireDate?: string;
  departmentId?: string | null;
  departmentName?: string | null;
  totalAssignments: number;
  activeAssignments: number;
  hasActiveInternship: boolean;
}

export interface SupervisorInternshipResponse {
  assignmentId: string;
  internshipId: string;
  internshipReference: string;
  candidateId?: string;
  candidateName?: string;
  internshipStatus: InternshipStatus;
  startDate: string;
  endDate: string;
  assignmentDate: string;
  departmentName?: string | null;
}

export interface InternshipStats {
  totalInternships: number;
  planned: number;
  active: number;
  completed: number;
  cancelled: number;
  archived: number;
  upcomingStarts: number;
  upcomingEndings: number;
  pendingAssignments: number;
}
