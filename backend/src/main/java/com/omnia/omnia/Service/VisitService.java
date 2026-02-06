package com.omnia.omnia.Service;


import com.omnia.omnia.Entities.Family;
import com.omnia.omnia.Entities.Visit;
import com.omnia.omnia.Repository.FamilyRepository;
import com.omnia.omnia.Repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class VisitService {

    private final VisitRepository visitRepository;
    private final FamilyRepository familyRepository;

    public List<Visit> findAll() {
        return visitRepository.findAll();
    }

    public Visit findById(UUID id) {
        return visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found with id: " + id));
    }

    public Visit create(Visit visit, UUID familyId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found with id: " + familyId));

        visit.setFamily(family);
        visit.setSynced(true); // Par défaut synchronisé

        if (visit.getVisitDate() == null) {
            visit.setVisitDate(LocalDate.now());
        }

        return visitRepository.save(visit);
    }

    public Visit update(UUID id, Visit visitDetails) {
        Visit visit = findById(id);

        visit.setVisitDate(visitDetails.getVisitDate());
        visit.setVisitType(visitDetails.getVisitType());
        visit.setObservations(visitDetails.getObservations());
        visit.setLocationLat(visitDetails.getLocationLat());
        visit.setLocationLng(visitDetails.getLocationLng());
        visit.setNextVisitDate(visitDetails.getNextVisitDate());

        return visitRepository.save(visit);
    }

    public void delete(UUID id) {
        Visit visit = findById(id);
        visitRepository.delete(visit);
    }

    public List<Visit> findByFamily(UUID familyId) {
        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found"));
        return visitRepository.findByFamilyOrderByVisitDateDesc(family);
    }

    public List<Visit> findRecentVisits() {
        return visitRepository.findByVisitDateBetween(
                LocalDate.now().minusMonths(1),
                LocalDate.now()
        );
    }
}
