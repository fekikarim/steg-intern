package tn.steg.backend.comments.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.steg.backend.comments.entity.Comment;
import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Comment> findByTargetTypeAndTargetId(String targetType, UUID targetId);
    List<Comment> findByAuthorId(UUID authorId);
}
