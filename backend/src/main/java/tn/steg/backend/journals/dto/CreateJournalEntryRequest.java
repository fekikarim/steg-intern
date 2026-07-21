package tn.steg.backend.journals.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class CreateJournalEntryRequest {
    @NotNull(message = "Journal ID is required")
    private UUID journalId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
}
