package tn.steg.backend.departments.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "supervisors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supervisor extends Employee {

    private String position;

    @OneToMany(mappedBy = "supervisor", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<tn.steg.backend.assignments.entity.InternshipAssignment> assignments = new HashSet<>();
}
