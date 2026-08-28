package tn.steg.backend.users.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.users.dto.PermissionResponse;
import tn.steg.backend.users.entity.Permission;
import tn.steg.backend.users.repository.PermissionRepository;
import tn.steg.backend.users.service.PermissionService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PermissionResponse> getAllPermissions() {
        return permissionRepository.findAll(Sort.by(Sort.Direction.ASC, "code")).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private PermissionResponse toResponse(Permission permission) {
        return PermissionResponse.builder()
                .id(permission.getId())
                .code(permission.getCode())
                .description(permission.getDescription())
                .build();
    }
}