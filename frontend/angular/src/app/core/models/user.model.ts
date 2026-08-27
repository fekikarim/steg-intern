export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  LOCKED = 'LOCKED'
}

export interface UserProfile {
  id: string;
  email: string;
  enabled: boolean;
  status: UserStatus;
  roleName: string;
  permissions: string[];
}

export interface UserResponse {
  id: string;
  email: string;
  enabled: boolean;
  status: UserStatus;
  roleName: string;
  createdAt?: string;
}

export interface RoleResponse {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}
