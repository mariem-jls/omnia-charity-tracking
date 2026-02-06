package com.omnia.omnia.Service;


import com.omnia.omnia.Entities.AidCategory;
import com.omnia.omnia.Entities.AidType;
import com.omnia.omnia.Repository.AidTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class AidTypeService {

    private final AidTypeRepository aidTypeRepository;

    public List<AidType> findAll() {
        return aidTypeRepository.findAll();
    }

    public AidType findById(UUID id) {
        return aidTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("AidType not found with id: " + id));
    }

    public AidType create(AidType aidType) {
        // Vérifier si le nom existe déjà
        if (aidTypeRepository.findByName(aidType.getName()) != null) {
            throw new RuntimeException("AidType with name '" + aidType.getName() + "' already exists");
        }

        return aidTypeRepository.save(aidType);
    }

    public AidType update(UUID id, AidType aidTypeDetails) {
        AidType aidType = findById(id);

        aidType.setName(aidTypeDetails.getName());
        aidType.setCategory(aidTypeDetails.getCategory());
        aidType.setDescription(aidTypeDetails.getDescription());
        aidType.setUnit(aidTypeDetails.getUnit());
        aidType.setActive(aidTypeDetails.getActive());
        aidType.setDefaultQuantity(aidTypeDetails.getDefaultQuantity());
        aidType.setIcon(aidTypeDetails.getIcon());

        return aidTypeRepository.save(aidType);
    }

    public void delete(UUID id) {
        AidType aidType = findById(id);
        aidTypeRepository.delete(aidType);
    }

    public List<AidType> findByCategory(String category) {
        try {
            AidCategory aidCategory = AidCategory.valueOf(category.toUpperCase());
            return aidTypeRepository.findByCategory(aidCategory);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid category: " + category);
        }
    }

    public List<AidType> findActive() {
        return aidTypeRepository.findByActiveTrue();
    }

    public AidType findByName(String name) {
        AidType aidType = aidTypeRepository.findByName(name);
        if (aidType == null) {
            throw new RuntimeException("AidType not found with name: " + name);
        }
        return aidType;
    }

    /**
     * Initialise les types d'aide par défaut (pour le premier démarrage)
     */
    public void initializeDefaultAidTypes() {
        if (aidTypeRepository.count() == 0) {
            List<AidType> defaultTypes = Arrays.asList(
                    AidType.builder()
                            .name("Colis alimentaire")
                            .category(AidCategory.FOOD)
                            .description("Panier alimentaire de base")
                            .unit("kg")
                            .defaultQuantity(1)
                            .icon("food")
                            .active(true)
                            .build(),

                    AidType.builder()
                            .name("Médicaments génériques")
                            .category(AidCategory.MEDICINE)
                            .description("Médicaments essentiels")
                            .unit("boîte")
                            .defaultQuantity(1)
                            .icon("medicine")
                            .active(true)
                            .build(),

                    AidType.builder()
                            .name("Vêtements")
                            .category(AidCategory.CLOTHING)
                            .description("Vêtements pour adultes et enfants")
                            .unit("pièce")
                            .defaultQuantity(5)
                            .icon("clothing")
                            .active(true)
                            .build(),

                    AidType.builder()
                            .name("Aide financière")
                            .category(AidCategory.FINANCIAL)
                            .description("Aide monétaire directe")
                            .unit("DT")
                            .defaultQuantity(100)
                            .icon("money")
                            .active(true)
                            .build(),

                    AidType.builder()
                            .name("Kit hygiène")
                            .category(AidCategory.HYGIENE)
                            .description("Produits d'hygiène personnelle")
                            .unit("kit")
                            .defaultQuantity(1)
                            .icon("hygiene")
                            .active(true)
                            .build(),

                    AidType.builder()
                            .name("Fournitures scolaires")
                            .category(AidCategory.SCHOOL)
                            .description("Cartables, cahiers, stylos")
                            .unit("kit")
                            .defaultQuantity(1)
                            .icon("school")
                            .active(true)
                            .build()
            );

            aidTypeRepository.saveAll(defaultTypes);
        }
    }
}