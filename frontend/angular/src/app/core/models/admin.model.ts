export interface Permission {
  id: string;
  code: string;
  description?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  roleId: string;
  enabled: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  roleId?: string;
  enabled?: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface DepartmentResponse {
  id: string;
  code: string;
  name: string;
  description?: string;
  parentId?: string | null;
  children: DepartmentResponse[];
}

export interface CreateDepartmentRequest {
  code: string;
  name: string;
  description?: string;
  parentId?: string | null;
}

export interface AuditResponse {
  id: string;
  action: string;
  entityName: string;
  entityId?: string;
  oldValue?: string;
  newValue?: string;
  ipAddress?: string;
  createdAt: string;
  actorEmail?: string;
}
