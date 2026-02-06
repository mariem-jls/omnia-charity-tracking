package com.omnia.omnia.Repository;

import com.omnia.omnia.Entities.Family;
import com.omnia.omnia.Entities.PriorityLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FamilyRepository extends JpaRepository<Family, UUID> {

    // Recherche par nom du chef de famille
    List<Family> findByHeadOfFamilyContainingIgnoreCase(String name);

    // Recherche par téléphone
    List<Family> findByPhoneContaining(String phone);

    // Recherche par niveau de priorité
    List<Family> findByPriorityLevel(PriorityLevel priorityLevel);

    // Vérifier si une référence existe
    boolean existsByReference(String reference);

    // Recherche globale (multi-critères)
    @Query("SELECT f FROM Family f WHERE " +
            "LOWER(f.headOfFamily) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.address) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.reference) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Family> search(@Param("query") String query);

    // Familles avec géolocalisation
    List<Family> findByLatitudeIsNotNullAndLongitudeIsNotNull();
}