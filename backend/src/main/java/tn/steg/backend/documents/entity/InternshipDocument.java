package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "internship_documents")
@Getter
@Setter
@NoArgsConstructor
public class InternshipDocument extends Document {
}
