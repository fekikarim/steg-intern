package tn.steg.backend.users.service;

import tn.steg.backend.users.dto.PermissionResponse;

import java.util.List;

public interface PermissionService {
    List<PermissionResponse> getAllPermissions();
}