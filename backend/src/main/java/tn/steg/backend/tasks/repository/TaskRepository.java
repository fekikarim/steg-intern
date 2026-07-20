package tn.steg.backend.tasks.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.tasks.entity.Task;
import tn.steg.backend.tasks.entity.TaskStatus;
import java.util.List;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    List<Task> findByInternshipId(UUID internshipId);
    List<Task> findByStatus(TaskStatus status);
}
