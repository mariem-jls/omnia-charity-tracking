package com.omnia.omnia.Controller;


import com.omnia.omnia.Entities.Visit;
import com.omnia.omnia.Service.VisitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/visits")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4300"})
public class VisitController {

    private final VisitService visitService;

    @GetMapping
    public ResponseEntity<List<Visit>> getAllVisits() {
        return ResponseEntity.ok(visitService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Visit> getVisitById(@PathVariable UUID id) {
        return ResponseEntity.ok(visitService.findById(id));
    }

    @PostMapping("/family/{familyId}")
    public ResponseEntity<Visit> createVisit(
            @PathVariable UUID familyId,
            @RequestBody Visit visit) {
        return new ResponseEntity<>(
                visitService.create(visit, familyId),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Visit> updateVisit(
            @PathVariable UUID id,
            @RequestBody Visit visit) {
        return ResponseEntity.ok(visitService.update(id, visit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable UUID id) {
        visitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/family/{familyId}")
    public ResponseEntity<List<Visit>> getVisitsByFamily(@PathVariable UUID familyId) {
        return ResponseEntity.ok(visitService.findByFamily(familyId));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Visit>> getRecentVisits() {
        return ResponseEntity.ok(visitService.findRecentVisits());
    }
}