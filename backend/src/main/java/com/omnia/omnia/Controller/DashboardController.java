package com.omnia.omnia.Controller;


import com.omnia.omnia.Service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4300"})
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/family/{familyId}/stats")
    public ResponseEntity<?> getFamilyStats(@PathVariable UUID familyId) {
        return ResponseEntity.ok(dashboardService.getFamilyStats(familyId));
    }

    @GetMapping("/map")
    public ResponseEntity<?> getMapStats() {
        return ResponseEntity.ok(dashboardService.getMapStats());
    }

    @GetMapping("/aid-stats")
    public ResponseEntity<?> getAidStats() {
        return ResponseEntity.ok(dashboardService.getAidStats());
    }
}