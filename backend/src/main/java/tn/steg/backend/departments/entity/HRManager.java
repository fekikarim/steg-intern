package tn.steg.backend.departments.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hr_managers")
@Getter
@Setter
@NoArgsConstructor
public class HRManager extends Employee {
}
