package tn.steg.backend.journals.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalResponse {
    private UUID id;
    private LocalDate createdDate;
    private UUID internshipId;
    private Set<JournalEntryResponse> entries;
}
