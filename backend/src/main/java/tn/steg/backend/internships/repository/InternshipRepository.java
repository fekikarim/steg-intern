package tn.steg.backend.internships.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import tn.steg.backend.internships.entity.Internship;
import tn.steg.backend.internships.entity.InternshipStatus;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InternshipRepository extends JpaRepository<Internship, UUID>, JpaSpecificationExecutor<Internship> {
    Optional<Internship> findByReference(String reference);
    Page<Internship> findByStatus(InternshipStatus status, Pageable pageable);
    long countByStatus(InternshipStatus status);
    List<Internship> findByCandidateIdAndStatusIn(UUID candidateId, Collection<InternshipStatus> statuses);
}
