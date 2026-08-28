package tn.steg.backend.candidates.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

import java.util.UUID;

@Data
public class UpdateCandidateRequest {
    private String nationalId;
    private String firstName;
    private String lastName;

    @Email(message = "Invalid email format")
    private String contactEmail;

    private String phone;
    private String address;
    private String university;
    private String speciality;
    private String diploma;
    private String skills;
    private String languages;

    private UUID userId;
}
