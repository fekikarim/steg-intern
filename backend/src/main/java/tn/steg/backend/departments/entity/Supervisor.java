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
public class Supervisor extends Employee {

    private String position;

    @OneToMany(mappedBy = "supervisor", fetch = FetchType.LAZY)
    private Set<tn.steg.backend.assignments.entity.InternshipAssignment> assignments = new HashSet<>();
}
