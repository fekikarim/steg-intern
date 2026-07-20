package tn.steg.backend.candidates.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.candidates.entity.Candidate;
import java.util.Optional;
import java.util.UUID;

public interface CandidateRepository extends JpaRepository<Candidate, UUID> {
    Optional<Candidate> findByContactEmail(String email);
    Optional<Candidate> findByNationalId(String nationalId);
}
