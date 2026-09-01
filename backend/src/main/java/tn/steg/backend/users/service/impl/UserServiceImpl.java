package tn.steg.backend.users.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.steg.backend.audit.annotation.Audited;
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
import tn.steg.backend.users.repository.RefreshTokenRepository;
import tn.steg.backend.users.repository.UserRepository;
import tn.steg.backend.users.service.UserService;
import tn.steg.backend.realtime.RealtimeEvent;
import tn.steg.backend.realtime.RealtimeService;

import java.util.ArrayList;
import java.util.List;
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
    private final RefreshTokenRepository refreshTokenRepository;
    private final RealtimeService realtimeService;

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
    public Page<UserResponse> getAllUsers(String search, String roleName, String status, Pageable pageable) {
        Specification<User> spec = buildSearchSpec(search, roleName, status);
        return userRepository.findAll(spec, pageable).map(this::toResponse);
    }

    private Specification<User> buildSearchSpec(String search, String roleName, String status) {
        return (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();
            if (search != null && !search.isBlank()) {
                String like = "%" + search.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("email")), like),
                        cb.like(cb.lower(root.get("role").get("name")), like)
                ));
            }
            if (roleName != null && !roleName.isBlank()) {
                predicates.add(cb.equal(root.get("role").get("name"), roleName));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), UserStatus.valueOf(status.toUpperCase())));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
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
    @Audited(action = "CREATE", entity = "USER", entityId = "#result.id", newValue = "#result")
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

        UserResponse response = toResponse(userRepository.save(user));
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.CREATED, response.getId().toString()));
        return response;
    }

    @Override
    @Transactional
    @Audited(action = "UPDATE", entity = "USER", entityId = "#args[0]", oldValue = "#args[0]", newValue = "#result")
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

        UserResponse response = toResponse(userRepository.save(user));
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.UPDATED, id.toString()));
        return response;
    }

    @Override
    @Transactional
    @Audited(action = "DELETE", entity = "USER", entityId = "#args[0]")
    public void deleteUser(UUID id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.DELETED, id.toString()));
    }

    @Override
    @Transactional
    @Audited(action = "UNLOCK", entity = "USER", entityId = "#args[0]")
    public void unlockUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        user.setStatus(UserStatus.ACTIVE);
        userRepository.save(user);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.STATUS_CHANGED, id.toString(), "User unlocked"));
    }

    @Override
    @Transactional
    @Audited(action = "LOCK", entity = "USER", entityId = "#args[0]")
    public void lockUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(UserStatus.LOCKED);
        user.setLockedUntil(null);
        userRepository.save(user);
        refreshTokenRepository.revokeAllActiveForUser(id);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.STATUS_CHANGED, id.toString(), "User locked"));
    }

    @Override
    @Transactional
    @Audited(action = "ENABLE", entity = "USER", entityId = "#args[0]")
    public void enableUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setEnabled(true);
        if (user.getStatus() == UserStatus.INACTIVE) {
            user.setStatus(UserStatus.ACTIVE);
        }
        userRepository.save(user);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.STATUS_CHANGED, id.toString(), "User enabled"));
    }

    @Override
    @Transactional
    @Audited(action = "DISABLE", entity = "USER", entityId = "#args[0]")
    public void disableUser(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setEnabled(false);
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);
        realtimeService.broadcast(RealtimeEvent.of(RealtimeEvent.Entity.USER, RealtimeEvent.Action.STATUS_CHANGED, id.toString(), "User disabled"));
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
