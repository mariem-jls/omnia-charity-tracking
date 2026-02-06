package com.omnia.omnia.Entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "aid_types")
@Getter
@Setter
@ToString
@EqualsAndHashCode@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AidType {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column( unique = true)
    private String name; // Ex: "Colis alimentaire", "Médicaments génériques"

    @Enumerated(EnumType.STRING)
    private AidCategory category;

    private String description;

    private String unit; // "kg", "litre", "pièce", "boîte", "pack"

    @Builder.Default
    private Boolean active = true;

    // Pour les besoins statistiques
    @Builder.Default
    private Integer defaultQuantity = 1;

    private String icon; // Pour l'UI: "food", "medicine", "clothing"
}