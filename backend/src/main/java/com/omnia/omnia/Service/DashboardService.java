package com.omnia.omnia.Service;

import com.omnia.omnia.Entities.*;
import com.omnia.omnia.Repository.FamilyRepository;
import com.omnia.omnia.Repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DashboardService {

    private final FamilyRepository familyRepository;
    private final VisitRepository visitRepository;
    private final AidTypeService aidTypeService;

    /**
     * Statistiques principales du dashboard
     */
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Totaux
        stats.put("totalFamilies", familyRepository.count());
        stats.put("totalVisits", visitRepository.count());

        // Visites ce mois
        LocalDate firstDay = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDay = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());
        stats.put("visitsThisMonth", visitRepository.findByVisitDateBetween(firstDay, lastDay).size());

        // Familles par priorité
        Map<String, Long> priorityStats = new HashMap<>();
        for (PriorityLevel level : PriorityLevel.values()) {
            priorityStats.put(level.name(), (long) familyRepository.findByPriorityLevel(level).size());
        }
        stats.put("familiesByPriority", priorityStats);

        // Dernières visites (5)
        stats.put("recentVisits", visitRepository.findTop5ByOrderByVisitDateDesc());

        // Familles avec géolocalisation
        stats.put("familiesWithLocation", familyRepository.findByLatitudeIsNotNullAndLongitudeIsNotNull().size());

        // Visites par type
        Map<String, Long> visitsByType = new HashMap<>();
        for (VisitType type : VisitType.values()) {
            visitsByType.put(type.name(), (long) visitRepository.findByVisitType(type).size());
        }
        stats.put("visitsByType", visitsByType);

        // Statistiques mensuelles (6 derniers mois)
        stats.put("monthlyStats", getLast6MonthsStats());

        return stats;
    }

    /**
     * Statistiques pour une famille spécifique
     */
    public Map<String, Object> getFamilyStats(UUID familyId) {
        Map<String, Object> stats = new HashMap<>();

        Family family = familyRepository.findById(familyId)
                .orElseThrow(() -> new RuntimeException("Family not found"));

        stats.put("familyId", familyId);
        stats.put("familyReference", family.getReference());
        stats.put("headOfFamily", family.getHeadOfFamily());
        stats.put("priorityLevel", family.getPriorityLevel());

        // Visites de cette famille
        List<Visit> familyVisits = visitRepository.findByFamilyOrderByVisitDateDesc(family);
        stats.put("totalVisits", familyVisits.size());

        // Dernière visite
        if (!familyVisits.isEmpty()) {
            Visit lastVisit = familyVisits.get(0);
            stats.put("lastVisitDate", lastVisit.getVisitDate());
            stats.put("lastVisitType", lastVisit.getVisitType());

            long daysSince = java.time.temporal.ChronoUnit.DAYS.between(
                    lastVisit.getVisitDate(), LocalDate.now()
            );
            stats.put("daysSinceLastVisit", daysSince);
        }

        // Prochaine visite prévue
        familyVisits.stream()
                .filter(v -> v.getNextVisitDate() != null && v.getNextVisitDate().isAfter(LocalDate.now()))
                .min(Comparator.comparing(Visit::getNextVisitDate))
                .ifPresent(visit -> stats.put("nextVisitDate", visit.getNextVisitDate()));

        return stats;
    }

    /**
     * Données pour la carte interactive
     */
    public Map<String, Object> getMapData() {
        Map<String, Object> mapData = new HashMap<>();

        // Familles avec localisation
        List<Family> families = familyRepository.findByLatitudeIsNotNullAndLongitudeIsNotNull();

        List<Map<String, Object>> familyPoints = families.stream()
                .map(family -> {
                    Map<String, Object> point = new HashMap<>();
                    point.put("id", family.getId());
                    point.put("latitude", family.getLatitude());
                    point.put("longitude", family.getLongitude());
                    point.put("title", family.getHeadOfFamily());
                    point.put("description", "Famille " + family.getReference());
                    point.put("priority", family.getPriorityLevel().name());
                    point.put("familySize", family.getFamilySize());

                    // Nombre de visites
                    int visitCount = visitRepository.findByFamilyOrderByVisitDateDesc(family).size();
                    point.put("visitCount", visitCount);

                    return point;
                })
                .collect(Collectors.toList());

        mapData.put("families", familyPoints);
        mapData.put("totalFamiliesOnMap", families.size());

        // Visites avec localisation (si disponibles)
        // Note: Ajoutez cette méthode dans VisitRepository si besoin
        // List<Visit> visitsWithLocation = visitRepository.findByLocationLatIsNotNullAndLocationLngIsNotNull();

        return mapData;
    }

    /**
     * Statistiques des types d'aide
     */
    public Map<String, Object> getAidStats() {
        Map<String, Object> stats = new HashMap<>();

        List<AidType> aidTypes = aidTypeService.findAll();
        stats.put("totalAidTypes", aidTypes.size());

        // Distribution par catégorie (mock - à adapter)
        Map<String, Integer> distribution = new HashMap<>();
        distribution.put("FOOD", 45);
        distribution.put("MEDICINE", 32);
        distribution.put("CLOTHING", 28);
        distribution.put("OTHER", 15);

        stats.put("aidDistribution", distribution);

        // Types d'aide actifs
        List<AidType> activeTypes = aidTypeService.findActive();
        stats.put("activeAidTypes", activeTypes.size());

        return stats;
    }

    /**
     * Statistiques des 6 derniers mois
     */
    private List<Map<String, Object>> getLast6MonthsStats() {
        List<Map<String, Object>> monthlyStats = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy", Locale.FRENCH);

        for (int i = 5; i >= 0; i--) {
            YearMonth yearMonth = YearMonth.now().minusMonths(i);
            LocalDate start = yearMonth.atDay(1);
            LocalDate end = yearMonth.atEndOfMonth();

            Map<String, Object> monthStat = new HashMap<>();
            monthStat.put("month", yearMonth.format(formatter));
            monthStat.put("totalVisits", visitRepository.findByVisitDateBetween(start, end).size());
            monthStat.put("newFamilies", estimateNewFamilies(start, end));

            monthlyStats.add(monthStat);
        }

        return monthlyStats;
    }

    /**
     * Estimation des nouvelles familles (méthode simplifiée)
     */
    private int estimateNewFamilies(LocalDate start, LocalDate end) {
        // Pour le hackathon, on peut utiliser une estimation
        // En production, il faudrait un champ createdAt dans Family
        return (int) (Math.random() * 5) + 1; // 1-5 nouvelles familles
    }

    /**
     * Indicateurs rapides pour affichage en carte
     */
    public Map<String, Object> getQuickIndicators() {
        Map<String, Object> indicators = new HashMap<>();

        indicators.put("totalFamilies", familyRepository.count());
        indicators.put("totalVisits", visitRepository.count());

        // Visites aujourd'hui
        LocalDate today = LocalDate.now();
        indicators.put("visitsToday", visitRepository.findByVisitDate(today).size());

        // Familles haute priorité
        indicators.put("highPriorityFamilies",
                familyRepository.findByPriorityLevel(PriorityLevel.High).size());

        // Visites à venir (dans les 7 prochains jours)
        LocalDate nextWeek = today.plusDays(7);
        indicators.put("upcomingVisits",
                visitRepository.findByNextVisitDateBetween(today, nextWeek).size());

        return indicators;
    }


}