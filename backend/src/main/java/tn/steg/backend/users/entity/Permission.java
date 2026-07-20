package tn.steg.backend.users.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.common.BaseEntity;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permission extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    private String description;
}
