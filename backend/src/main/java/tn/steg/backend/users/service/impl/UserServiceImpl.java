package tn.steg.backend.users.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.exception.BusinessException;
import tn.steg.backend.exception.ResourceNotFoundException;
import tn.steg.backend.users.dto.CreateUserRequest;
import tn.steg.backend.users.dto.UpdateUserRequest;
import tn.steg.backend.users.dto.UserProfileResponse;
import tn.steg.backend.users.dto.UserResponse;
import tn.steg.backend.users.entity.Permission;
import tn.steg.backend.users.entity.Role;
import tn.steg.backend.users.entity.User;
import tn.steg.backend.users.entity.UserStatus;
import tn.steg.backend.users.repository.RoleRepository;
import tn.steg.backend.users.repository.UserRepository;
import tn.steg.backend.users.service.UserService;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return toProfileResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email already exists");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .enabled(request.getEnabled() != null ? request.getEnabled() : true)
                .status(UserStatus.ACTIVE)
                .role(role)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
            user.setRole(role);
        }
        if (request.getEnabled() != null) {
            user.setEnabled(request.getEnabled());
        }

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserProfileResponse toProfileResponse(User user) {
        Set<String> permissions = user.getRole().getPermissions().stream()
                .map(Permission::getCode)
                .collect(Collectors.toSet());
        return UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .status(user.getStatus())
                .roleName(user.getRole().getName())
                .permissions(permissions)
                .build();
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .enabled(user.getEnabled())
                .status(user.getStatus())
                .roleName(user.getRole().getName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
