package tn.steg.backend.departments.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String employeeNumber;
    private LocalDate hireDate;
    private UUID departmentId;
    private String departmentName;
    private String type;
}
