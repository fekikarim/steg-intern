package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "internship_certificates")
@Getter
@Setter
@NoArgsConstructor
public class InternshipCertificate extends Document {
}
