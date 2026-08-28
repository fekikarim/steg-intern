package tn.steg.backend.roles.service;

import tn.steg.backend.roles.dto.CreateRoleRequest;
import tn.steg.backend.roles.dto.RoleResponse;
import tn.steg.backend.roles.dto.UpdateRoleRequest;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    List<RoleResponse> getAllRoles();
    RoleResponse getRoleById(UUID id);
    RoleResponse createRole(CreateRoleRequest request);
    RoleResponse updateRole(UUID id, UpdateRoleRequest request);
}
