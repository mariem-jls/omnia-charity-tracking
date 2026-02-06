package com.omnia.omnia.Repository;

import com.omnia.omnia.Entities.AidCategory;
import com.omnia.omnia.Entities.AidType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AidTypeRepository extends JpaRepository<AidType, UUID> {

    // Par catégorie
    List<AidType> findByCategory(AidCategory category);

    // Types actifs
    List<AidType> findByActiveTrue();

    // Par nom
    AidType findByName(String name);
}