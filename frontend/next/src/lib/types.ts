export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
};

export type UserStatus = "ACTIVE" | "INACTIVE" | "LOCKED";

export type UserProfile = {
  id: string;
  email: string;
  enabled: boolean;
  status: UserStatus;
  roleName: string;
  permissions: string[];
};

export type CandidateProfile = {
  id: string;
  nationalId: string | null;
  firstName: string;
  lastName: string;
  contactEmail: string;
  phone: string | null;
  address: string | null;
  university: string | null;
  speciality: string | null;
  diploma: string | null;
  skills: string | null;
  languages: string | null;
  userId: string | null;
};

export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";

export type Application = {
  id: string;
  reference: string;
  status: ApplicationStatus;
  submittedOnline: boolean;
  submissionDate: string | null;
  candidateId: string;
  candidateName: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  university?: string;
  speciality?: string;
};

export type ApiErrorBody = {
  timestamp: string;
  code: string;
  status: number;
  message: string;
  path?: string;
  fieldErrors?: Record<string, string>;
};
