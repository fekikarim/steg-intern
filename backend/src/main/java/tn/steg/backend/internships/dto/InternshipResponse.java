package tn.steg.backend.internships.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.internships.entity.InternshipStatus;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipResponse {
    private UUID id;
    private String reference;
    private LocalDate startDate;
    private LocalDate endDate;
    private InternshipStatus status;
    private UUID candidateId;
    private String candidateName;
}
