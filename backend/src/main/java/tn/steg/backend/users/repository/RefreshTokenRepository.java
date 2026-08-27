package tn.steg.backend.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.steg.backend.users.entity.RefreshToken;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByToken(String token);

    List<RefreshToken> findByUserId(UUID userId);

    long countByUserIdAndRevokedFalse(UUID userId);

    @Query("select count(rt) > 0 from RefreshToken rt where rt.user.id = :userId and rt.revoked = true")
    boolean existsRevokedForUser(@Param("userId") UUID userId);

    @Modifying
    @Query("update RefreshToken rt set rt.revoked = true where rt.user.id = :userId and rt.revoked = false")
    int revokeAllActiveForUser(@Param("userId") UUID userId);

    void deleteByUserId(UUID userId);

    void deleteByExpiryDateBefore(LocalDateTime cutoff);
}
