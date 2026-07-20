package tn.steg.backend.journals.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.journals.entity.JournalEntry;
import tn.steg.backend.journals.entity.JournalStatus;
import java.util.List;
import java.util.UUID;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, UUID> {
    List<JournalEntry> findByJournalId(UUID journalId);
    List<JournalEntry> findByStatus(JournalStatus status);
}
