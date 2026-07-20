package tn.steg.backend.candidates.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.steg.backend.users.entity.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "candidates")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private java.util.UUID id;

    @Column(name = "national_id", unique = true)
    private String nationalId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    private String phone;
    private String address;
    private String university;
    private String speciality;
    private String diploma;

    @Column(name = "cv_file_path")
    private String cvFilePath;

    private String skills;
    private String languages;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.applications.entity.InternshipApplication> applications = new HashSet<>();

    @OneToMany(mappedBy = "candidate", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<tn.steg.backend.internships.entity.Internship> internships = new HashSet<>();
}
