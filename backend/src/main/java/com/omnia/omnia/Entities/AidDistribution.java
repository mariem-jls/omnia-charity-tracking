package com.omnia.omnia.Entities;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AidDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "visit_id", nullable = false)
    private Visit visit;

    @ManyToOne
    @JoinColumn(name = "aid_type_id", nullable = false)
    private AidType aidType;

    private String description; // Détails supplémentaires

    @Column(nullable = false)
    private Integer quantity;

    // Unit peut être héritée de AidType, mais on la garde ici pour flexibilité
    private String unit;

    private LocalDate expirationDate; // Important pour médicaments/nourriture

    @Column(length = 500)
    private String notes;

    @Builder.Default
    private LocalDateTime distributedAt = LocalDateTime.now();
}
