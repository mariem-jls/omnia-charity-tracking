package com.omnia.omnia.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "visits")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "family_id", nullable = false)
    private Family family;

    @ManyToOne
    @JoinColumn(name = "volunteer_id")
    private User volunteer; // Peut être null si pas d'authentification

    // Alternative si User pas encore implémenté :
    // private String volunteerName;
    // private String volunteerContact;

    @Column(nullable = false)
    private LocalDate visitDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VisitType visitType = VisitType.REGULAR;

    @Column(length = 2000)
    private String observations;

    // Géolocalisation de la visite
    private Double locationLat;

    private Double locationLng;

    // Aides distribuées lors de cette visite
    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<AidDistribution> aidDistributions = new ArrayList<>();

    // ✅ Besoins identifiés lors de la visite
    @ElementCollection
    @CollectionTable(name = "visit_identified_needs", joinColumns = @JoinColumn(name = "visit_id"))
    @Column(name = "need_description", length = 1000)
    @Builder.Default
    private List<String> identifiedNeeds = new ArrayList<>();

    private LocalDate nextVisitDate;

    // Pour mode hors-ligne (très important pour votre cas d'usage)
    @Builder.Default
    private Boolean synced = true;

    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();

    // Méthode utilitaire pour ajouter une aide
    public void addAidDistribution(AidDistribution aid) {
        aidDistributions.add(aid);
        aid.setVisit(this);
    }
}
