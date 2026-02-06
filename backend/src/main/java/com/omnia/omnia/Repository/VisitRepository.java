package com.omnia.omnia.Repository;


import com.omnia.omnia.Entities.Family;
import com.omnia.omnia.Entities.Visit;
import com.omnia.omnia.Entities.VisitType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Repository
public interface VisitRepository extends JpaRepository<Visit, UUID> {

    // Visites d'une famille
    List<Visit> findByFamilyOrderByVisitDateDesc(Family family);

    // Visites par type
    List<Visit> findByVisitType(VisitType visitType);

    // Visites entre deux dates
    List<Visit> findByVisitDateBetween(LocalDate start, LocalDate end);

    // Visites non synchronisées (pour mode hors-ligne)
    List<Visit> findBySyncedFalse();

    Object findTop5ByOrderByVisitDateDesc();

    Collection<Object> findByVisitDate(LocalDate today);

    Collection<Object> findByNextVisitDateBetween(LocalDate today, LocalDate nextWeek);
}
