package tn.steg.backend.documents.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.internships.entity.Internship;

@Entity
@Table(name = "internship_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternshipDocument extends Document {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false, insertable = false, updatable = false)
    private Internship internshipRef;
}
