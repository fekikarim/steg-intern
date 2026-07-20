package tn.steg.backend.applications.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.candidates.entity.Candidate;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "internship_applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternshipApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.DRAFT;

    @Column(name = "submitted_online")
    @Builder.Default
    private Boolean submittedOnline = false;

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @OneToOne(mappedBy = "application", fetch = FetchType.LAZY)
    private tn.steg.backend.internships.entity.Internship internship;

    @OneToMany(mappedBy = "application", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.documents.entity.ApplicationDocument> documents = new HashSet<>();
}
