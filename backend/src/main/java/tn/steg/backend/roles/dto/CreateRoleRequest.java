package tn.steg.backend.roles.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;
import java.util.UUID;

@Data
public class CreateRoleRequest {
    @NotBlank(message = "Role name is required")
    private String name;

    private String description;

    private Set<UUID> permissionIds;
}
