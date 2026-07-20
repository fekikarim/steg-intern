package tn.steg.backend.users.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.UUID;

@Data
public class UpdateUserRequest {
    @Email(message = "Invalid email format")
    private String email;

    private UUID roleId;

    private Boolean enabled;
}
