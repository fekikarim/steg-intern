package tn.steg.backend.candidates.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CandidateResponse {
    private UUID id;
    private String nationalId;
    private String firstName;
    private String lastName;
    private String contactEmail;
    private String phone;
    private String address;
    private String university;
    private String speciality;
    private String diploma;
    private String skills;
    private String languages;
}
