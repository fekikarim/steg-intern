package tn.steg.backend.journals.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.journals.entity.InternshipJournal;
import java.util.Optional;
import java.util.UUID;

public interface InternshipJournalRepository extends JpaRepository<InternshipJournal, UUID> {
    Optional<InternshipJournal> findByInternshipId(UUID internshipId);
}
