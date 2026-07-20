package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assignment_letters")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignmentLetter extends Document {
}
