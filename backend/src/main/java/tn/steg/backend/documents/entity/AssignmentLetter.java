package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assignment_letters")
@Getter
@Setter
@NoArgsConstructor
public class AssignmentLetter extends Document {
}
