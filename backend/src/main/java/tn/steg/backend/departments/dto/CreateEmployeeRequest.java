package tn.steg.backend.departments.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class CreateEmployeeRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phoneNumber;
    private String employeeNumber;
    private LocalDate hireDate;

    @NotNull(message = "Department ID is required")
    private UUID departmentId;

    private String position;
    private String type;
}
