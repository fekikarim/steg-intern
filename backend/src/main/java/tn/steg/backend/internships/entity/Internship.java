package tn.steg.backend.internships.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.applications.entity.InternshipApplication;
import tn.steg.backend.candidates.entity.Candidate;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "internships")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(nullable = false, unique = true)
    private String reference;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InternshipStatus status = InternshipStatus.PLANNED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id")
    private InternshipApplication application;

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.assignments.entity.InternshipAssignment> assignments = new HashSet<>();

    @OneToOne(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private tn.steg.backend.journals.entity.InternshipJournal journal;

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.tasks.entity.Task> tasks = new HashSet<>();

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.deliverables.entity.Deliverable> deliverables = new HashSet<>();

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.evaluations.entity.Evaluation> evaluations = new HashSet<>();

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.documents.entity.InternshipDocument> documents = new HashSet<>();

    @OneToMany(mappedBy = "internship", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.finance.entity.Payment> payments = new HashSet<>();
}
