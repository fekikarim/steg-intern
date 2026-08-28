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
public class SupervisorResponse {
    private UUID id;
    private String firstName;
    private String lastName;
    private String employeeNumber;
    private String phoneNumber;
    private String position;
    private LocalDate hireDate;
    private UUID departmentId;
    private String departmentName;
    private int totalAssignments;
    private int activeAssignments;
    private boolean hasActiveInternship;
}
