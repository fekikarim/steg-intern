package tn.steg.backend.users.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.common.BaseEntity;

import java.time.LocalDateTime;

/**
 * Retains hashes of a user's previous passwords so password reuse can be
 * detected. Bound to a user and pruned to the policy history size.
 */
@Entity
@Table(name = "password_history", uniqueConstraints = {
        @UniqueConstraint(name = "uk_password_history_user_hash", columnNames = {"user_id", "password_hash"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordHistory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "used_at", nullable = false)
    private LocalDateTime usedAt;
}
