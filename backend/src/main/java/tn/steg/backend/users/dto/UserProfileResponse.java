package tn.steg.backend.users.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.users.entity.UserStatus;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private UUID id;
    private String email;
    private Boolean enabled;
    private UserStatus status;
    private String roleName;
    private Set<String> permissions;
}
