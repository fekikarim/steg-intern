package tn.steg.backend.deliverables.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.deliverables.entity.Deliverable;
import tn.steg.backend.deliverables.entity.DeliverableStatus;
import java.util.List;
import java.util.UUID;

public interface DeliverableRepository extends JpaRepository<Deliverable, UUID> {
    List<Deliverable> findByInternshipId(UUID internshipId);
    List<Deliverable> findByStatus(DeliverableStatus status);
}
