package tn.steg.backend.journals.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.steg.backend.journals.entity.JournalStatus;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JournalEntryResponse {
    private UUID id;
    private String title;
    private String description;
    private JournalStatus status;
    private LocalDate entryDate;
}
