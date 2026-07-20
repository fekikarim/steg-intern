package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "internship_conventions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternshipConvention extends Document {
}
