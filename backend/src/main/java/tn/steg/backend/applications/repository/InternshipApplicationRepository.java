package tn.steg.backend.applications.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.applications.entity.ApplicationStatus;
import tn.steg.backend.applications.entity.InternshipApplication;
import java.util.List;
import java.util.UUID;

public interface InternshipApplicationRepository extends JpaRepository<InternshipApplication, UUID> {
    Page<InternshipApplication> findByStatus(ApplicationStatus status, Pageable pageable);
    List<InternshipApplication> findByCandidateId(UUID candidateId);
    long countByStatus(ApplicationStatus status);
}
