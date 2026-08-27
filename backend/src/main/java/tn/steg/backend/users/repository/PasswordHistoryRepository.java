package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.steg.backend.users.entity.PasswordHistory;

import java.util.List;
import java.util.UUID;

public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, UUID> {

    boolean existsByUserIdAndPasswordHash(UUID userId, String passwordHash);

    @Query("""
            select ph from PasswordHistory ph
            where ph.user.id = :userId
            order by ph.usedAt desc
            """)
    List<PasswordHistory> findHistoryByUserId(@Param("userId") UUID userId);

    long countByUserId(UUID userId);

    void deleteByUserId(UUID userId);
}
