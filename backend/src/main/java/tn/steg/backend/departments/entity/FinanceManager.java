package tn.steg.backend.departments.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "finance_managers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FinanceManager extends Employee {
}
