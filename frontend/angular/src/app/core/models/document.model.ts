export type DocumentType =
  | 'INTERNSHIP_CONVENTION'
  | 'ASSIGNMENT_LETTER'
  | 'INTERNSHIP_CERTIFICATE'
  | 'CV'
  | 'MOTIVATION_LETTER'
  | 'UNIVERSITY_CONVENTION'
  | 'TRANSCRIPT'
  | 'NATIONAL_ID';

export interface DocumentResponse {
  id: string;
  reference: string;
  type: DocumentType;
  storageKey?: string;
  mimeType?: string;
  size?: number;
  version?: number;
  generatedAutomatically?: boolean;
  createdDate?: string;
  internshipId?: string;
}

export interface UploadDocumentRequest {
  type: DocumentType;
  internshipId: string;
  storageKey: string;
  mimeType?: string;
  size?: number;
}
