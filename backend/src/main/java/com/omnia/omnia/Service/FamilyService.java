package com.omnia.omnia.Service;


import com.omnia.omnia.Entities.Family;
import com.omnia.omnia.Repository.FamilyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class FamilyService {

    private final FamilyRepository familyRepository;

    public List<Family> findAll() {
        return familyRepository.findAll();
    }

    public Family findById(UUID id) {
        return familyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Family not found with id: " + id));
    }

    public Family create(Family family) {
        // Générer une référence unique si non fournie
        if (family.getReference() == null || family.getReference().isEmpty()) {
            String ref = "FAM-" + System.currentTimeMillis() % 10000;
            family.setReference(ref);
        }

        // Vérifier unicité de la référence
        if (familyRepository.existsByReference(family.getReference())) {
            throw new RuntimeException("Family reference already exists: " + family.getReference());
        }

        return familyRepository.save(family);
    }

    public Family update(UUID id, Family familyDetails) {
        Family family = findById(id);

        // Mettre à jour les champs
        family.setHeadOfFamily(familyDetails.getHeadOfFamily());
        family.setPhone(familyDetails.getPhone());
        family.setAddress(familyDetails.getAddress());
        family.setFamilySize(familyDetails.getFamilySize());
        family.setNeedsDescription(familyDetails.getNeedsDescription());
        family.setPriorityLevel(familyDetails.getPriorityLevel());
        family.setNotes(familyDetails.getNotes());

        // Géolocalisation
        if (familyDetails.getLatitude() != null && familyDetails.getLongitude() != null) {
            family.setLatitude(familyDetails.getLatitude());
            family.setLongitude(familyDetails.getLongitude());
        }

        return familyRepository.save(family);
    }

    public void delete(UUID id) {
        Family family = findById(id);
        familyRepository.delete(family);
    }

    public List<Family> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        return familyRepository.search(query.trim());
    }

    public List<Family> findByPriority(String priority) {
        try {
            return familyRepository.findByPriorityLevel(
                    com.omnia.omnia.Entities.PriorityLevel.valueOf(priority.toUpperCase())
            );
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid priority level: " + priority);
        }
    }

    public long count() {
        return familyRepository.count();
    }
}