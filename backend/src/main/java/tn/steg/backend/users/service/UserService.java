package tn.steg.backend.users.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.steg.backend.users.dto.CreateUserRequest;
import tn.steg.backend.users.dto.UpdateUserRequest;
import tn.steg.backend.users.dto.UserProfileResponse;
import tn.steg.backend.users.dto.UserResponse;

import java.util.UUID;

public interface UserService {
    UserProfileResponse getCurrentUserProfile();
    Page<UserResponse> getAllUsers(Pageable pageable);
    UserResponse getUserById(UUID id);
    UserResponse createUser(CreateUserRequest request);
    UserResponse updateUser(UUID id, UpdateUserRequest request);
    void deleteUser(UUID id);
    void unlockUser(UUID id);
    void lockUser(UUID id);
}
