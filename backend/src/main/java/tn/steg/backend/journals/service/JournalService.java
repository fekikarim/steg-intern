package tn.steg.backend.journals.service;

import tn.steg.backend.journals.dto.CreateJournalEntryRequest;
import tn.steg.backend.journals.dto.JournalEntryResponse;
import tn.steg.backend.journals.dto.JournalResponse;

import java.util.UUID;

public interface JournalService {
    JournalResponse getJournalByInternship(UUID internshipId);
    JournalEntryResponse createEntry(CreateJournalEntryRequest request);
    JournalEntryResponse validateEntry(UUID entryId);
    JournalEntryResponse rejectEntry(UUID entryId);
}
