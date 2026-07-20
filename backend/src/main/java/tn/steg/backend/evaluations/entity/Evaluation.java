package tn.steg.backend.evaluations.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.departments.entity.Supervisor;
import tn.steg.backend.internships.entity.Internship;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EvaluationType type;

    @Column(name = "evaluation_date", nullable = false)
    private LocalDate evaluationDate;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private Supervisor evaluator;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<EvaluationScore> scores = new HashSet<>();
}
